import {WRESTLERS,movesFor} from './wrestlers.js';import {MOVES,BODY_PARTS} from './moves.js';import {ARENAS} from './arenas.js';import {MATCH_TYPES} from './match-types.js';import {STORY_EVENTS} from './career.js';
export function validateContent({wrestlers=WRESTLERS,moves=MOVES,arenas=ARENAS,types=MATCH_TYPES}={}){
 const unique=list=>{if(new Set(list.map(x=>x.id)).size!==list.length)throw Error('Duplicate content ID');};for(const list of [wrestlers,moves,arenas,types])unique(list);
 const states=['STANDING','WALKING','RUNNING','STUNNED','KNOCKED_DOWN','GRAPPLING','CORNERED','ROPES'];
 for(const m of moves){if(!m.id||![m.damage,m.staminaCost,m.range,m.duration,m.momentum,m.stun].every(Number.isFinite)||m.damage<0||m.damage>100||m.staminaCost<0||m.staminaCost>100||m.duration<=0||m.range<=0||!m.bodyTargets.length||m.bodyTargets.some(p=>!BODY_PARTS.includes(p))||![...m.attackerStates,...m.defenderStates].every(s=>states.includes(s))||!['standing','running','ground','corner','ropes'].includes(m.requiredContext)||!m.animationKey)throw Error('Invalid move '+m.id);}
 for(const w of wrestlers){if(!w.name||Object.values(w.ratings).some(v=>!Number.isFinite(v)||v<0||v>100)||movesFor(w).some(id=>!moves.some(m=>m.id===id))||!w.controlSlots||Object.values(w.controlSlots).some(id=>!w.moveset.grapples.includes(id))||!['athletic','powerhouse','women_athletic'].includes(w.presentation.bodyAsset)||!['short','long','curly'].includes(w.presentation.hairStyle)||!w.moveset.signature||!w.moveset.finisher)throw Error('Invalid wrestler '+w.id);}
 for(const a of arenas)if(!Number.isFinite(a.ringHalfSize)||a.ringHalfSize<2||a.ringHalfSize>10)throw Error('Invalid arena');
 for(const t of types)if(!t.id||typeof t.ropeBreak!=='boolean'||t.timeLimit<=0)throw Error('Invalid match type');
 for(const e of STORY_EVENTS)for(const c of e.choices)if(Object.keys(c).some(k=>!['id','label','popularity','heat','alignment'].includes(k)))throw Error('Unknown story effect');return true;
}
