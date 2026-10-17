import * as THREE from 'three';
import {createRing} from './ring.js';
import {loadWrestler} from './wrestler.js';
import {wrestlerDef} from '../content/wrestlers.js';
import {cameraFrame} from '../presentation/camera.js';
import {AnimationController} from '../presentation/animation-controller.js';
export class ArenaRenderer {
 constructor(canvas){
  this.canvas=canvas;this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.shadowMap.enabled=true;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#15262c');this.scene.fog=new THREE.Fog('#15262c',15,32);this.camera=new THREE.PerspectiveCamera(40,1,.1,60);
  this.scene.add(new THREE.HemisphereLight('#f3e4cd','#25434a',2));const light=new THREE.DirectionalLight('#fff1d8',3);light.position.set(2,9,4);light.castShadow=true;this.scene.add(light);this.scene.add(createRing());
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),new THREE.MeshStandardMaterial({color:'#16262b'}));floor.rotation.x=-Math.PI/2;floor.position.y=-.62;floor.receiveShadow=true;this.scene.add(floor);
  const crowdGeometry=new THREE.BoxGeometry(.35,.65,.35),crowdMaterials=['#395459','#4b4b58','#776253'].map(color=>new THREE.MeshStandardMaterial({color}));
  for(let r=0;r<3;r++)for(let i=0;i<36;i++){const angle=i/36*Math.PI*2,mesh=new THREE.Mesh(crowdGeometry,crowdMaterials[i%3]);mesh.position.set(Math.sin(angle)*(6+r*.65),-.1+r*.3,Math.cos(angle)*(6+r*.65));this.scene.add(mesh);}
  this.actors=new Map();this.loading=new Set();this.body=new AnimationController();this.orbit=0;this.zoom=1;this.ray=new THREE.Raycaster();this.plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);this.matchId=null;this.generation=0;this.disposed=false;
 }
 draw(m,dt,paused){
  this.body.update(dt,paused);
  if(m?.matchId!==this.matchId){this.generation++;for(const a of this.actors.values()){this.scene.remove(a.root);a.dispose();}this.actors.clear();this.loading.clear();this.matchId=m?.matchId;this.body.reset();}
  for(const w of Object.values(m?.wrestlers??{})){
   if(!this.actors.has(w.id)&&!this.loading.has(w.id)){
    this.loading.add(w.id);const generation=this.generation;
    loadWrestler(wrestlerDef(w.id)).then(a=>{if(this.disposed||generation!==this.generation){a.dispose();return;}a.root.position.set(w.position.x,0,w.position.z);this.actors.set(w.id,a);this.loading.delete(w.id);this.scene.add(a.root);});
   }
   this.actors.get(w.id)?.update(w,this.body.time,this.body.pose(w.id,m),dt,{paused,reducedMotion:this.body.reducedMotion,result:m.result});
  }
  const rect=this.canvas.getBoundingClientRect(),width=Math.max(1,rect.width),height=Math.max(1,rect.height);if(this.width!==width||this.height!==height){this.width=width;this.height=height;this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();}
  const f=cameraFrame(m,{reducedMotion:this.body.reducedMotion,userOrbit:this.orbit,zoom:this.zoom});this.camera.position.set(...f.position);this.camera.lookAt(...f.target);this.renderer.render(this.scene,this.camera);
 }
 pick(clientX,clientY){const r=this.canvas.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1),this.camera);const p=new THREE.Vector3();return this.ray.ray.intersectPlane(this.plane,p)?{x:p.x,z:p.z}:null;}
 receive(events){this.body.receive(events);}
 dispose(){this.disposed=true;this.generation++;for(const a of this.actors.values())a.dispose();this.actors.clear();this.renderer.dispose();}
}
