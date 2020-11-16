import clearCouponGenerator from '@kot-shrodingera-team/germes-generators/show_stake/clearCoupon';
import { log } from '@kot-shrodingera-team/germes-utils';
import getStakeCount from '../stake_info/getStakeCount';
// import getMaximumStake from '../stake_info/getMaximumStake';

const preCheck = (): boolean => {
  const stakeCount = getStakeCount();
  const betPlacedIconElement = document.querySelector(
    '#betslip .bs_selections .info .checkIcon'
  );
  if (stakeCount === 1 && betPlacedIconElement) {
    log(
      'В купоне одна принятая ставка. Пропускаем очистку купона',
      'white',
      true
    );
    return true;
  }
  return false;
};

// const apiClear = (): void => {};

const clearCoupon = clearCouponGenerator({
  preCheck,
  getStakeCount,
  // apiClear,
  clearSingleSelector: '',
  clearAllSelector: '[ga-action="Clear All"]',
  clearMode: 'all-only',
  // maxUnload: {
  //   getMaximumStake,
  // },
});

export default clearCoupon;
