import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import * as THREE from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createRiggedWrestler,loadWrestler} from '../src/render3d/wrestler.js';
import {checkWrestlers,decodeGLB} from '../scripts/check-wrestlers.mjs';
import {wrestlerDef} from '../src/content/wrestlers.js';import {newMatch} from '../src/game/match.js';import {AnimationController} from '../src/presentation/animation-controller.js';
// CPU loader test uses the shipped meshes/skin/clips but removes image bindings;
// texture decode/browser GPU behavior is explicitly a separate acceptance gate.
function texturelessGLB(path){const b=readFileSync(path),j=decodeGLB(b),originalJSONLength=b.readUInt32LE(12);for(const m of j.materials){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture;delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;}j.images=[];j.textures=[];j.samplers=[];const text=JSON.stringify(j),json=Buffer.from(text+' '.repeat((4-text.length%4)%4)),bin=b.subarray(20+originalJSONLength),out=Buffer.alloc(20+json.length+bin.length);out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(json.length,12);out.writeUInt32LE(0x4e4f534a,16);json.copy(out,20);bin.copy(out,20+json.length);return out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength);}
let assetPromise;const asset=()=>assetPromise??=new GLTFLoader().parseAsync(texturelessGLB('assets/wrestlers/athletic.glb'),'');
test('0041: shipped humanoids meet shared skeleton, clip inventory and download/mesh budgets',async()=>{const report=await checkWrestlers();assert.equal(report.models.length,3);assert.ok(report.clips>=38);assert.ok(report.totalBytes<20_000_000);});
test('0041/0042: actual GLB clones isolate skeleton/materials, animate bones, pause and fall back for missing clips',async()=>{
 const source=await asset(),a=createRiggedWrestler(wrestlerDef('marcus'),source),b=createRiggedWrestler(wrestlerDef('cole'),source),m=newMatch({aiIds:[]}),before=structuredClone(m);let skinA,skinB;
 a.model.traverse(o=>{if(o.isSkinnedMesh&&!skinA)skinA=o;});b.model.traverse(o=>{if(o.isSkinnedMesh&&!skinB)skinB=o;});assert.notEqual(skinA.skeleton,skinB.skeleton);assert.notEqual(skinA.skeleton.bones[0],skinB.skeleton.bones[0]);assert.notEqual(skinA.material,skinB.material);
 const w=m.wrestlers.marcus;w.state='WALKING';const initial=a.model.getObjectByName('thigh_l').quaternion.clone();for(let i=0;i<3;i++)a.update(w,i/10,null,.1);assert.ok(a.model.getObjectByName('thigh_l').quaternion.angleTo(initial)>.01);const time=a.mixer.time;a.update(w,1,null,.1,{paused:true});assert.equal(a.mixer.time,time);a.update(w,1,null,.1,{reducedMotion:true});assert.equal(a.mixer.time,time);
 const fallback=createRiggedWrestler(wrestlerDef('cole'),source,source.animations.filter(c=>c.name==='Idle'));assert.doesNotThrow(()=>fallback.update(w,1,{clip:'Missing',phase:.5},.1));fallback.dispose();a.dispose();b.dispose();assert.deepEqual(m,{...before,wrestlers:{...before.wrestlers,marcus:w}});
});
test('0043: paired clips synchronize phase and bounded contact alignment without cumulative drift',async()=>{
 const source=await asset(),m=newMatch({aiIds:[]}),a=createRiggedWrestler(wrestlerDef('marcus'),source),b=createRiggedWrestler(wrestlerDef('cole'),source),body=new AnimationController(),before=structuredClone(m);
 for(let repeat=0;repeat<8;repeat++){
  body.receive([{type:'MOVE_CONNECTED',actorId:'marcus',targetId:'cole',family:'grapple',moveId:'suplex'}]);
  for(let tick=0;tick<24;tick++){body.update(.1);for(const [id,actor]of [['marcus',a],['cole',b]]){const pose=body.pose(id,m);actor.update(m.wrestlers[id],body.time,pose,.1);if(pose){assert.ok(Math.abs(pose.alignment.x-m.wrestlers[id].position.x)<=.450001);assert.ok(Math.abs(pose.alignment.z-m.wrestlers[id].position.z)<=.450001);}}}
 }
 const time=body.time;body.update(.1,true);assert.equal(body.time,time);body.reducedMotion=true;assert.equal(body.pose('marcus',m),null);body.receive([{type:'MATCH_ENDED'}]);assert.equal(body.pairs.length,0);assert.deepEqual(m,before);a.dispose();b.dispose();
});

test('0041: missing or corrupt asset uses emergency procedural presentation safely',async()=>{const warn=console.warn;console.warn=()=>{};try{const a=await loadWrestler(wrestlerDef('cole'),{loadAsset:async()=>{throw Error('Corrupt GLB');}});assert.equal(a.degraded,true);const m=newMatch(),before=structuredClone(m);a.update(m.wrestlers.cole,0,null,.1);assert.deepEqual(m,before);a.dispose();}finally{console.warn=warn;}});
test('0042: grounded/get-up and paired receiver root motion remain finite through floor transitions',async()=>{const source=await asset(),a=createRiggedWrestler(wrestlerDef('cole'),source),m=newMatch(),w=m.wrestlers.cole;for(const clip of ['Grounded','GetUpBack','SuplexReceiver','SlamReceiver']){for(const phase of [0,.25,.5,.75,.99]){a.update(w,phase,{clip,phase},.1);a.root.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(a.root,true);assert.ok([box.min.x,box.min.y,box.min.z,box.max.x,box.max.y,box.max.z].every(Number.isFinite),clip);assert.ok(box.min.y>-.35,`${clip} phase ${phase}: minY=${box.min.y}`);assert.ok(box.max.y<4.5,`${clip} phase ${phase}: maxY=${box.max.y}`);}}a.dispose();});
