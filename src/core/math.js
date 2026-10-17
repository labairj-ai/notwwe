export const clamp=(n,min=0,max=100)=>Math.min(max,Math.max(min,n));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const emit=(events,type,data={})=>events.push({type,...data});
export const finite=n=>typeof n==='number'&&Number.isFinite(n);
