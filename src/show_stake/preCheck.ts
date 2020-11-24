import { getElement, log } from '@kot-shrodingera-team/germes-utils';
import JsFailError from './errors/jsFailError';
import NewUrlError from './errors/newUrlError';

const preCheck = async (): Promise<void> => {
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

export default preCheck;
