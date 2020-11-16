import doStakeGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/doStake';
import { log } from '@kot-shrodingera-team/germes-utils';
import getCoefficient from '../stake_info/getCoefficient';
import { clearDoStakeTime } from '../stake_info/doStakeTime';

const preCheck = (): boolean => {
  const acceptChangesButton = document.querySelector(
    '.submit button[data-bind*="AcceptChanges"]:not([style="display: none;"])'
  ) as HTMLElement;
  if (acceptChangesButton) {
    log('В купоне есть изменения. Принимаем. Ставку не делаем', 'crimson');
    acceptChangesButton.click();
    return false;
  }
  return true;
};

// const postCheck = (): boolean => {
//   return true;
// };

const doStake = doStakeGenerator({
  preCheck,
  doStakeButtonSelector:
    '.submit button[data-bind*="SubmitBets"]:not([style="display: none;"])',
  getCoefficient,
  disabledCheck: true,
  // errorClasses: [
  //   {
  //     className: '',
  //     message: '',
  //   },
  // ],
  // postCheck,
  clearDoStakeTime,
});

export default doStake;
