import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import {
  log,
  getElement,
  awaiter,
  getRemainingTimeout,
  checkCouponLoadingError,
  checkCouponLoadingSuccess,
  text,
  // sendTGBotMessage,
} from '@kot-shrodingera-team/germes-utils';
import { StateMachine } from '@kot-shrodingera-team/germes-utils/stateMachine';

const loaderSelector =
  '#betslip .bs_overlay:not([style="display: none;"]) .timer canvas';
const errorSelector =
  '#betslip .bs_selections .info.error:not(#errorContainer)';
const betPlacedSelector = '#betslip .bs_selections .info .checkIcon';

const asyncCheck = async () => {
  const machine = new StateMachine();

  machine.promises = {
    loader: () => getElement(loaderSelector, getRemainingTimeout()),
    error: () => getElement(errorSelector, getRemainingTimeout()),
    betPlaced: () => getElement(betPlacedSelector, getRemainingTimeout()),
  };

  machine.setStates({
    start: {
      entry: async () => {
        log('Начало обработки ставки', 'steelblue');
      },
    },
    loader: {
      entry: async () => {
        log('Появился индикатор', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = 'индикатор';
        delete machine.promises.loader;
        machine.promises.loaderDissappeared = () =>
          awaiter(
            () => document.querySelector(loaderSelector) === null,
            getRemainingTimeout()
          );
      },
    },
    loaderDissappeared: {
      entry: async () => {
        log('Исчез индикатор', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = null;
        delete machine.promises.loaderDissappeared;
      },
    },
    error: {
      entry: async () => {
        log('Появилась ошибка', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = null;
        const errorText = text(machine.data.result);
        log(errorText, 'tomato');
        const rejectionMessageElement = document.querySelector(
          '[data-bind="text: RejectionMessage"]'
        );
        if (rejectionMessageElement) {
          const rejectionMessageText = text(rejectionMessageElement);
          const maxBetRegex = /^Max bet: (\d+(?:\.\d+)?)$/i;
          const maxBetMatch = rejectionMessageText.match(maxBetRegex);
          if (maxBetMatch) {
            const maxBetValue = Number(maxBetMatch[1]);
            log(`Новая максимальная ставка: ${maxBetValue}`, 'crimson');
            window.germesData.maximumStake = maxBetValue;
          }
        }
        const continueButton = document.querySelector<HTMLElement>(
          '.submit button[data-bind*="Continue"]:not([style="display: none;"])'
        );
        if (!continueButton) {
          log('Не найдена кнопка Continue', 'crimson');
        } else {
          continueButton.click();
        }
        // worker.Helper.SendInformedMessage(errorText);
        // sendTGBotMessage(
        //   '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
        //   126302051,
        //   errorText
        // );
        checkCouponLoadingError({});
      },
      final: true,
    },
    betPlaced: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingSuccess('Ставка принята');
      },
      final: true,
    },
    timeout: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingError({
          botMessage: 'Не дождались результата ставки',
          informMessage: 'Не дождались результата ставки',
        });
      },
      final: true,
    },
  });

  machine.start('start');
};

const checkCouponLoading = checkCouponLoadingGenerator({
  asyncCheck,
});

export default checkCouponLoading;
