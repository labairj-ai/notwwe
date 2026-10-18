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

// Capture meaning at button-down. Only Counter searches for a later opportunity.
export function contextIdentity(m,id) {
  for(const kind of ['pin','submission','grapple']) {
    const c=m[kind];
    if(c?.actor===id)return JSON.stringify([kind,c.actor,c.target,kind==='pin'?c.next-(c.count+1)*10:kind==='grapple'?c.expires:c.start]);
  }
  return null;
}
export function captureControl(m,id,action,direction) {
  const command=resolveControl(m,id,action,direction);
  if(action==='COUNTER')return {kind:'counter'};
  if(action==='SPECIAL'&&m.wrestlers[id].momentum<60)return {kind:'unavailable'};
  if(!command)return {kind:'unavailable'};
  const def=wrestlerDef(id);
  if(command.type==='ATTEMPT_SIGNATURE')command.moveId=def.moveset.signature;
  if(command.type==='ATTEMPT_FINISHER')command.moveId=def.moveset.finisher;
  if(command.type==='ATTEMPT_SUBMISSION')command.moveId=def.moveset.submissions[0];
  const target=m.wrestlers[command.targetId];
  return {kind:'fixed',command,grounded:target.state==='KNOCKED_DOWN',context:['SELECT_GRAPPLE_MOVE','CANCEL_CONTEXT'].includes(command.type)?contextIdentity(m,id):null};
}
export function intentCommand(m,id,intent) {
  const s=intent.semantic;
  if(s.kind==='counter')return {command:resolveControl(m,id,'COUNTER',intent.direction),reason:'NO_OPPORTUNITY'};
  if(s.kind==='unavailable')return {command:null,reason:'MOVE_NOT_AVAILABLE'};
  const target=m.wrestlers[s.command.targetId];
  if((target.state==='KNOCKED_DOWN')!==s.grounded || s.context!==null&&contextIdentity(m,id)!==s.context)return {command:null,reason:'TARGET_CONTEXT_CHANGED'};
  return {command:s.command};
}
export function validSemantic(s,id,action,participants) {
  if(!s||!['fixed','counter','unavailable'].includes(s.kind))return false;
  if(s.kind==='counter')return action==='COUNTER'&&Object.keys(s).length===1;
  if(s.kind==='unavailable')return action==='SPECIAL'&&Object.keys(s).length===1;
  const allowed={STRIKE:['ATTEMPT_STRIKE','ATTEMPT_GROUND_ACTION'],GRAPPLE:['ATTEMPT_GRAPPLE','SELECT_GRAPPLE_MOVE'],ACTION:['TAUNT','ATTEMPT_PIN','ATTEMPT_SUBMISSION','CANCEL_CONTEXT'],SPECIAL:['ATTEMPT_SIGNATURE','ATTEMPT_FINISHER']};
  const c=s.command;
  return Object.keys(s).length===4&&typeof s.grounded==='boolean'&&(s.context===null||typeof s.context==='string'&&s.context.length<150)&&!!c&&allowed[action]?.includes(c.type)&&c.actorId===id&&participants.includes(c.targetId)&&c.targetId!==id&&Object.keys(c).every(k=>['type','actorId','targetId','moveId'].includes(k))&&(['ATTEMPT_STRIKE','ATTEMPT_GROUND_ACTION','SELECT_GRAPPLE_MOVE','ATTEMPT_SUBMISSION','ATTEMPT_SIGNATURE','ATTEMPT_FINISHER'].includes(c.type)?!!moveDef(c.moveId):c.moveId===undefined)&&(['SELECT_GRAPPLE_MOVE','CANCEL_CONTEXT'].includes(c.type)?s.context!==null:s.context===null);
}
