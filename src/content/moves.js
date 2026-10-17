const move=(id,name,family,cost,damage,region,extra={})=>({id,name,family,staminaCost:cost,damage,bodyTargets:[region],range:1.4,duration:family==='strike'?.6:1.6,requiredContext:family==='ground'||family==='submission'?'ground':'standing',attackerStates:['STANDING','WALKING','RUNNING'],defenderStates:family==='ground'||family==='submission'?['KNOCKED_DOWN']:['STANDING','WALKING','RUNNING','STUNNED','GRAPPLING','CORNERED','ROPES'],knockdown:family!=='strike',stun:.5,momentum:family==='strike'?5:10,crowdTags:[family],animationKey:family,...extra});
export const MOVES=[
 move('forearm','Forearm strike','strike',4,7,'head'),move('body_kick','Body kick','strike',5,8,'torso'),
 move('shoulder','Running shoulder','strike',9,13,'torso',{requiredContext:'running',knockdown:true}),
 move('suplex','Vertical suplex','grapple',12,17,'torso'),move('arm_drag','Arm drag','grapple',8,12,'leftArm'),
 move('backdrop','Back drop','grapple',13,18,'torso'),move('leg_sweep','Leg sweep','grapple',9,13,'leftLeg'),
 move('corner_press','Corner press','grapple',10,16,'torso',{requiredContext:'corner'}),
 move('stomp','Ground stomp','ground',5,9,'rightLeg'),
 move('leg_lock','Leg lock','submission',12,0,'leftLeg',{duration:12}),
 move('skyline','Skyline slam','signature',18,25,'torso',{momentumRequired:60,momentum:14}),
 move('final_arc','Final arc','finisher',23,36,'head',{momentumRequired:90,momentum:0}),
];
export const moveDef=id=>MOVES.find(m=>m.id===id);
export const BODY_PARTS=['head','torso','leftArm','rightArm','leftLeg','rightLeg'];
