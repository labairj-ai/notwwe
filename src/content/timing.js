// 10 Hz simulation ticks. Human tuning remains provisional until TODO 0048.
export const TIMING = Object.freeze({
  version: 2, tickMicros: 100000,
  ai: {easy: 22, normal: 15, hard: 10},
  windup: {strike: 5, grapple: 6, ground: 4, signature: 7, finisher: 8},
  counterWindow: 8, defenseCooldown: 18, defenseDuration: 15,
  postMoveOpportunity: 25, grappleWindow: 60, stun: 10, getUp: 14,
  buffers: {STRIKE: 3, GRAPPLE: 3, ACTION: 4, COUNTER: 2, SPECIAL: 3},
});
