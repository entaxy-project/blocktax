export default () => {
  if (typeof navigator.languages !== 'undefined') {
    return navigator.languages[0];
  }

  return navigator.language;
};
