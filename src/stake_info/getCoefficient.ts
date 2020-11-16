import getCoefficientGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getCoefficient';

const getCoefficient = getCoefficientGenerator({
  coefficientSelector: '.price',
});

export default getCoefficient;
