import {choreography,pairedAlignment} from './choreography.js';
export class AnimationController {
 constructor(){this.time=0;this.pairs=[];this.reducedMotion=false;this.enabled=true;}
 receive(events){for(const e of events){if(e.type==='MATCH_ENDED'||e.type==='MATCH_STARTED')this.reset();const c=choreography(e);if(c&&this.enabled){this.pairs=this.pairs.filter(p=>![c.actorId,c.targetId].includes(p.actorId)&&![c.actorId,c.targetId].includes(p.targetId));this.pairs.push({...c,start:this.time});}}}
 update(dt,paused=false){if(!paused)this.time+=Math.max(0,Math.min(dt,.1));this.pairs=this.pairs.filter(p=>this.time-p.start<p.duration);}
 pose(id,match){if(!this.enabled||this.reducedMotion)return null;const p=this.pairs.find(p=>p.actorId===id||p.targetId===id);if(!p)return null;const phase=Math.max(0,Math.min(1,(this.time-p.start)/p.duration));return {...p,clip:id===p.actorId?p.actorClip:p.receiverClip,gesture:id===p.actorId?p.gesture:p.receiver,phase,alignment:match?pairedAlignment(match,p,phase,id):null};}
 reset(){this.pairs=[];}
}
