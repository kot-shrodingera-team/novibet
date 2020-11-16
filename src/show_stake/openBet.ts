import {
  awaiter,
  getElement,
  log,
  ri,
} from '@kot-shrodingera-team/germes-utils';
import getStakeCount from '../stake_info/getStakeCount';
import JsFailError from './errors/jsFailError';

const openBet = async (): Promise<void> => {
  const [marketName, stakeName, marketSysName] = worker.BetId.split('|');

  log(`Ставка "${worker.BetName}"`, 'steelblue');

  log(`Ищем маркет "${marketName}"`, 'steelblue');

  const marketTitles = [...document.querySelectorAll('.market .title')];
  const targetMarketTitleElement = marketTitles.find((marketTitle) => {
    const marketTitleText = marketTitle.textContent.trim();
    return ri`^${marketName}$`.test(marketTitleText);
  });

  if (!targetMarketTitleElement) {
    throw new JsFailError('Нужный маркет не найден');
  }

  const marketElement = targetMarketTitleElement.parentElement;
  log('Маркет найден', 'steelblue');
  marketElement.style.backgroundColor = 'green';
  log(`Ищем ставку "${stakeName}"`, 'steelblue');

  const bet = (await getElement(
    `[data-original-title="${stakeName}"]`,
    5000,
    marketElement
  )) as HTMLElement;

  if (!bet) {
    throw new JsFailError('Ставка не найдена');
  }
  log('Ставка найдена', 'steelblue');

  const maxTryCount = 5;
  for (let i = 1; i <= maxTryCount; i += 1) {
    bet.click();
    // eslint-disable-next-line no-await-in-loop
    const betAdded = await awaiter(() => getStakeCount() === 1, 1000, 50);

    if (!betAdded) {
      if (i === maxTryCount) {
        throw new JsFailError('Ставка так и не попала в купон');
      }
      log(`Ставка не попала в купон (попытка ${i})`, 'steelblue');
    } else {
      log('Ставка попала в купон', 'steelblue');
      break;
    }
  }
};

export default openBet;
