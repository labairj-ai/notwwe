import {CONTROL_ACTIONS} from './controls.js';
export const REASONS=['OUT_OF_RANGE','INVALID_STATE','INSUFFICIENT_STAMINA','MOVE_NOT_AVAILABLE','NO_OPPORTUNITY','TARGET_CONTEXT_CHANGED','MATCH_ENDED','REPLACED','OTHER'];
const outcomes=['queued','executed','expired','replaced','cancelled'];
const row=()=>({...Object.fromEntries(outcomes.map(k=>[k,0])),waitTicks:0,maxWaitTicks:0,reasons:Object.fromEntries(REASONS.map(k=>[k,0]))});
export function newControlStats(enabled=true){return {version:1,enabled,saturated:false,...Object.fromEntries(outcomes.map(k=>[k,0])),byAction:Object.fromEntries(CONTROL_ACTIONS.map(a=>[a,row()])),legacy:null};}
export function recordControl(m,intent,outcome,reason){
 const stats=m.controlStats;if(!stats.enabled)return;
 const r=stats.byAction[intent.action];
 const add=(o,k,n=1)=>{if(o[k]+n>1000000)stats.saturated=true;o[k]=Math.min(1000000,o[k]+n);};
 add(r,outcome);for(const key of outcomes)stats[key]=CONTROL_ACTIONS.reduce((n,a)=>n+stats.byAction[a][key],0);
 if(outcome==='executed'){const wait=m.tick-intent.queuedAtTick;add(r,'waitTicks',wait);r.maxWaitTicks=Math.max(r.maxWaitTicks,wait);}
 if(reason)add(r.reasons,REASONS.includes(reason)?reason:'OTHER');
}
export function validControlStats(s){
 if(!s||Object.keys(s).length!==10||s.version!==1||typeof s.enabled!=='boolean'||typeof s.saturated!=='boolean'||!s.byAction||Object.keys(s.byAction).length!==5)return false;
 for(const a of CONTROL_ACTIONS){const r=s.byAction[a];if(!r||Object.keys(r).length!==8||!r.reasons||Object.keys(r.reasons).length!==REASONS.length)return false;
 for(const k of [...outcomes,'waitTicks','maxWaitTicks'])if(!Number.isSafeInteger(r[k])||r[k]<0||r[k]>1000000)return false;
 if(r.maxWaitTicks>4)return false;
 for(const k of REASONS)if(!Number.isSafeInteger(r.reasons[k])||r.reasons[k]<0||r.reasons[k]>1000000)return false;
 }
 if(!s.saturated)for(const a of CONTROL_ACTIONS){const r=s.byAction[a];if(r.executed+r.expired+r.replaced+r.cancelled>r.queued||Object.values(r.reasons).reduce((n,v)=>n+v,0)!==r.expired+r.replaced+r.cancelled||r.waitTicks<r.executed||r.waitTicks>r.executed*4)return false;}
 for(const k of outcomes)if(s[k]!==CONTROL_ACTIONS.reduce((n,a)=>n+s.byAction[a][k],0))return false;
 if(s.legacy!==null&&(!s.legacy||Object.keys(s.legacy).length!==5||['queued','executed','expired','replaced','discardedPending'].some(k=>!Object.hasOwn(s.legacy,k))||Object.values(s.legacy).some(n=>!Number.isSafeInteger(n)||n<0||n>1e9)))return false;
 return true;
}
export function controlReport(m,build=null){return {reportVersion:1,candidate:build,matchId:m.matchId,tick:m.tick,complete:!!m.result,partial:!m.controlStats.enabled||m.controlStats.saturated,legacy:m.controlStats.legacy,controls:Object.fromEntries(CONTROL_ACTIONS.map(a=>{const r=structuredClone(m.controlStats.byAction[a]);return [a,{...r,averageWaitTicks:r.executed?r.waitTicks/r.executed:0}];}))};}
