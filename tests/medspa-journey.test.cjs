const test=require('node:test');
const assert=require('node:assert/strict');
const ts=require('typescript');
const fs=require('node:fs');
const vm=require('node:vm');
function load(path){const scope={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module:scope,exports:scope.exports});return scope.exports;}
const journey=load('lib/medspa-journey.ts'), routing=load('lib/lab-routing.ts');
test('Pro branches discussion choices by goal and provider choices by location',()=>{
 const face=journey.medspaJourneySteps({goal:['Explore facial concerns'],location:['City studio']});
 const body=journey.medspaJourneySteps({goal:['Explore body concerns'],location:['Garden clinic']});
 assert.ok(face[1].options.includes('Expression lines'));
 assert.ok(!body[1].options.includes('Expression lines'));
 assert.ok(body[1].options.includes('Scars'));
 assert.ok(face[4].options.includes('City consultation team'));
 assert.ok(!face[4].options.includes('Garden consultation team'));
 assert.ok(body[4].options.includes('Garden consultation team'));
});
test('editing a goal or location clears incompatible selections through consultation',()=>{
 let answers={};
 for(let i=0;i<7;i++){const steps=journey.medspaJourneySteps(answers);answers=routing.updateRoutingAnswer(answers,steps,i,steps[i].options[0]);}
 assert.ok(answers.consultation);
 let next=routing.updateRoutingAnswer(answers,journey.medspaJourneySteps(answers),3,'Garden clinic');
 assert.equal(next.goal[0],answers.goal[0]);
 for(const key of ['provider','support','consultation'])assert.equal(next[key],undefined);
 next=routing.updateRoutingAnswer(answers,journey.medspaJourneySteps(answers),0,'Explore body concerns');
 for(const key of ['concern','family','location','provider','support','consultation'])assert.equal(next[key],undefined);
});
test('Pro carries all seven selections into a six-stage journey and supports unsure alone',()=>{
 let answers={};
 for(let i=0;i<7;i++){const steps=journey.medspaJourneySteps(answers);answers=routing.updateRoutingAnswer(answers,steps,i,steps[i].options[0]);}
 const summary=routing.routingBrief(journey.medspaJourneySteps(answers),answers);
 assert.ok(!summary.includes('Not selected'));
 assert.equal(journey.journeyStages.length,6);
 assert.equal(journey.journeyStage(3),journey.journeyStage(4));
 assert.equal(journey.journeyStage(6),5);
 answers=routing.updateRoutingAnswer(answers,journey.medspaJourneySteps(answers),1,'Unsure / discuss with the team');
 assert.equal(answers.concern.join(','),'Unsure / discuss with the team');
});
