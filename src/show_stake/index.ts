import { log, checkUrl, getElement } from '@kot-shrodingera-team/germes-utils';
import clearCoupon from './clearCoupon';
import { updateBalance } from '../stake_info/getBalance';
import setBetAcceptMode from './setBetAcceptMode';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import JsFailError from './errors/jsFailError';
import NewUrlError from './errors/newUrlError';
import openBet from './openBet';
import openEvent from './openEvent';
import preCheck from './preCheck';
import { setMaximumStake } from '../stake_info/getMaximumStake';

let couponOpenning = false;

export const isCouponOpenning = (): boolean => couponOpenning;

const showStake = async (): Promise<void> => {
  localStorage.setItem('couponOpening', '1');
  couponOpenning = true;
  try {
    if (!checkUrl()) {
      log('Открыта не страница конторы (или зеркала)', 'crimson');
      window.location.href = new URL(worker.BookmakerMainUrl).href;
      throw new NewUrlError('Открывает страницу БК');
    }

    await authStateReady();
    worker.Islogin = checkAuth();
    worker.JSLogined();
    if (!worker.Islogin) {
      throw new JsFailError('Нет авторизации');
    }
    log('Есть авторизация', 'steelblue');

    const couponCleared = await clearCoupon();
    if (!couponCleared) {
      throw new JsFailError('Не удалось очистить купон');
    }

    const refreshBalanceButton = (await getElement(
      '.updateFundsIcon'
    )) as HTMLElement;
    if (!refreshBalanceButton) {
      log('Не найдена кнопка обновления баланса', 'crimson');
    } else {
      log('Нажимаем кнопку обновления баланса', 'orange');
      refreshBalanceButton.click();
      getElement('.updateFundsIcon.rotate').then((rotateButton) => {
        if (rotateButton) {
          log('Кнопка обновления баланса вращается', 'white', true);
          getElement('.updateFundsIcon:not(.rotate)').then(
            (notRotateButton) => {
              if (notRotateButton) {
                log(
                  'Кнопка обновления баланса перестала вращаться. Обновляем баланс в боте',
                  'white',
                  true
                );
                updateBalance();
              } else {
                log(
                  'Кнопка обновления баланса не прекратила вращаться',
                  'white',
                  true
                );
              }
            }
          );
        } else {
          log('Кнопка обновления баланса не начала вращаться', 'white', true);
        }
      });
    }
    updateBalance();
    setMaximumStake(0);

    await preCheck();

    await openEvent();

    await openBet();

    log('Ставка успешно открыта', 'green');
    setBetAcceptMode();
    couponOpenning = false;
    worker.JSStop();
  } catch (error) {
    if (error instanceof JsFailError) {
      log(error.message, 'red');
      couponOpenning = false;
      localStorage.setItem('couponOpening', '0');
      worker.JSFail();
      if (error.message === 'Событие не найдено') {
        log('Возможно завис список событий. Перезагружаем страницу', 'orange');
        window.location.reload();
      }
    }
    if (error instanceof NewUrlError) {
      log(error.message, 'orange');
    }
  }
};

export default showStake;
