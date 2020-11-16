import { log } from '@kot-shrodingera-team/germes-utils';
import { setMaximumStake } from '../stake_info/getMaximumStake';

const checkStakeStatus = (): boolean => {
  const betPlacedIconElement = document.querySelector(
    '#betslip .bs_selections .info .checkIcon'
  );
  const errorElement = document.querySelector(
    '#betslip .bs_selections .info.error:not(#errorContainer)'
  );
  const rejectionMessageElement = document.querySelector(
    '[data-bind="text: RejectionMessage"]'
  );
  if (betPlacedIconElement) {
    log('Ставка принята', 'green');
    return true;
  }
  if (errorElement) {
    const errorText = errorElement.textContent.trim();
    log(`Ошибка ставки: "${errorText}`, 'tomato');
    if (rejectionMessageElement) {
      const rejectionMessageText = rejectionMessageElement.textContent.trim();
      const maxBetRegex = /^Max bet: (\d+(?:\.\d+)?)$/i;
      const maxBetMatch = rejectionMessageText.match(maxBetRegex);
      if (maxBetMatch) {
        const maxBetValue = Number(maxBetMatch[1]);
        log(`Новая максимальная ставка: ${maxBetValue}`, 'crimson');
        setMaximumStake(maxBetValue);
      }
    }
    log('Ставка не принята', 'red');
    const continueButton = document.querySelector(
      '.submit button[data-bind*="Continue"]:not([style="display: none;"])'
    ) as HTMLElement;
    if (!continueButton) {
      log('Не найдена кнопка Continue', 'crimson');
    } else {
      continueButton.click();
    }
    return false;
  }
  log('Не найден результат ставки. Считаем ставку не принятой', 'red');
  return false;
};

export default checkStakeStatus;
