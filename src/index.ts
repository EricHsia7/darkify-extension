import { initializeButton, initializeCSS, initializeMask } from './interface/index.ts';


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