import {
  checkBookerHost,
  checkCurrency,
  getElement,
  log,
} from '@kot-shrodingera-team/germes-utils';
import {
  NewUrlError,
  JsFailError,
} from '@kot-shrodingera-team/germes-utils/errors';
import getSiteCurrency from '../helpers/getSiteCurrency';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import {
  balanceReady,
  refreshBalance,
  updateBalance,
} from '../stake_info/getBalance';

const preOpenEvent = async (): Promise<void> => {
  if (!checkBookerHost()) {
    log('Открыта не страница конторы (или зеркала)', 'crimson');
    log(`${window.location.href} !== ${worker.BookmakerMainUrl}`, 'crimson');
    window.location.href = new URL(worker.BookmakerMainUrl).href;
    throw new NewUrlError('Открываем страницу БК');
  }

  await authStateReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    throw new JsFailError('Нет авторизации');
  }
  log('Есть авторизация', 'steelblue');
  await balanceReady();
  updateBalance();
  await refreshBalance();

  const siteCurrency = getSiteCurrency();
  checkCurrency(siteCurrency);

  if (!/\/live-betting/.test(window.location.pathname)) {
    log('Открыт не Live', 'crimson');
    window.location.pathname = '/en/live-betting';
    throw new NewUrlError('Переходим на Live');
  } else {
    log('Открыт Live', 'steelblue');
    const liveDiv = await getElement('.livemenu > div');
    if (!liveDiv) {
      throw new JsFailError('Не найдены события в боковом меню');
    }
  }
};

export default preOpenEvent;
