import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';

const getStakeCount = getStakeCountGenerator({
  stakeSelector: '.bs_selections > .selection:not(.m-noTouch)',
  // context: () => document,
});

export default getStakeCount;
