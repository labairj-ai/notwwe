import {wrestlerDef} from '../../content/wrestlers.js';
import {moveDef} from '../../content/moves.js';
export const CONTROL_ACTIONS = ['STRIKE', 'GRAPPLE', 'ACTION', 'COUNTER', 'SPECIAL'];
export function validDirection(d) {
  return !!d && Number.isFinite(d.x) && Number.isFinite(d.z) && Math.hypot(d.x,d.z) <= 1.000001;
}
export function directionSlot(d={x:0,z:0}) {
  if (Math.hypot(d.x,d.z)<.35) return 'neutral';
  return Math.abs(d.x)>Math.abs(d.z) ? (d.x<0?'left':'right') : (d.z<0?'up':'down');
}
export function counterOpportunity(m,id) {
  const w=m.wrestlers[id];
  return !!w && (['PINNED','SUBMISSION_DEFENSE'].includes(w.state) || m.pendingAttacks?.some(a=>a.targetId===id));
}
export function resolveControl(m,id,action,direction={x:0,z:0}) {
  const a=m.wrestlers[id],b=Object.values(m.wrestlers).find(w=>w.team!==a?.team);
  if (!a||!b||m.result) return null;
  const def=wrestlerDef(id),base={actorId:id,targetId:b.id},slot=directionSlot(direction);
  if (action==='COUNTER') return counterOpportunity(m,id)?{...base,type:'ATTEMPT_REVERSAL'}:null;
  if (action==='SPECIAL') return {...base,type:a.momentum>=90?'ATTEMPT_FINISHER':'ATTEMPT_SIGNATURE'};
  if (action==='GRAPPLE') {
    if (m.grapple?.actor===id) return {...base,type:'SELECT_GRAPPLE_MOVE',moveId:def.controlSlots[slot]};
    return {...base,type:'ATTEMPT_GRAPPLE'};
  }
  if (action==='ACTION') {
    if (m.pin?.actor===id || m.submission?.actor===id || m.grapple?.actor===id) return {...base,type:'CANCEL_CONTEXT'};
    if (b.state==='KNOCKED_DOWN') return {...base,type:slot==='down'?'ATTEMPT_SUBMISSION':'ATTEMPT_PIN'};
    return {...base,type:'TAUNT'};
  }
  if (action==='STRIKE') {
    if (b.state==='KNOCKED_DOWN') return {...base,type:'ATTEMPT_GROUND_ACTION',moveId:def.moveset.groundMoves[0]};
    const choices=a.state==='RUNNING'?def.moveset.runningMoves:def.moveset.strikes;
    const corner=choices.find(id=>moveDef(id)?.requiredContext===b.zone);
    return {...base,type:'ATTEMPT_STRIKE',moveId:corner?corner:choices[slot==='down'?1:0]??choices[0]};
  }
  return null;
}
export function controlLabel(m,id,action,direction) {
  if(action==='SPECIAL') return m?.wrestlers[id]?.momentum>=90?'Finisher':m?.wrestlers[id]?.momentum>=60?'Signature':'Special';
  if(action!=='ACTION')return action[0]+action.slice(1).toLowerCase();
  const command=m&&resolveControl(m,id,action,direction);
  return ({ATTEMPT_PIN:'Pin',ATTEMPT_SUBMISSION:'Submit',CANCEL_CONTEXT:'Release',TAUNT:'Taunt'})[command?.type]??'Action';
}
