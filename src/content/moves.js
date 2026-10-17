const move=(id,name,family,cost,damage,region,extra={})=>({id,name,family,staminaCost:cost,damage,bodyTargets:[region],range:1.4,duration:family==='strike'?.85:1.8,requiredContext:family==='ground'||family==='submission'?'ground':'standing',attackerStates:['STANDING','WALKING','RUNNING'],defenderStates:family==='ground'||family==='submission'?['KNOCKED_DOWN']:['STANDING','WALKING','RUNNING','STUNNED','GRAPPLING','CORNERED','ROPES'],knockdown:family!=='strike',stun:.5,momentum:family==='strike'?5:10,crowdTags:[family],animationKey:family,...extra});
export const MOVES=[
 move('forearm','Forearm strike','strike',4,7,'head'),move('body_kick','Body kick','strike',5,8,'torso',{duration:.9}),move('corner_forearm','Corner forearm','strike',5,8,'head',{duration:.9,requiredContext:'corner'}),move('rope_forearm','Rope forearm','strike',5,8,'torso',{duration:.9,requiredContext:'ropes'}),
 move('shoulder','Running shoulder','strike',9,13,'torso',{duration:1.1,requiredContext:'running',knockdown:true}),
 move('suplex','Vertical suplex','grapple',12,17,'torso',{duration:2.4}),move('arm_drag','Arm drag','grapple',8,12,'leftArm'),
 move('backdrop','Back drop','grapple',13,18,'torso',{duration:2.2}),move('leg_sweep','Leg sweep','grapple',9,13,'leftLeg'),
 move('corner_press','Corner press','grapple',10,16,'torso',{duration:1,requiredContext:'corner'}),
 move('stomp','Ground stomp','ground',5,9,'rightLeg',{duration:1}),
 move('leg_lock','Leg lock','submission',12,0,'leftLeg',{duration:12}),
 move('skyline','Skyline slam','signature',18,25,'torso',{duration:2.6,momentumRequired:60,momentum:14}),
 move('final_arc','Final arc','finisher',23,36,'head',{duration:3,momentumRequired:90,momentum:0}),
];
export const moveDef=id=>MOVES.find(m=>m.id===id);
export const BODY_PARTS=['head','torso','leftArm','rightArm','leftLeg','rightLeg'];
