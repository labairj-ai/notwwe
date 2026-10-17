// Presentation metadata only: every hit/miss/reversal is already resolved.
const pair=(actorClip,receiverClip,duration,separation=.85,impactPhase=.65,cameraHint='wide')=>({actorClip,receiverClip,duration,separation,impactPhase,cameraHint,alignmentMode:'opponent-axis',contactAnchor:'chest',safeFallback:'CombatIdle'});
export const CHOREOGRAPHY={
 forearm:pair('StrikeActor','StrikeReceiver',.85,1),body_kick:pair('KickActor','StrikeReceiver',.9,1.05),shoulder:pair('RunningActor','KnockdownBack',1.1,.85),
 suplex:pair('SuplexActor','SuplexReceiver',2.4,.68),arm_drag:pair('ThrowActor','ThrowReceiver',1.8,.8),backdrop:pair('SlamActor','SlamReceiver',2.2,.72),leg_sweep:pair('ThrowActor','KnockdownFront',1.8,.85),corner_press:pair('GrappleActor','GrappleReceiver',1,.7),
 stomp:pair('GroundStrikeActor','GroundStrikeReceiver',1,.85),skyline:pair('SignatureActor','SignatureReceiver',2.6,.7,.7,'signature'),final_arc:pair('FinisherActor','FinisherReceiver',3,.7,.75,'finisher'),
};
export function choreography(e){
 if(e.type==='MOVE_REVERSED')return {actorId:e.targetId,targetId:e.actorId,...pair('CounterActor','CounterReceiver',1.1,.9),gesture:'counter',receiver:'sell'};
 if(e.type==='GRAPPLE_STARTED')return {actorId:e.actorId,targetId:e.targetId,...pair('GrappleActor','GrappleReceiver',1,.75)};
 if(e.type!=='MOVE_CONNECTED')return null;
 const definition=CHOREOGRAPHY[e.moveId]??(e.family==='grapple'?CHOREOGRAPHY.suplex:CHOREOGRAPHY.forearm);
 return {actorId:e.actorId,targetId:e.targetId,...definition,gesture:e.family==='grapple'?'lift':'strike',receiver:e.family==='grapple'?'flip':'sell'};
}
export function pairedAlignment(match,pair,phase,id){
 const a=match.wrestlers[pair.actorId],b=match.wrestlers[pair.targetId];if(!a||!b)return null;
 const dx=b.position.x-a.position.x,dz=b.position.z-a.position.z,d=Math.hypot(dx,dz)||1;
 const ux=dx/d,uz=dz/d,mid={x:(a.position.x+b.position.x)/2,z:(a.position.z+b.position.z)/2};
 const sign=id===a.id?-1:1,base=match.wrestlers[id].position;
 // Bound offsets to 45cm and ease out before returning to semantic presentation.
 const blend=Math.min(1,phase/.18,(1-phase)/.2);
 const x=mid.x+sign*ux*pair.separation/2,z=mid.z+sign*uz*pair.separation/2;
 const offsetX=Math.max(-.45,Math.min(.45,x-base.x))*Math.max(0,blend),offsetZ=Math.max(-.45,Math.min(.45,z-base.z))*Math.max(0,blend);
 return {x:Math.max(-2.8,Math.min(2.8,base.x+offsetX)),z:Math.max(-2.8,Math.min(2.8,base.z+offsetZ)),facing:Math.atan2(id===a.id?ux:-ux,id===a.id?uz:-uz)};
}
