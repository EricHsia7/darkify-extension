import { initializeButton, initializeCSS, initializeMask } from './interface/index.ts';

const md5 = require('md5');

function initialize(): void {
  initializeCSS();
  initializeButton();
  initializeMask();
}

var autoDarkMode = {
  initialize
};

autoDarkMode.initialize();

export default autoDarkMode;