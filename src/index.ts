import { initializeButton, initializeCSS, initializeSheet } from './interface/index.ts';

const md5 = require('md5');

function initialize(): void {
  initializeCSS();
  initializeButton();
  initializeSheet();
}

var autoDarkMode = {
  initialize
};

autoDarkMode.initialize();

export default autoDarkMode;