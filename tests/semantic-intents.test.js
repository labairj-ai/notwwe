import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newMatch,finishMatch} from '../src/game/match.js';
import {dispatchMatch,advanceMatch} from '../src/game/dispatch.js';
import {controlReport} from '../src/systems/input/diagnostics.js';
import {load,serialize} from '../src/persistence/save.js';
const match=()=>{const m=newMatch({seed:17,aiIds:[]});m.wrestlers.marcus.position.x=-.45;m.wrestlers.cole.position.x=.45;return m;};
const queue=(m,action,direction={x:0,z:0})=>assert.equal(dispatchMatch(m,{type:'CONTROL_INTENT',actorId:'marcus',action,direction}).ok,true);
const down=m=>{m.wrestlers.cole.state='KNOCKED_DOWN';m.wrestlers.cole.until=100;};
test('0049: Action and Strike never substitute after target posture changes',()=>{
 for(const action of ['ACTION','STRIKE'])for(const grounded of [false,true]){
  const m=match();if(grounded)down(m);queue(m,action);const before=structuredClone(m.pendingIntents.marcus.semantic.command);
  if(grounded){m.wrestlers.cole.state=action==='STRIKE'?'GETTING_UP':'STANDING';m.wrestlers.cole.until=100;}else down(m);
  const events=advanceMatch(m,.5).events;
  assert.equal(m.controlStats.executed,0);assert.equal(m.controlStats.byAction[action].reasons.TARGET_CONTEXT_CHANGED,1);
  assert.ok(events.some(e=>e.type==='CONTROL_INTENT_EXPIRED'));assert.equal(m.pin,null);assert.equal(m.pendingAttacks.length,0);assert.ok(before.type);
 }
});
test('0049: unavailable Special and Signature cannot upgrade across momentum thresholds',()=>{
 const unavailable=match();unavailable.wrestlers.marcus.momentum=59;queue(unavailable,'SPECIAL');unavailable.wrestlers.marcus.momentum=100;advanceMatch(unavailable,.4);assert.equal(unavailable.controlStats.executed,0);assert.equal(unavailable.controlStats.byAction.SPECIAL.reasons.MOVE_NOT_AVAILABLE,1);
 const signature=match();signature.wrestlers.marcus.momentum=89;queue(signature,'SPECIAL');signature.wrestlers.marcus.momentum=100;advanceMatch(signature,.1);assert.equal(signature.pendingAttacks[0].moveId,'skyline');
});
test('0049: grapple selection and initiation retain meaning, release binds its original context',()=>{
 const m=match();dispatchMatch(m,{type:'ATTEMPT_GRAPPLE',actorId:'marcus'});queue(m,'GRAPPLE',{x:0,z:-1});m.pendingIntents.marcus.direction={x:0,z:1};advanceMatch(m,.1);assert.equal(m.pendingAttacks[0].moveId,'suplex');
 const init=match();queue(init,'GRAPPLE',{x:0,z:-1});dispatchMatch(init,{type:'ATTEMPT_GRAPPLE',actorId:'marcus'});advanceMatch(init,.4);assert.equal(init.pendingAttacks.length,0);assert.equal(init.controlStats.executed,0);
 const release=match();dispatchMatch(release,{type:'ATTEMPT_GRAPPLE',actorId:'marcus'});queue(release,'ACTION');release.grapple.expires++;advanceMatch(release,.5);assert.ok(release.grapple);assert.equal(release.controlStats.byAction.ACTION.reasons.TARGET_CONTEXT_CHANGED,1);
});
test('0049/0051: opportunistic Counter waits only within its inclusive window',()=>{
 const early=match();queue(early,'COUNTER');advanceMatch(early,.1);dispatchMatch(early,{type:'ATTEMPT_STRIKE',actorId:'cole'});advanceMatch(early,.1);assert.equal(early.wrestlers.marcus.lastDefenseTick,2);assert.equal(early.controlStats.byAction.COUNTER.maxWaitTicks,2);
 const late=match();queue(late,'COUNTER');advanceMatch(late,.3);dispatchMatch(late,{type:'ATTEMPT_STRIKE',actorId:'cole'});advanceMatch(late,.1);assert.equal(late.wrestlers.marcus.lastDefenseTick,-100);assert.equal(late.controlStats.byAction.COUNTER.reasons.NO_OPPORTUNITY,1);
});
test('0051: per-action outcomes, waits, range, stamina, replacement and match-end reasons',()=>{
 for(const wait of [1,3]){const m=match();if(wait===3){m.wrestlers.marcus.state='STUNNED';m.wrestlers.marcus.until=3;}queue(m,'STRIKE');advanceMatch(m,.3);const r=controlReport(m).controls.STRIKE;assert.equal(r.queued,1);assert.equal(r.executed,1);assert.equal(r.averageWaitTicks,wait);assert.equal(r.maxWaitTicks,wait);}
 const range=match();range.wrestlers.cole.position.x=2.8;queue(range,'GRAPPLE');advanceMatch(range,.4);assert.equal(range.controlStats.byAction.GRAPPLE.reasons.OUT_OF_RANGE,1);
 const stamina=match();stamina.wrestlers.marcus.stamina=0;queue(stamina,'STRIKE');advanceMatch(stamina,.4);assert.equal(stamina.controlStats.byAction.STRIKE.reasons.INSUFFICIENT_STAMINA,1);
 const replaced=match();queue(replaced,'STRIKE');queue(replaced,'ACTION');assert.equal(replaced.controlStats.byAction.STRIKE.replaced,1);assert.equal(replaced.controlStats.byAction.STRIKE.reasons.REPLACED,1);finishMatch(replaced,{winnerId:null,loserId:null,finishType:'time_limit'},[]);const r=controlReport(replaced);assert.equal(r.complete,true);assert.equal(r.controls.ACTION.cancelled,1);assert.equal(r.controls.ACTION.reasons.MATCH_ENDED,1);
});
test('0051: diagnostic collection consumes no RNG and cannot affect gameplay or ordered events',()=>{
 const a=match(),b=structuredClone(a);b.controlStats.enabled=false;
 for(const action of ['STRIKE','GRAPPLE','COUNTER','ACTION','SPECIAL']){queue(a,action);queue(b,action);assert.deepEqual(advanceMatch(a,2),advanceMatch(b,2));}
 delete a.controlStats;delete b.controlStats;assert.deepEqual(a,b);
});
test('0049/0051: frozen v3 semantics and diagnostics validate, resume and chunk exactly',()=>{
 const s=load(readFileSync(new URL('./fixtures/save-v3.json',import.meta.url),'utf8'));assert.ok(s.match.pendingIntents.marcus.semantic);const a=structuredClone(s.match),b=load(serialize(s)).match;
 const events=advanceMatch(a,.4).events,chunked=[];for(let i=0;i<4;i++)chunked.push(...advanceMatch(b,.1).events);assert.deepEqual(a,b);assert.deepEqual(events,chunked);
 for(const mutate of [s=>s.match.pendingIntents.marcus.semantic.command.type='MOVE',s=>s.match.controlStats.byAction.STRIKE.queued=-1,s=>s.match.controlStats.byAction.STRIKE.reasons.OUT_OF_RANGE=Infinity,s=>s.match.controlStats.queued=99]){const bad=structuredClone(s);mutate(bad);assert.throws(()=>load(bad));}
});
test('0051: saturated counters stay bounded and reports declare partial evidence',()=>{
 const m=match(),r=m.controlStats.byAction.STRIKE;r.queued=1000000;m.controlStats.queued=1000000;queue(m,'STRIKE');assert.equal(r.queued,1000000);assert.equal(m.controlStats.byAction.STRIKE.queued,1000000);assert.equal(m.controlStats.saturated,true);assert.equal(controlReport(m).partial,true);
});
