import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
// import { updateBalance, balanceReady } from '../stake_info/getBalance';
// import afterSuccesfulLogin from './afterSuccesfulLogin';

// const setLoginType = async (): Promise<boolean> => {
//   return true;
// };

const authorize = authorizeGenerator({
  openForm: {
    selector: 'li.login a',
    openedSelector: '#login.opened',
    // afterOpenDelay: 1000,
  },
  // setLoginType,
  loginInputSelector: 'input[name="Username"]',
  passwordInputSelector: 'input[name="Password"]',
  submitButtonSelector: 'button[type="submit"]',
  inputType: 'fireEvent',
  // beforeSubmitDelay: 0,
  // captchaSelector: '',
  // loginedWait: {
  //   loginedSelector: '',
  //   balanceReady,
  //   updateBalance,
  // },
  // afterSuccesfulLogin,
});

export default authorize;
