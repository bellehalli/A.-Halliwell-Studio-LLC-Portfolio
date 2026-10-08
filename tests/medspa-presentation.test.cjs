const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(file,mocks={}) {const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,require:name=>name in mocks?mocks[name]:require(name),requestAnimationFrame:fn=>fn()});return module.exports;}
const routing=load('lib/lab-routing.ts'),journey=load('lib/medspa-journey.ts');
function harness(file,props,extra={}) {
 const slots=[];let cursor=0,tree,published;
 const react={useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],value=>slots[i]=typeof value==='function'?value(slots[i]):value];},useRef(){const i=cursor++;return slots[i]||=( {current:{focus(){}}} );},useEffect(){cursor++;}};
 const shared={BriefLink:function BriefLink(){},Preview:function Preview(){},usePublishLabBrief(brief){published=brief;}};
 const options=function MedSpaOptions(){},summary=function MedSpaSelectionSummary(){};
 const Component=load(file,{react,'@/lib/lab-routing':routing,'@/lib/medspa-journey':journey,'./LabShared':shared,'./MedSpaPresentation':{MedSpaOptions:options,MedSpaSelectionSummary:summary},'next/image':{default:function Image(){}},'@/components/ui/StudioIcons':{ArrowUpRight:function Arrow(){}},...extra}).default;
 function nodes(node){if(arguments.length===0)node=tree;if(!node||typeof node!=='object')return [];return [node,...[node.props?.children].flat(Infinity).flatMap(x=>nodes(x))];}
 const render=()=>{cursor=0;tree=Component(props);return nodes();};
 return {render,nodes,options,summary,shared,get published(){return published;}};
}
test('premium routing preserves every option, completion gate and complete handoff',()=>{
 const h=harness('components/lab/RoutingEngine.tsx',{steps:routing.consultationSteps,name:'Consultation Routing Flow',projectType:'Beauty / wellness',needs:['Booking or scheduling'],disclosure:'No diagnosis.',presentation:'medspa'});
 let nodes=h.render();
 assert.ok(!nodes.some(n=>n.type===h.shared.Preview));
 for(let i=0;i<routing.consultationSteps.length;i++){
  const options=nodes.find(n=>n.type===h.options);
  assert.equal(options.props.step,routing.consultationSteps[i]);
  options.props.onChoose(options.props.step.options[0]);nodes=h.render();
  if(i<routing.consultationSteps.length-1){nodes.find(n=>n.type==='button'&&n.props.children==='Continue').props.onClick();nodes=h.render();}
 }
 assert.ok(nodes.some(n=>n.type===h.shared.Preview));
 assert.ok(!h.published.summary.includes('Not selected'));
 const edit=nodes.find(n=>n.type===h.summary);edit.props.onEdit(0);nodes=h.render();nodes.find(n=>n.type===h.options).props.onChoose('Unsure');nodes=h.render();
 assert.ok(!nodes.some(n=>n.type===h.shared.Preview));
 assert.ok(h.published.summary.includes('Location preference: Not selected'));
});
test('concierge presentation keeps multiple concerns and invalidates stale team choices after edits',()=>{
 const h=harness('components/lab/TreatmentArchitectPro.tsx',{});let nodes=h.render();
 for(let i=0;i<7;i++){
  const options=nodes.find(n=>n.type===h.options);options.props.onChoose(options.props.step.options[0]);
  if(i===1)options.props.onChoose(options.props.step.options[1]);
  nodes=h.render();
  if(i<6){nodes.find(n=>n.type==='button'&&Array.isArray(n.props.children)&&String(n.props.children[0]).startsWith('Continue to')).props.onClick();nodes=h.render();}
 }
 assert.ok(h.published.summary.includes('Texture and tone, Expression lines'));
 assert.ok(nodes.some(n=>n.type===h.shared.Preview));
 nodes.find(n=>n.type===h.summary).props.onEdit(3);nodes=h.render();nodes.find(n=>n.type===h.options).props.onChoose('Garden clinic');nodes=h.render();
 assert.ok(h.published.summary.includes('Consultation team preference: Not selected'));
 assert.ok(!nodes.some(n=>n.type===h.shared.Preview));
});
