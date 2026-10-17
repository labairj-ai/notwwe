import {distance} from '../../core/math.js';import {moveDef} from '../../content/moves.js';import {wrestlerDef} from '../../content/wrestlers.js';import {FREE} from '../state-machine/states.js';import {moveError} from '../combat/combat.js';
export function decide(m,id,{difficulty='normal'}={}){const a=m.wrestlers[id],b=Object.values(m.wrestlers).find(w=>w.team!==a.team);if(!b||m.result)return null;const targetId=b.id,base={actorId:id,targetId};if(a.state==='GRAPPLING'&&m.grapple?.actor===id){const ids=wrestlerDef(id).moveset.grapples.filter(x=>!moveError(m,a,b,moveDef(x),true));return ids.length?{...base,type:'SELECT_GRAPPLE_MOVE',moveId:ids[(Math.floor(m.tick/20)+id.length)%ids.length]}:{...base,type:'CANCEL_CONTEXT'};}
 if(['PINNED','SUBMISSION_DEFENSE'].includes(a.state))return a.stamina>=7&&m.tick-a.lastDefenseTick>=15?{...base,type:'ATTEMPT_REVERSAL'}:null;if(!FREE.includes(a.state)||a.stamina<12)return null;
 if(distance(a.position,b.position)>1.2)return {...base,type:a.stamina>60?'RUN':'MOVE',x:b.position.x,z:b.position.z};
 if(b.state==='KNOCKED_DOWN'){if(b.damage.leftLeg>65&&a.ratings.technique>80)return {...base,type:'ATTEMPT_SUBMISSION'};if(b.damage.head+b.damage.torso>95||m.tick%3===0)return {...base,type:'ATTEMPT_PIN'};return {...base,type:'ATTEMPT_GROUND_ACTION',moveId:'stomp'};}
 if(!FREE.includes(b.state))return null;
 if(a.momentum>=90&&!moveError(m,a,b,moveDef(wrestlerDef(id).moveset.finisher)))return {...base,type:'ATTEMPT_FINISHER'};if(a.momentum>=60&&!moveError(m,a,b,moveDef(wrestlerDef(id).moveset.signature)))return {...base,type:'ATTEMPT_SIGNATURE'};
 if(difficulty==='hard'&&a.stamina<35&&a.stamina>=7&&m.tick-a.lastDefenseTick>=15)return {...base,type:'ATTEMPT_REVERSAL'};
 return {...base,type:m.tick%4===0?'ATTEMPT_GRAPPLE':'ATTEMPT_STRIKE',moveId:Math.floor(m.tick/10)%2?'forearm':'body_kick'};
}
