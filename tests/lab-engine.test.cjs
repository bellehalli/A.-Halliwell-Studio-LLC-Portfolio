const test=require('node:test');
const assert=require('node:assert/strict');
const ts=require('typescript');
const fs=require('node:fs');
const vm=require('node:vm');
const moduleScope={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/lab-engine.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module:moduleScope,exports:moduleScope.exports});
const lab=moduleScope.exports;
test('event layout counts and capacity change with configuration and space',()=>{
 assert.equal(lab.furnitureFor('Seated dinner',81).tables,11);
 assert.equal(lab.furnitureFor('Seated dinner',81).seats,81);
 assert.equal(lab.furnitureFor('Ceremony',120).tables,0);
 assert.equal(lab.furnitureFor('Cocktail reception',100).seats,0);
 assert.equal(lab.capacityFor(0,'Seated dinner'),120);
 assert.equal(lab.capacityFor(0,'Ceremony'),160);
 assert.equal(lab.capacityFor(1,'Seated dinner'),18);
 assert.equal(lab.capacityFor(3,'Seated dinner'),6);
});
test('guesthouse sleeping places stay independent of event layouts',()=>{
 assert.equal(lab.innRooms.reduce((total,room)=>total+room.sleeps,0),6);
 assert.equal(lab.innRooms.filter(room=>room.sleeps>0).length,3);
 for (const layout of ['Seated dinner','Ceremony','Cocktail reception']) assert.equal(lab.capacityFor(3,layout),6);
});
test('night selection excludes unsuitable groups and updates late-arrival price and midnight itinerary',()=>{
 assert.equal(lab.suitableSections('VIP',6).length,3);
 assert.equal(lab.suitableSections('Dinner',12).length,0);
 assert.equal(lab.nightEstimate(2,'22:30',false,false).total,900);
 assert.equal(lab.nightEstimate(2,'23:30',true,true).total,1305);
 assert.equal(lab.itinerary('VIP','23:30')[2].time,'12:30 AM');
});
test('dispatch requires booking, conflict-free assignment and homeowner estimate approval',()=>{
 let state=lab.initialJob;
 assert.equal(lab.jobReducer(state,{type:'advance'}),state);
 state=lab.jobReducer(state,{type:'book',day:'2026-10-06',time:'10:00'});
 assert.equal(lab.canAssign('Taylor','10:00'),false);
 assert.equal(lab.jobReducer(state,{type:'assign',technician:'Taylor'}),state);
 state=lab.jobReducer(state,{type:'assign',technician:'Jordan'});
 assert.equal(state.status,2);
 state=lab.jobReducer(state,{type:'advance'});
 state=lab.jobReducer(state,{type:'advance'});
 assert.equal(state.status,4);
 assert.equal(lab.jobReducer(state,{type:'advance'}),state);
 state=lab.jobReducer(state,{type:'estimate'});
 state=lab.jobReducer(state,{type:'decline'});
 assert.equal(lab.jobReducer(state,{type:'advance'}),state);
 state=lab.jobReducer(state,{type:'estimate'});
 state=lab.jobReducer(state,{type:'approve'});
 state=lab.jobReducer(state,{type:'advance'});
 assert.equal(state.status,5);
 assert.match(state.log.join(' '),/approved/);
 assert.equal(lab.jobReducer(state,{type:'reset'}).booked,false);
});
test('adaptive content has distinct section orders for all visitor intents',()=>{
 const orders=Object.values(lab.journeyRules).map(r=>r.order.join(','));
 assert.equal(new Set(orders).size,3);
 assert.notEqual(lab.journeyRules.Discovering.cta,lab.journeyRules['Ready to buy'].cta);
});
