import {clamp} from '../../core/math.js';
export function scoreMove(m,w,move){const count=w.recentMoves.filter(id=>id===move.id).length,novelty=1/(1+count*.7);m.metrics.variety[move.id]=true;m.metrics.execution+=novelty;m.metrics.repetition+=count?1:0;m.crowd=clamp(m.crowd+(move.family==='finisher'?12:4)*novelty);w.recentMoves.push(move.id);w.recentMoves=w.recentMoves.slice(-8);}
export const matchRating=m=>Math.round(clamp(15+Object.keys(m.metrics.variety).length*4+m.metrics.execution*.7+m.metrics.nearFalls*9+m.metrics.reversals*3+m.rivalryHeat*.1-m.metrics.repetition*.8,5,100));
