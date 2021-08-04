import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getStakeInfoValue';
import { StakeInfoValueOptions } from '@kot-shrodingera-team/germes-generators/stake_info/types';
import { getElement, log } from '@kot-shrodingera-team/germes-utils';

export const balanceSelector = '.balance';

const balanceOptions: StakeInfoValueOptions = {
  name: 'balance',
  // fixedValue: () => 0,
  valueFromText: {
    text: {
      // getText: () => '',
      selector: balanceSelector,
      // context: () => document,
    },
    // replaceDataArray: [
    //   {
    //     searchValue: '',
    //     replaceValue: '',
    //   },
    // ],
    // removeRegex: /[\s,']/g,
    // matchRegex: /(\d+(?:\.\d+)?)/,
    errorValue: 0,
  },
  // zeroValues: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

const getBalance = getStakeInfoValueGenerator(balanceOptions);

export const balanceReady = stakeInfoValueReadyGenerator(balanceOptions);

export const updateBalance = (): void => {
  worker.StakeInfo.Balance = getBalance();
  worker.JSBalanceChange(getBalance());
};

export const refreshBalance = async (): Promise<void> => {
  const refreshBalanceButton = await getElement<HTMLElement>(
    '.updateFundsIcon'
  );
  if (!refreshBalanceButton) {
    log('Не найдена кнопка обновления баланса', 'crimson');
  } else {
    log('Нажимаем кнопку обновления баланса', 'orange');
    refreshBalanceButton.click();
    getElement('.updateFundsIcon.rotate').then((rotateButton) => {
      if (rotateButton) {
        log('Кнопка обновления баланса вращается', 'white', true);
        getElement('.updateFundsIcon:not(.rotate)').then((notRotateButton) => {
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
        });
      } else {
        log('Кнопка обновления баланса не начала вращаться', 'white', true);
      }
    });
  }
};

export default getBalance;
