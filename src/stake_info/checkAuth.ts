import checkAuthGenerator, {
  authStateReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';

export const authStateReady = authStateReadyGenerator({
  noAuthElementSelector: 'li.login a',
  authElementSelector: '.username',
  maxDelayAfterNoAuthElementAppeared: 0,
  logging: true,
});

const checkAuth = checkAuthGenerator({
  authElementSelector: '.username',
});

export default checkAuth;
