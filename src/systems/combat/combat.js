import {TIMING} from '../../content/timing.js';
import {moveDef} from '../../content/moves.js';import {movesFor,wrestlerDef} from '../../content/wrestlers.js';import {distance,clamp,emit} from '../../core/math.js';import {random} from '../../core/rng.js';import {FREE,transition} from '../state-machine/states.js';import {spend,damage,knockdown} from '../damage/resources.js';import {changeMomentum} from '../momentum/momentum.js';import {scoreMove} from '../crowd/crowd.js';
export function moveError(m,a,b,move,grapple=false){if(!move||!movesFor(wrestlerDef(a.id)).includes(move.id))return 'MOVE_NOT_AVAILABLE';if(![...FREE,'GRAPPLING'].includes(a.state))return 'INVALID_STATE';if(!move.defenderStates.includes(b.state))return 'INVALID_STATE';if(distance(a.position,b.position)>move.range)return 'OUT_OF_RANGE';if(a.stamina<move.staminaCost)return 'INSUFFICIENT_STAMINA';if(move.requiredContext==='running'&&a.state!=='RUNNING')return 'INVALID_STATE';if(move.requiredContext==='corner'&&b.zone!=='corner')return 'INVALID_STATE';if(move.requiredContext==='ropes'&&b.zone!=='ropes')return 'INVALID_STATE';if(move.momentumRequired&&a.momentum<move.momentumRequired)return 'MOVE_NOT_AVAILABLE';if(grapple&&(!m.grapple||m.grapple.actor!==a.id))return 'INVALID_STATE';return null;}
export function resolveMove(m,a,b,move,events,{paid=false,beforeState=a.state}={}){
 if(!paid)spend(a,move.staminaCost,events);emit(events,'ATTACK_STARTED',{actorId:a.id,targetId:b.id,moveId:move.id,animationKey:move.animationKey,duration:move.duration});m.grapple=null;
 const defendable=b.stamina>12&&b.state!=='KNOCKED_DOWN',chance=clamp(.035+b.ratings.technique/650+(b.counterUntil>=m.tick?.25:0)-a.ratings.grappling/1200,.02,.38);
 if(defendable&&random(m)<chance){spend(b,7,events);transition(a,'STUNNED',events,m.tick+TIMING.stun);transition(b,'REVERSING',events,m.tick+6);changeMomentum(b,12,events);changeMomentum(a,-8,events);m.metrics.reversals++;emit(events,'MOVE_REVERSED',{actorId:a.id,targetId:b.id,moveId:move.id});return;}
 if(random(m)>.83+a.ratings.striking/1000){transition(a,'ATTACKING',events,m.tick+Math.ceil(move.duration*10));if(b.state==='GRAPPLING')transition(b,'STANDING',events);emit(events,'ATTACK_MISSED',{actorId:a.id,targetId:b.id,moveId:move.id});return;}
 emit(events,'MOVE_CONNECTED',{actorId:a.id,targetId:b.id,moveId:move.id,family:move.family,duration:move.duration});damage(b,move,a.ratings.power,events);transition(a,move.family==='finisher'?'FINISHER':move.family==='signature'?'SIGNATURE':'ATTACKING',events,m.tick+Math.ceil(move.duration*10));
 if(move.knockdown||b.damage.head+b.damage.torso>120||beforeState==='RUNNING')knockdown(m,b,events,move.duration+TIMING.postMoveOpportunity/10);else transition(b,'STUNNED',events,m.tick+Math.ceil(move.stun*10));changeMomentum(a,move.family==='finisher'?-90:move.family==='signature'?-35:move.momentum,events);changeMomentum(b,2,events);scoreMove(m,a,move);
}
export function grapple(m,a,b,events){if(!FREE.includes(a.state)||!FREE.includes(b.state))return 'INVALID_STATE';if(distance(a.position,b.position)>1.4)return 'OUT_OF_RANGE';if(a.stamina<5)return 'INSUFFICIENT_STAMINA';spend(a,3,events);transition(a,'GRAPPLING',events);transition(b,'GRAPPLING',events);m.grapple={actor:a.id,target:b.id,expires:m.tick+TIMING.grappleWindow};emit(events,'GRAPPLE_STARTED',{actorId:a.id,targetId:b.id});return null;}
export {moveDef};

export function prepareMove(m,a,b,move,events){
 spend(a,move.staminaCost,events);
 const windup=TIMING.windup[move.family]??5;
 m.pendingAttacks.push({actorId:a.id,targetId:b.id,moveId:move.id,resolvesAtTick:m.tick+windup,beforeState:a.state});
 transition(a,'ATTACKING',events,m.tick+windup+Math.ceil(move.duration*10));
 emit(events,'ATTACK_TELEGRAPHED',{actorId:a.id,targetId:b.id,moveId:move.id,resolvesAtTick:m.tick+windup});
 m.grapple=null;
}
export function resolvePrepared(m,events){
 const ready=m.pendingAttacks.filter(p=>p.resolvesAtTick<=m.tick);
 m.pendingAttacks=m.pendingAttacks.filter(p=>p.resolvesAtTick>m.tick);
 for(const p of ready){const a=m.wrestlers[p.actorId],b=m.wrestlers[p.targetId],move=moveDef(p.moveId);
  if(m.result||!a||!b||a.state!=='ATTACKING'){if(b?.state==='GRAPPLING')transition(b,'STANDING',events);emit(events,'ATTACK_CANCELLED',{actorId:p.actorId});continue;}
  if(!move.defenderStates.includes(b.state)||distance(a.position,b.position)>move.range){if(b.state==='GRAPPLING')transition(b,'STANDING',events);emit(events,'ATTACK_MISSED',{actorId:a.id,targetId:b.id,moveId:move.id});continue;}
  // Actor remains locked until its authored presentation duration after resolution.
  a.until=m.tick+Math.ceil(move.duration*10);
  resolveMove(m,a,b,move,events,{paid:true,beforeState:p.beforeState});
 }
}
