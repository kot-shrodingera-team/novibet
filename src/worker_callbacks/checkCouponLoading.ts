import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import { log } from '@kot-shrodingera-team/germes-utils';
import { getDoStakeTime } from '../stake_info/doStakeTime';

const check = () => {
  const betProcessingElement = document.querySelector(
    '#betslip .bs_overlay:not([style="display: none;"]) .timer canvas'
  );
  const betPlacedIconElement = document.querySelector(
    '#betslip .bs_selections .info .checkIcon'
  );
  const errorElement = document.querySelector(
    '#betslip .bs_selections .info.error:not(#errorContainer)'
  );
  if (betProcessingElement) {
    log('Обработка ставки (индикатор)', 'tan');
    return true;
  }
  if (betPlacedIconElement) {
    log('Обработка ставки завершена (успешная ставка)', 'orange');
    return false;
  }
  if (errorElement) {
    log('Обработка ставки завершена (ошибка ставки)', 'orange');
    return false;
  }
  log('Обработка ставки (нет индикатора)', 'tan');
  return true;
};

const checkCouponLoading = checkCouponLoadingGenerator({
  getDoStakeTime,
  bookmakerName: 'Novibet',
  timeout: 50000,
  check,
});

export default checkCouponLoading;
