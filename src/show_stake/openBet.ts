import {
  getElement,
  log,
  repeatingOpenBet,
  ri,
  text,
} from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import getStakeCount from '../stake_info/getStakeCount';
import clearCoupon from './clearCoupon';

const openBet = async (): Promise<void> => {
  /* ======================================================================== */
  /*                              Очистка купона                              */
  /* ======================================================================== */

  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    throw new JsFailError('Не удалось очистить купон');
  }

  /* ======================================================================== */
  /*                      Формирование данных для поиска                      */
  /* ======================================================================== */

  const [
    targetMarketName,
    stakeName,
    // marketSysName,
  ] = worker.BetId.split('|');

  /* ======================================================================== */
  /*                               Поиск ставки                               */
  /* ======================================================================== */

  log(`Ищем маркет "${targetMarketName.trim()}"`, 'steelblue');

  const marketTitles = [...document.querySelectorAll('.market .title')];
  const targetMarketTitleElement = marketTitles.find((marketTitle) => {
    const marketTitleText = marketTitle.textContent.trim();
    return ri`^${targetMarketName.trim()}$`.test(marketTitleText);
  });

  if (!targetMarketTitleElement) {
    throw new JsFailError('Нужный маркет не найден');
  }

  const marketElement = targetMarketTitleElement.parentElement;
  log('Маркет найден', 'steelblue');
  marketElement.style.backgroundColor = 'green';
  log(`Ищем ставку "${stakeName}"`, 'steelblue');

  const bet = await getElement<HTMLElement>(
    `[data-original-title="${stakeName}"]`,
    5000,
    marketElement
  );

  if (!bet) {
    throw new JsFailError('Ставка не найдена');
  }
  log('Ставка найдена', 'steelblue');

  /* ======================================================================== */
  /*           Открытие ставки, проверка, что ставка попала в купон           */
  /* ======================================================================== */

  const openingAction = async () => {
    bet.click();
  };
  await repeatingOpenBet(openingAction, getStakeCount, 5, 1000, 50);

  /* ======================================================================== */
  /*                    Вывод информации об открытой ставке                   */
  /* ======================================================================== */

  const eventNameSelector = '#betslip .event';
  const marketNameSelector = '#betslip .on_market';
  const betNameSelector = '#betslip .point';

  const eventNameElement = document.querySelector(eventNameSelector);
  const marketNameElement = document.querySelector(marketNameSelector);
  const betNameElement = document.querySelector(betNameSelector);

  if (!eventNameElement) {
    throw new JsFailError('Не найдено событие открытой ставки');
  }
  if (!marketNameElement) {
    throw new JsFailError('Не найден маркет открытой ставки');
  }
  if (!betNameElement) {
    throw new JsFailError('Не найдена роспись открытой ставки');
  }

  const eventName = text(eventNameElement);
  const marketName = text(marketNameElement);
  const betName = text(betNameElement);

  log(`Открыта ставка\n${eventName}\n${marketName}\n${betName}`, 'steelblue');
};

export default openBet;
