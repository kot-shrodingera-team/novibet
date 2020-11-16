// import getMaximumStakeGenerator, {
//   maximumStakeReadyGenerator,
// } from '@kot-shrodingera-team/germes-generators/stake_info/getMaximumStake';

import getBalance from './getBalance';

let maximumStake: number;

export const setMaximumStake = (newMaximumStake: number): void => {
  maximumStake = newMaximumStake;
};

// export const maximumStakeReady = maximumStakeReadyGenerator({
//   maximumStakeElementSelector: '',
//   maximumStakeRegex: null,
// });

// const getMaximumStake = getMaximumStakeGenerator({
//   maximumStakeElementSelector: '',
//   maximumStakeRegex: null,
// });

const getMaximumStake = (): number => {
  if (maximumStake) {
    return maximumStake;
  }
  return getBalance();
};

export default getMaximumStake;
