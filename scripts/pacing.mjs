import {writeFile,mkdir} from 'node:fs/promises';
import {newMatch} from '../src/game/match.js';
import {advanceMatch} from '../src/game/dispatch.js';
import {TIMING} from '../src/content/timing.js';
const matches=[];
for(const difficulty of ['easy','normal','hard'])for(let seed=1;seed<=12;seed++){
 const m=newMatch({seed,difficulty,aiIds:['marcus','cole']}),events=advanceMatch(m,1000).events,counts={},actions={};
 for(const e of events){counts[e.type]=(counts[e.type]??0)+1;if(e.type==='ATTACK_TELEGRAPHED')actions[e.actorId]=(actions[e.actorId]??0)+1;}
 if(!m.result)throw Error('Incomplete pacing sample');
 matches.push({difficulty,seed,seconds:m.elapsed,finish:m.result.finishType,winner:m.result.winnerId,pins:counts.PIN_STARTED??0,reversals:counts.MOVE_REVERSED??0,attacks:counts.ATTACK_TELEGRAPHED??0,misses:counts.ATTACK_MISSED??0,actionsPerMinute:Object.fromEntries(Object.entries(actions).map(([id,n])=>[id,Math.round(n/m.elapsed*600)/10]))});
}
const summary=Object.fromEntries(['easy','normal','hard'].map(level=>{const group=matches.filter(m=>m.difficulty===level),times=group.map(m=>m.seconds).sort((a,b)=>a-b);return [level,{min:times[0],median:(times[5]+times[6])/2,max:times.at(-1),pins:group.reduce((n,m)=>n+m.pins,0),reversals:group.reduce((n,m)=>n+m.reversals,0),draws:group.filter(m=>m.winner===null).length}];}));
await mkdir('artifacts',{recursive:true});await writeFile('artifacts/pacing.json',JSON.stringify({simulationVersion:2,timing:TIMING,summary,matches,note:'Headless AI sample, not human reaction-time, touch or fun acceptance.'},null,2)+'\n');console.log(JSON.stringify(summary,null,2));
