import {TIMING} from '../content/timing.js';
import {CONTROL_ACTIONS,validDirection,resolveControl} from '../systems/input/controls.js';
import {wrestlerDef} from '../content/wrestlers.js';import {moveDef,grapple,moveError,prepareMove,resolvePrepared} from '../systems/combat/combat.js';import {startMove} from '../systems/movement/movement.js';import {FREE,transition} from '../systems/state-machine/states.js';import {startPin} from '../systems/pin/pin.js';import {startSubmission} from '../systems/submission/submission.js';import {changeMomentum} from '../systems/momentum/momentum.js';import {emit} from '../core/math.js';import {legalTarget} from '../systems/tag-team/teams.js';import {cancelContext,stepMatch} from './match.js';import {decide} from '../systems/opponent-ai/decision.js';
const fail=code=>({ok:false,code,events:[]});
function apply(m,c,events){if(m.result)return 'MATCH_ENDED';if(c.targetId!==undefined&&!Object.hasOwn(m.wrestlers,c.targetId))return 'INVALID_TARGET';const a=m.wrestlers[c.actorId],b=m.wrestlers[c.targetId]??Object.values(m.wrestlers).find(w=>w.team!==a?.team);if(!a||!b||!legalTarget(m,a,b))return 'INVALID_TARGET';
 if(c.type==='MOVE_INTENT'){if(!validDirection(c.direction))return 'INVALID_DIRECTION';a.stick={...c.direction};if(Math.hypot(a.stick.x,a.stick.z)<=.08&&['WALKING','RUNNING'].includes(a.state))transition(a,'STANDING',events);emit(events,'MOVEMENT_INTENT_CHANGED',{actorId:a.id,direction:{...a.stick}});return null;}
 if(c.type==='CONTROL_INTENT'){if(!CONTROL_ACTIONS.includes(c.action)||!validDirection(c.direction??{x:0,z:0})||!['touch','keyboard','gamepad'].includes(c.source??'touch'))return 'INVALID_INTENT';if(m.pendingIntents[a.id])m.controlStats.replaced++;m.pendingIntents[a.id]={action:c.action,direction:{...(c.direction??{x:0,z:0})},source:c.source??'touch',queuedAtTick:m.tick,expiresAtTick:m.tick+TIMING.buffers[c.action]};m.controlStats.queued++;emit(events,'CONTROL_INTENT_QUEUED',{actorId:a.id,action:c.action,expiresAtTick:m.tick+TIMING.buffers[c.action]});return null;}
 if(['MOVE','RUN'].includes(c.type)){a.movementMagnitude=1;a.stick={x:0,z:0};return startMove(m,a,c,events);}
 if(c.type==='CANCEL_CONTEXT')return cancelContext(m,a.id,events);
 if(c.type==='ATTEMPT_REVERSAL'){if(![...FREE,'GRAPPLING','PINNED','SUBMISSION_DEFENSE'].includes(a.state)||m.tick-a.lastDefenseTick<TIMING.defenseCooldown||a.stamina<7)return 'INVALID_STATE';a.counterUntil=m.tick+TIMING.counterWindow;a.defenseUntil=m.tick+TIMING.defenseDuration;a.lastDefenseTick=m.tick;a.stamina-=7;emit(events,'DEFENSE_READIED',{actorId:a.id});return null;}
 if(c.type==='TAUNT'){if(!FREE.includes(a.state))return 'INVALID_STATE';transition(a,'TAUNTING',events,m.tick+20);changeMomentum(a,4,events);emit(events,'TAUNT_STARTED',{actorId:a.id});return null;}
 if(c.type==='ATTEMPT_GRAPPLE')return grapple(m,a,b,events);
 if(c.type==='ATTEMPT_PIN')return startPin(m,a,b,events);
 const types={ATTEMPT_STRIKE:'strike',SELECT_GRAPPLE_MOVE:'grapple',ATTEMPT_GROUND_ACTION:'ground',ATTEMPT_SUBMISSION:'submission',ATTEMPT_SIGNATURE:'signature',ATTEMPT_FINISHER:'finisher'};
 if(!Object.hasOwn(types,c.type))return 'UNKNOWN_COMMAND';const def=wrestlerDef(a.id),id=c.moveId??(c.type==='ATTEMPT_SIGNATURE'?def.moveset.signature:c.type==='ATTEMPT_FINISHER'?def.moveset.finisher:c.type==='ATTEMPT_SUBMISSION'?def.moveset.submissions[0]:def.moveset.strikes[0]),move=moveDef(id);if(!move||move.family!==types[c.type])return 'MOVE_NOT_AVAILABLE';const error=moveError(m,a,b,move,c.type==='SELECT_GRAPPLE_MOVE');if(error)return error;if(c.type==='ATTEMPT_SUBMISSION')return startSubmission(m,a,b,move,events);prepareMove(m,a,b,move,events);return null;
}
export function dispatchMatch(m,c){if(!c||typeof c.type!=='string')return fail('UNKNOWN_COMMAND');const next=structuredClone(m),events=[];const code=apply(next,c,events);if(code)return fail(code);Object.assign(m,next);return {ok:true,code:'OK',events};}
export function advanceMatch(m,seconds){if(!Number.isFinite(seconds)||seconds<0||seconds>3600)return fail('INVALID_TIME');const events=[];if(m.result)return {ok:true,code:'OK',events};m.pendingMicros+=Math.round(seconds*1e6);while(m.pendingMicros>=100000&&!m.result){m.pendingMicros-=100000;stepMatch(m,events);if(!m.result){resolveIntents(m,events);resolvePrepared(m,events);}if(!m.result)for(const id of Math.floor(m.tick/TIMING.ai[m.difficulty])%2?m.aiIds:[...m.aiIds].reverse()){const interval=TIMING.ai[m.difficulty];if(m.tick%interval!==0)continue;const c=decide(m,id,{difficulty:m.difficulty});if(c){const r=dispatchMatch(m,c);events.push(...r.events);}}}if(m.result)m.pendingMicros=0;return {ok:true,code:'OK',events};}
export function legalCommands(m,id){const b=Object.values(m.wrestlers).find(w=>w.team!==m.wrestlers[id]?.team);if(!b)return [];const base={actorId:id,targetId:b.id},commands=[...['ATTEMPT_STRIKE','ATTEMPT_GRAPPLE','ATTEMPT_PIN','ATTEMPT_SUBMISSION','ATTEMPT_GROUND_ACTION','ATTEMPT_SIGNATURE','ATTEMPT_FINISHER','ATTEMPT_REVERSAL','TAUNT','CANCEL_CONTEXT'].map(type=>({...base,type,...(type==='ATTEMPT_GROUND_ACTION'?{moveId:'stomp'}:{})})),...wrestlerDef(id).moveset.grapples.map(moveId=>({...base,type:'SELECT_GRAPPLE_MOVE',moveId}))];return commands.filter(c=>{const copy=structuredClone(m);return dispatchMatch(copy,c).ok;});}

function resolveIntents(m,events){
 for(const id of Object.keys(m.pendingIntents)){const intent=m.pendingIntents[id];
  if(m.tick>intent.expiresAtTick){delete m.pendingIntents[id];m.controlStats.expired++;emit(events,'CONTROL_INTENT_EXPIRED',{actorId:id,action:intent.action,reason:intent.lastReason??'NO_OPPORTUNITY'});continue;}
  const command=resolveControl(m,id,intent.action,intent.direction);
  if(!command){intent.lastReason='NO_OPPORTUNITY';continue;}
  const result=dispatchMatch(m,command);
  if(result.ok){delete m.pendingIntents[id];m.controlStats.executed++;events.push(...result.events);emit(events,'CONTROL_INTENT_EXECUTED',{actorId:id,action:intent.action,tick:m.tick});}else intent.lastReason=result.code;
 }
}
export function controlOptions(m,id,direction={x:0,z:0}){
 return CONTROL_ACTIONS.map(action=>{const command=resolveControl(m,id,action,direction);const result=command?dispatchMatch(structuredClone(m),command):{ok:false,code:'NO_OPPORTUNITY'};return {action,ready:result.ok,code:result.code};});
}
