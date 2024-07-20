import { initializeButton, initializeCSS, initializeMask } from './interface/index.ts';

function initialize(): void {
  initializeCSS();
  initializeButton();
  initializeMask();
}

var darkify = {
  initialize
};

darkify.initialize();

export default darkify;
