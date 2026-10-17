import test from 'node:test';
import assert from 'node:assert/strict';
import {newMatch} from '../src/game/match.js';
import {newSession,dispatch,advance} from '../src/game/session.js';
import {dispatchMatch,advanceMatch,controlOptions} from '../src/game/dispatch.js';
import {resolveControl,CONTROL_ACTIONS} from '../src/systems/input/controls.js';
import {VirtualStick,CONTROL_GEOMETRY,CONTROL_PRESETS,LANDSCAPE_GEOMETRY,screenToRing} from '../src/ui/mobile.js';
import {load,serialize} from '../src/persistence/save.js';
import {runScenario,replay} from '../src/game/replay.js';
const close=()=>{const m=newMatch({seed:17,aiIds:[]});m.wrestlers.marcus.position={x:-.45,z:0};m.wrestlers.cole.position={x:.45,z:0};return m;};
const send=(m,c)=>{const r=dispatchMatch(m,{actorId:'marcus',...c});assert.equal(r.ok,true,r.code);return r;};
const queue=(m,action,extra={})=>send(m,{type:'CONTROL_INTENT',action,direction:{x:0,z:0},...extra});
test('0044: stable grammar covers standing/running/grapple/ground/defense/special contexts without mutation',()=>{
 const m=close(),id='marcus',a=m.wrestlers[id],b=m.wrestlers.cole;const original=structuredClone(m);assert.deepEqual(controlOptions(m,id).map(x=>x.action),CONTROL_ACTIONS);assert.deepEqual(m,original);
 assert.equal(resolveControl(m,id,'STRIKE').moveId,'forearm');a.state='RUNNING';assert.equal(resolveControl(m,id,'STRIKE').moveId,'shoulder');a.state='GRAPPLING';b.state='GRAPPLING';m.grapple={actor:id,target:b.id,expires:60};
 for(const [direction,moveId]of [[{x:0,z:0},'arm_drag'],[{x:0,z:-1},'suplex'],[{x:1,z:0},'backdrop'],[{x:0,z:1},'leg_sweep']])assert.equal(resolveControl(m,id,'GRAPPLE',direction).moveId,moveId);
 a.state='STANDING';b.state='KNOCKED_DOWN';m.grapple=null;assert.equal(resolveControl(m,id,'STRIKE').type,'ATTEMPT_GROUND_ACTION');assert.equal(resolveControl(m,id,'ACTION').type,'ATTEMPT_PIN');assert.equal(resolveControl(m,id,'ACTION',{x:0,z:1}).type,'ATTEMPT_SUBMISSION');a.momentum=100;assert.equal(resolveControl(m,id,'SPECIAL').type,'ATTEMPT_FINISHER');
 a.state='PINNED';assert.equal(resolveControl(m,id,'COUNTER').type,'ATTEMPT_REVERSAL');
});
test('0045: inclusive expiry, early recovery and first legal execution tick are deterministic',()=>{
 const m=close();m.wrestlers.marcus.state='STUNNED';m.wrestlers.marcus.until=3;queue(m,'STRIKE');const other=structuredClone(m),events=advanceMatch(m,.3).events,chunked=[];for(let i=0;i<3;i++)chunked.push(...advanceMatch(other,.1).events);assert.deepEqual(m,other);assert.deepEqual(events,chunked);assert.equal(events.find(e=>e.type==='CONTROL_INTENT_EXECUTED').tick,3);assert.equal(m.controlStats.executed,1);assert.equal(m.pendingAttacks[0].resolvesAtTick,8);advanceMatch(m,1);assert.equal(m.controlStats.executed,1);
 const late=close();late.wrestlers.marcus.state='STUNNED';late.wrestlers.marcus.until=4;queue(late,'STRIKE');const result=advanceMatch(late,.4);assert.equal(late.controlStats.executed,0);assert.equal(late.controlStats.expired,1);assert.ok(result.events.some(e=>e.type==='CONTROL_INTENT_EXPIRED'));assert.equal(late.pendingAttacks.length,0);
});
test('0045: out-of-range, insufficient resources, replacement, pause and match-end cannot bypass legality',()=>{
 const m=close();m.wrestlers.marcus.stamina=0;queue(m,'STRIKE');advanceMatch(m,.4);assert.equal(m.controlStats.executed,0);assert.equal(m.wrestlers.cole.damage.head,0);
 const range=close();range.wrestlers.cole.position.x=2.8;queue(range,'GRAPPLE');advanceMatch(range,.4);assert.equal(range.grapple,null);assert.equal(range.controlStats.expired,1);
 const replaced=close();queue(replaced,'STRIKE');queue(replaced,'GRAPPLE');assert.equal(replaced.controlStats.replaced,1);const before=structuredClone(replaced);advanceMatch(replaced,0);assert.deepEqual(replaced,before);advanceMatch(replaced,.1);assert.ok(replaced.grapple);assert.equal(replaced.pendingAttacks.length,0);
 replaced.rules.timeLimit=.2;queue(replaced,'STRIKE');advanceMatch(replaced,.1);assert.ok(replaced.result);assert.deepEqual(replaced.pendingIntents,{});const terminal=structuredClone(replaced);assert.equal(dispatchMatch(replaced,{type:'CONTROL_INTENT',actorId:'marcus',action:'STRIKE'}).ok,false);assert.deepEqual(replaced,terminal);
});
test('0045/0047: counter has a readable wind-up and short buffer, with no automatic reversal',()=>{
 const m=close();send(m,{type:'ATTEMPT_STRIKE',actorId:'cole',targetId:'marcus'});assert.equal(m.wrestlers.marcus.damage.head,0);assert.equal(m.pendingAttacks[0].resolvesAtTick,5);assert.equal(controlOptions(m,'marcus').find(x=>x.action==='COUNTER').ready,true);queue(m,'COUNTER');advanceMatch(m,.1);assert.equal(m.wrestlers.marcus.lastDefenseTick,1);assert.ok(m.wrestlers.marcus.stamina<100);advanceMatch(m,.4);assert.equal(m.pendingAttacks.length,0);
 const early=close();queue(early,'COUNTER');advanceMatch(early,.3);assert.equal(early.controlStats.expired,1);assert.equal(early.wrestlers.marcus.lastDefenseTick,-100);
});
test('0045: pending intent and attack save/load and full replay reproduce exact execution',()=>{
 const s=newSession();dispatch(s,{type:'START_EXHIBITION',seed:22});s.match=close();queue(s.match,'STRIKE');const resumed=load(serialize(s));assert.deepEqual(advance(s,.3),advance(resumed,.3));assert.deepEqual(s,resumed);assert.equal(s.match.pendingAttacks.length,1);const impact=load(serialize(s));assert.deepEqual(advance(s,2),advance(impact,2));assert.deepEqual(s,impact);
 const trace=runScenario(newSession(),[{command:{type:'START_EXHIBITION',seed:22}},{command:{type:'MOVE_INTENT',actorId:'marcus',direction:{x:1,z:0}}},{seconds:.3},{command:{type:'CONTROL_INTENT',actorId:'marcus',action:'STRIKE',direction:{x:0,z:0}}},{seconds:20}]);assert.deepEqual(replay(trace.trace).state,trace.state);
 const bad=structuredClone(resumed);bad.match.pendingAttacks[0].resolvesAtTick=Infinity;assert.throws(()=>load(bad));
});
test('0046: floating stick deadzone, saturation, cancellation and handed presets retain accessible geometry',()=>{
 const stick=new VirtualStick();assert.ok(stick.down(1,100,100));assert.equal(stick.down(2,100,100),false);assert.deepEqual(stick.move(1,102,102),{x:0,z:0});assert.ok(Math.hypot(...Object.values(stick.move(1,400,500)))<=1.000001);assert.equal(stick.up(2),false);assert.equal(stick.up(1),true);assert.deepEqual(stick.direction,{x:0,z:0});assert.equal(stick.origin,null);
 assert.equal(CONTROL_PRESETS.LEFT_HANDED.hand,'left');for(const [action,g]of Object.entries(LANDSCAPE_GEOMETRY)){const radius=CONTROL_GEOMETRY[action].size/2;assert.ok(g.x-radius>=0&&g.x+radius<=270&&g.y-radius>=0&&g.y+radius<=190);}for(const preset of Object.values(CONTROL_PRESETS))for(const g of Object.values(CONTROL_GEOMETRY))assert.ok(g.size*preset.scale*.94>=44);
 const ring=screenToRing({x:.6,z:.8},1.2);assert.ok(Math.abs(Math.hypot(ring.x,ring.z)-1)<1e-12);
 const m=close();send(m,{type:'MOVE_INTENT',direction:{x:.4,z:0}});advanceMatch(m,.1);assert.equal(m.wrestlers.marcus.state,'WALKING');send(m,{type:'MOVE_INTENT',direction:{x:0,z:1}});advanceMatch(m,.1);assert.equal(m.wrestlers.marcus.state,'RUNNING');send(m,{type:'MOVE_INTENT',direction:{x:0,z:0}});const pos={...m.wrestlers.marcus.position};advanceMatch(m,1);assert.deepEqual(m.wrestlers.marcus.position,pos);
});
test('0044/0045: corner/rope variants, early grapple, changing stamina and range remain legal',()=>{
 const m=close();m.wrestlers.cole.zone='corner';assert.equal(resolveControl(m,'marcus','STRIKE').moveId,'corner_forearm');m.wrestlers.cole.zone='ropes';assert.equal(resolveControl(m,'marcus','STRIKE').moveId,'rope_forearm');
 for(const action of ['STRIKE','GRAPPLE']){const early=close();early.wrestlers.marcus.state='STUNNED';early.wrestlers.marcus.until=3;queue(early,action);assert.ok(advanceMatch(early,.3).events.some(e=>e.type==='CONTROL_INTENT_EXECUTED'&&e.tick===3));}
 const drained=close();drained.wrestlers.marcus.state='STUNNED';drained.wrestlers.marcus.until=2;queue(drained,'STRIKE');drained.wrestlers.marcus.stamina=0;advanceMatch(drained,.4);assert.equal(drained.controlStats.executed,0);
 const dodge=close();send(dodge,{type:'ATTEMPT_STRIKE'});send(dodge,{type:'MOVE_INTENT',actorId:'cole',direction:{x:1,z:0}});const events=advanceMatch(dodge,.6).events;assert.ok(events.some(e=>e.type==='ATTACK_MISSED'));assert.equal(dodge.wrestlers.cole.damage.head,0);
 const invalid=close(),before=structuredClone(invalid);assert.equal(dispatchMatch(invalid,{type:'CONTROL_INTENT',actorId:'marcus',action:'STRIKE',direction:{x:2,z:0}}).ok,false);assert.deepEqual(invalid,before);
});
