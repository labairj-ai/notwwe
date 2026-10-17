export function random(state){let x=state.rngState>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rngState=x>>>0;return state.rngState/4294967296;}
export function seedValue(seed){let x=(Number.isInteger(seed)?seed>>>0:1)||1;x=Math.imul(x^(x>>>16),0x7feb352d);x=Math.imul(x^(x>>>15),0x846ca68b);return ((x^(x>>>16))>>>0)||1;}
