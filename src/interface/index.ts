import style from './index.css';
import theme from './theme.css';

const md5 = require('md5');

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

function getTransitionKeyframes(): string {
  var windowWidth: number = window.innerWidth;
  var windowHeight: number = window.innerHeight;
  var radius: number = 43 / 2;
  var centerX: number = 12 + radius;
  var centerY: number = windowHeight - (12 + radius);
  var cornerX: number = windowWidth + 20;
  var cornerY: number = -20;
  var scale: number = Math.sqrt(Math.pow(cornerX - centerX, 2) + Math.pow(cornerY - centerY, 2)) / radius;
  var keyframes: string = `@keyframes transitioning-zoom { 0% {transform: scale(1);} 100% {transform: scale(${scale});}}`;
  return keyframes;
}

export function turnOnDarkMode(): void {
  var sessionID: string = `d_${md5(Math.random() * new Date().getTime())}`;

  var keyframesLoader = document.createElement('style');
  keyframesLoader.id = `${sessionID}_keyframes`;
  keyframesLoader.innerHTML = getTransitionKeyframes();
  document.body.appendChild(keyframesLoader);

  var transitionMask = document.querySelector('.autoDarkModeTransitionMask');
  transitionMask.classList.add('autoDarkModeTransitioning');
  transitionMask.addEventListener(
    'animationend',
    function (e) {
      document.querySelector(`style#${sessionID}_keyframes`).remove();
      transitionMask.classList.remove('autoDarkModeTransitioning');
    },
    { once: true }
  );
}

export function turnOffDarkMode(): void {
  const autoDarkModeTransitionMaskElement = document.querySelector('.autoDarkModeTransitionMask');
  autoDarkModeTransitionMaskElement.setAttribute('displayed', 'false');
}
