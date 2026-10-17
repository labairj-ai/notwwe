import {clamp,emit} from '../../core/math.js';
export function changeMomentum(w,amount,events){const before=w.momentum;w.momentum=clamp(before+amount);emit(events,'MOMENTUM_CHANGED',{wrestlerId:w.id,value:w.momentum});for(const [n,type] of [[60,'SIGNATURE_AVAILABLE'],[90,'FINISHER_AVAILABLE']])if(before<n&&w.momentum>=n)emit(events,type,{wrestlerId:w.id});}
