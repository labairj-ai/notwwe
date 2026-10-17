export const CONTROL_PRESETS=Object.freeze({STANDARD:{scale:1,hand:'right'},COMPACT:{scale:.94,hand:'right'},LARGE:{scale:1.06,hand:'right'},LEFT_HANDED:{scale:1,hand:'left'}});
export const CONTROL_GEOMETRY=Object.freeze({STRIKE:{x:110,y:104,size:70},GRAPPLE:{x:38,y:148,size:70},ACTION:{x:183,y:148,size:62},COUNTER:{x:110,y:211,size:62},SPECIAL:{x:110,y:31,size:56}});
export const LANDSCAPE_GEOMETRY=Object.freeze({STRIKE:{x:150,y:70},GRAPPLE:{x:70,y:120},ACTION:{x:230,y:120},COUNTER:{x:150,y:150},SPECIAL:{x:230,y:40}});
export class VirtualStick {
 constructor(radius=52){this.radius=radius;this.pointer=null;this.origin=null;this.direction={x:0,z:0};}
 down(id,x,y){if(this.pointer!==null)return false;this.pointer=id;this.origin={x,y};this.direction={x:0,z:0};return true;}
 move(id,x,y){if(id!==this.pointer)return null;const dx=(x-this.origin.x)/this.radius,dz=(y-this.origin.y)/this.radius,len=Math.hypot(dx,dz),mag=Math.min(1,Math.max(0,(len-.12)/.88));this.direction=len?{x:dx/len*mag,z:dz/len*mag}:{x:0,z:0};return this.direction;}
 up(id){if(id!==this.pointer)return false;this.reset();return true;}
 reset(){this.pointer=null;this.origin=null;this.direction={x:0,z:0};}
}
export function screenToRing(d,orbit=0){const angle=.7+orbit;return {x:d.x*Math.cos(angle)+d.z*Math.sin(angle),z:-d.x*Math.sin(angle)+d.z*Math.cos(angle)};}
