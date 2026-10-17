import {emit} from '../../core/math.js';
export const STATES=['STANDING','WALKING','RUNNING','GRAPPLING','ATTACKING','REVERSING','STUNNED','KNOCKED_DOWN','GETTING_UP','CORNERED','ROPES','APRON','TOP_ROPE','PINNING','PINNED','SUBMISSION_ATTACK','SUBMISSION_DEFENSE','TAUNTING','SIGNATURE','FINISHER','VICTORY'];
export const FREE=['STANDING','WALKING','RUNNING','CORNERED','ROPES'];
export function canTransition(from,to){if(!STATES.includes(from)||!STATES.includes(to)||from==='VICTORY')return false;if(from==='PINNED'||from==='PINNING'||from.startsWith('SUBMISSION_'))return ['STANDING','KNOCKED_DOWN','VICTORY'].includes(to);return !['APRON','TOP_ROPE'].includes(to);}
export function transition(w,to,events,until=0){if(w.state===to)return;if(!canTransition(w.state,to))throw Error(`Illegal transition ${w.state} → ${to}`);const from=w.state;w.state=to;w.until=until;w.target=null;emit(events,'WRESTLER_STATE_CHANGED',{wrestlerId:w.id,from,to});}
