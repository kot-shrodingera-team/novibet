import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';

const getStakeCount = getStakeCountGenerator({
  // stakeElementSelector: '.bs_selections > .selection:not(.m-noTouch)',
  stakeElementSelector: '.bs_selections > .selection',
});

export default getStakeCount;
