const test = require("node:test");
const assert = require("node:assert/strict");
const ts = require("typescript");
const fs = require("node:fs");
const vm = require("node:vm");
const scope = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("lib/lab-routing.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { module: scope, exports: scope.exports },
);
const lab = scope.exports;
test("observations route to the selected trade, with unsure sent to staff triage", () => {
  for (const symptom of lab.homeSymptoms) {
    assert.match(lab.homeServicePath(symptom, "Water / drains"), /Plumbing/);
    assert.match(
      lab.homeServicePath(symptom, "Power / lighting"),
      /Electrical/,
    );
    assert.match(lab.homeServicePath(symptom, "Not sure"), /triage/);
  }
  assert.match(
    lab.homeServicePath(
      "I want better comfort or efficiency",
      "Heating / cooling",
    ),
    /upgrade/,
  );
});
test("changing upstream selections clears stale downstream answers and rejects unsupported options", () => {
  let answers = {};
  lab.eventSteps.forEach((step, i) => {
    answers = lab.updateRoutingAnswer(
      answers,
      lab.eventSteps,
      i,
      step.options[0],
    );
  });
  assert.ok(answers.lodging);
  answers = lab.updateRoutingAnswer(answers, lab.eventSteps, 1, "201+");
  assert.equal(answers.guests[0], "201+");
  assert.equal(answers.lodging, undefined);
  assert.equal(answers.type[0], "Corporate meeting");
  assert.equal(
    lab.updateRoutingAnswer(answers, lab.eventSteps, 0, "invalid"),
    answers,
  );
});
test("none and unsure options cannot contradict positive multi-selections", () => {
  let answers = {};
  answers = lab.updateRoutingAnswer(
    answers,
    lab.eventSteps,
    4,
    "Microphones / sound",
  );
  answers = lab.updateRoutingAnswer(
    answers,
    lab.eventSteps,
    4,
    "Screens / projection",
  );
  assert.equal(answers.production.length, 2);
  answers = lab.updateRoutingAnswer(answers, lab.eventSteps, 4, "No AV needed");
  assert.equal(answers.production.join(","), "No AV needed");
  answers = lab.updateRoutingAnswer(
    answers,
    lab.eventSteps,
    4,
    "Stage / lighting",
  );
  assert.equal(answers.production.join(","), "Stage / lighting");
});
test("event and consultation briefs preserve all routing requirements", () => {
  for (const steps of [lab.eventSteps, lab.consultationSteps]) {
    let answers = {};
    steps.forEach((step, i) => {
      answers = lab.updateRoutingAnswer(answers, steps, i, step.options[0]);
    });
    const brief = lab.routingBrief(steps, answers);
    for (const step of steps) {
      assert.ok(brief.includes(step.label));
      assert.ok(brief.includes(step.options[0]));
    }
    assert.ok(!brief.includes("Not selected"));
  }
});
