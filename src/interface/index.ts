import style from './index.css';
import theme from './theme.css';

export function initializeCSS(): void {
  //load css
  var themeLoader = document.createElement('style');
  themeLoader.innerHTML = theme;
  document.body.appendChild(themeLoader);
  var styleLoader = document.createElement('style');
  styleLoader.innerHTML = style;
  document.body.appendChild(styleLoader);
}

export function initializeButton(): void {
  //add button
  var button = document.createElement('div');
  button.classList.add('autoDarkModeButton');
  button.addEventListener('click', function (event) {
    event.preventDefault();
    turnOnDarkMode();
  });
  document.body.appendChild(button);
}

export function initializeMask(): void {
  var mask = document.createElement('div');
  mask.classList.add('autoDarkModeTransitionMask');
  document.body.appendChild(mask);
}

function makeTransitionKeyframes(): string {
  var originalWidth = 43
  var originalHeight = 43
  var targetWidth = window.innerWidth;
  var targetHeight = window.innerHeight;
  
  
}

export function turnOnDarkMode(): void {
  const autoDarkModeTransitionMaskElement = document.querySelector('.autoDarkModeTransitionMask');
  autoDarkModeTransitionMaskElement.setAttribute('displayed', 'true');
}

export function turnOffDarkMode(): void {
  const autoDarkModeTransitionMaskElement = document.querySelector('.autoDarkModeTransitionMask');
  autoDarkModeTransitionMaskElement.setAttribute('displayed', 'false');
}
