import {
  balanceReadyGenerator,
  getBalanceGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getBalance';

export const balanceReady = balanceReadyGenerator({
  balanceSelector: '.balance',
  balanceRegex: null,
});

const getBalance = getBalanceGenerator({
  balanceSelector: '.balance',
  balanceRegex: null,
});

export const updateBalance = (): void => {
  worker.JSBalanceChange(getBalance());
};

export default getBalance;
