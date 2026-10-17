import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {LOOPING_CLIPS,semanticClip} from '../presentation/clips.js';
import {createWrestler as createFallback} from './procedural-wrestler.js';
const models=new Map();
function load(id){if(!models.has(id))models.set(id,new GLTFLoader().loadAsync(new URL(`../../assets/wrestlers/${id}.glb`,import.meta.url).href).catch(e=>{models.delete(id);throw e;}));return models.get(id);}
export async function loadWrestler(def,{loadAsset=load}={}){
 try{const [asset,library]=await Promise.all([loadAsset(def.presentation.bodyAsset),loadAsset('athletic')]);return createRiggedWrestler(def,asset,library.animations);}
 catch(error){console.warn('Wrestler asset unavailable; degraded geometry active.',error);return {...createFallback(def),degraded:true,dispose(){this.root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}};}
}
export function createRiggedWrestler(def,asset,clips=asset.animations){
 const root=new THREE.Group(),model=clone(asset.scene);root.add(model);
 const materials=[];model.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.frustumCulled=false;
  if(o.name.startsWith('Circuit_Hair_'))o.visible=o.name.endsWith(def.presentation.hairStyle);
  const customize=material=>{const m=material.clone();materials.push(m);const name=m.name;if(name.includes('Skin'))m.color.set(def.presentation.skin);if(name.includes('Gear'))m.color.set(def.presentation.gear);if(name.includes('Hair'))m.color.set(def.presentation.hair);return m;};o.material=Array.isArray(o.material)?o.material.map(customize):customize(o.material);
 });
 const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),height=def.physical.height;
 model.scale.setScalar(height/size.y);model.position.y=-box.min.y*height/size.y;
 const width=def.archetype==='monster'?1.1:def.archetype==='high-flyer'?.94:1;root.scale.x=width;
 const mixer=new THREE.AnimationMixer(model),actions=new Map(clips.map(c=>[c.name,mixer.clipAction(c)]));let active=null,key='',previousState=null;
 function choose(name,fade=.14){const actual=actions.has(name)?name:actions.has('CombatIdle')?'CombatIdle':'Idle';if(actual===key)return;const next=actions.get(actual);if(!next)return;const before=active;key=actual;active=next;active.reset().setLoop(LOOPING_CLIPS.has(actual)?THREE.LoopRepeat:THREE.LoopOnce,Infinity);active.clampWhenFinished=true;active.enabled=true;active.setEffectiveWeight(1).play();if(before)active.crossFadeFrom(before,fade,false);}
 return {root,model,mixer,actions,materials,degraded:false,update(w,time,pose,dt,{paused=false,reducedMotion=false,result=null}={}){
  const position=pose?.alignment??w.position;const blend=paused?0:reducedMotion?1:Math.min(1,dt*18);root.position.x+=(position.x-root.position.x)*blend;root.position.z+=(position.z-root.position.z)*blend;root.rotation.y=pose?.alignment?.facing??w.facing;
  let name=pose?.clip??semanticClip(w,result);
  if(!pose&&w.state==='KNOCKED_DOWN'&&previousState!==w.state)name='KnockdownBack';
  if(!pose&&w.state==='KNOCKED_DOWN'&&key==='KnockdownBack'&&active&&!active.isRunning())name='Grounded';
  else if(!pose&&w.state==='KNOCKED_DOWN'&&key==='KnockdownBack'&&active?.isRunning())name='KnockdownBack';
  if(reducedMotion)name=semanticClip(w,result);choose(name,reducedMotion?0:.14);
  if(pose&&active){active.paused=true;active.time=pose.phase*active.getClip().duration;mixer.update(paused?0:Math.max(0,Math.min(dt,.1)));}
  else if(active){active.paused=false;active.setEffectiveTimeScale(['WALKING','RUNNING'].includes(w.state)?Math.max(.3,w.movementMagnitude??1):1);if(reducedMotion){active.paused=true;active.time=['Grounded','Defeat'].includes(name)?active.getClip().duration*.5:0;mixer.update(0);}else if(!paused)mixer.update(Math.max(0,Math.min(dt,.1)));}
  previousState=w.state;
 },dispose(){mixer.stopAllAction();mixer.uncacheRoot(model);materials.forEach(m=>m.dispose());}};
}
