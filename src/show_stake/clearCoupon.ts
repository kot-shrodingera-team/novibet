import clearCouponGenerator from '@kot-shrodingera-team/germes-generators/show_stake/clearCoupon';
import { log } from '@kot-shrodingera-team/germes-utils';
import getStakeCount from '../stake_info/getStakeCount';

const preCheck = async (): Promise<boolean> => {
  const continueButton = document.querySelector<HTMLElement>(
    '.submit button[data-bind*="Continue"]:not([style="display: none;"])'
  );
  if (continueButton) {
    log('В купоне есть кнопка "Continue". Нажимаем', 'orange');
    return true;
  }
  // const betPlacedIconElement = document.querySelector(
  //   '#betslip .bs_selections .info .checkIcon'
  // );
  return true;
};

// const apiClear = (): void => {};

// const postCheck = async (): Promise<boolean> => {
//   return true;
// };

const clearCoupon = clearCouponGenerator({
  preCheck,
  getStakeCount,
  // apiClear,
  // clearSingleSelector: '',
  clearAllSelector: '[ga-action="Clear All"]',
  // postCheck,
  // context: () => document,
});

export default clearCoupon;
