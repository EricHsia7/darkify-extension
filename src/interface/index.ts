import { getDarkModeStyle } from '../core/index.ts';
import { generateID } from '../tools/index.ts';

import style from './index.css';
import theme from './theme.css';

export function initializeCSS(): void {
  //load css
  var themeLoader = document.createElement('style');
  themeLoader.innerHTML = theme;
  document.documentElement.appendChild(themeLoader);
  var styleLoader = document.createElement('style');
  styleLoader.innerHTML = style;
  document.documentElement.appendChild(styleLoader);
  var dark_mode_style_loader = document.createElement('style');
  dark_mode_style_loader.classList.add('dark_mode_style_loader');
  document.documentElement.appendChild(dark_mode_style_loader);
}

export function initializeButton(): void {
  //add button
  var button = document.createElement('div');
  button.classList.add('darkify_button');
  button.setAttribute('dark-mode', 'false');
  button.setAttribute('darkifying', 'false');
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" mode="light"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 60q-74.92 0-127.46-52.54Q300-405.08 300-480q0-74.92 52.54-127.46Q405.08-660 480-660q74.92 0 127.46 52.54Q660-554.92 660-480q0 74.92-52.54 127.46Q554.92-300 480-300ZM80-450q-12.75 0-21.37-8.63Q50-467.26 50-480.01q0-12.76 8.63-21.37Q67.25-510 80-510h90q12.75 0 21.38 8.63 8.62 8.63 8.62 21.38 0 12.76-8.62 21.37Q182.75-450 170-450H80Zm710 0q-12.75 0-21.38-8.63-8.62-8.63-8.62-21.38 0-12.76 8.62-21.37Q777.25-510 790-510h90q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q892.75-450 880-450h-90ZM479.99-760q-12.76 0-21.37-8.62Q450-777.25 450-790v-90q0-12.75 8.63-21.37 8.63-8.63 21.38-8.63 12.76 0 21.37 8.63Q510-892.75 510-880v90q0 12.75-8.63 21.38-8.63 8.62-21.38 8.62Zm0 710q-12.76 0-21.37-8.63Q450-67.25 450-80v-90q0-12.75 8.63-21.38 8.63-8.62 21.38-8.62 12.76 0 21.37 8.62Q510-182.75 510-170v90q0 12.75-8.63 21.37Q492.74-50 479.99-50ZM240.23-678.38l-50.31-48.93q-8.92-8.31-8.61-20.88.31-12.58 8.73-21.89 9.19-9.3 21.58-9.3 12.38 0 21.07 9.3L282-720.15q8.69 9.3 8.69 21.07t-8.5 21.08q-8.5 9.31-20.57 8.81-12.08-.5-21.39-9.19Zm487.08 488.46L678-239.85q-8.69-9.3-8.69-21.38 0-12.08 8.69-20.77 8.12-9.31 20.29-8.81t21.48 9.19l50.31 48.93q8.92 8.31 8.61 20.88-.31 12.58-8.73 21.89-9.19 9.3-21.58 9.3-12.38 0-21.07-9.3ZM678-677.81q-9.31-8.5-8.81-20.57.5-12.08 9.19-21.39l48.93-50.31q8.31-8.92 20.88-8.61 12.58.31 21.89 8.73 9.3 9.19 9.3 21.58 0 12.38-9.3 21.07L720.15-678q-9.3 8.69-21.07 8.69t-21.08-8.5ZM189.92-189.84q-9.3-9.39-9.3-21.78 0-12.38 9.3-21.07L239.85-282q9.3-8.69 21.38-8.69 12.08 0 20.77 8.69 8.92 8.12 8.42 20.29t-8.8 21.48l-48.93 50.31q-8.69 9.3-21.07 9-12.39-.31-21.7-8.92ZM480-480Z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" mode="dark"><path d="M481.15-140Q339-140 240.08-238.92 141.16-337.85 141.16-480q0-118.38 73.26-210.46 73.27-92.08 195.19-118.69 12.62-3.16 22.23.61 9.62 3.77 15.62 11.23 6 7.47 7.08 18.12 1.07 10.65-5 21.27-12.39 22.54-18.39 46.83t-6 51.09q0 98.33 68.84 167.17Q562.82-424 661.15-424q29.47 0 56.31-7.46 26.85-7.46 47-17.31 9.85-4.3 19.23-3.04 9.39 1.27 16.02 6.27 7.37 5 10.94 13.66 3.58 8.65.81 20.34-21.31 118-114.81 194.77Q603.15-140 481.15-140Zm0-60q88 0 158-48.5t102-126.5q-20 5-40 8t-40 3q-123 0-209.5-86.5T365.15-660q0-20 3-40t8-40q-78 32-126.5 102t-48.5 158q0 116 82 198t198 82Zm-10-270Z"/></svg> `;
  button.addEventListener('click', function (event) {
    event.preventDefault();
    switchDarkMode();
  });
  document.documentElement.appendChild(button);
}

export function initializeMask(): void {
  var transitionMask = document.createElement('div');
  transitionMask.classList.add('darkify_transition_mask');
  document.documentElement.appendChild(transitionMask);
  var grayMask = document.createElement('div');
  grayMask.classList.add('darkify_gray_mask');
  document.documentElement.appendChild(grayMask);
}

function getTransitionKeyframes(): string {
  var padding: number = 100;
  var windowWidth: number = window.innerWidth;
  var windowHeight: number = window.innerHeight;
  var radius: number = 43 / 2;
  var centerX: number = 12 + radius;
  var centerY: number = windowHeight - (12 + radius);
  var cornerX: number = windowWidth + padding;
  var cornerY: number = -1 * padding;
  var scale: number = Math.sqrt(Math.pow(cornerX - centerX, 2) + Math.pow(cornerY - centerY, 2)) / radius;
  var keyframes: string = `@keyframes transitioning-zoom { 0% {transform: scale(1);} 100% {transform: scale(${scale});}}`;
  return keyframes;
}

function turnOnDarkMode(): void {
  var sessionID: string = generateID('d_');
  var button = document.querySelector('.darkify_button');
  button.setAttribute('darkifying', 'true');
  var keyframesLoader = document.createElement('style');
  keyframesLoader.id = `${sessionID}_keyframes`;
  keyframesLoader.innerHTML = getTransitionKeyframes();
  document.documentElement.appendChild(keyframesLoader);
  var darkModeStyle = getDarkModeStyle();
  var grayMask = document.querySelector('.darkify_gray_mask');
  var transitionMask = document.querySelector('.darkify_transition_mask');
  transitionMask.classList.add('darkify_transitioning');
  transitionMask.addEventListener(
    'animationend',
    function (e) {
      var keyframesLoaderInstance = document.querySelector(`style#${sessionID}_keyframes`);
      if (!(keyframesLoaderInstance === null)) {
        keyframesLoaderInstance.remove();
      }
      transitionMask.classList.remove('darkify_transitioning');
      grayMask.classList.add('darkify_displayed');
      document.querySelector('style.dark_mode_style_loader').innerHTML = darkModeStyle;
      grayMask.classList.add('darkify_fade_out');
      grayMask.addEventListener(
        'animationend',
        function (e) {
          grayMask.classList.remove('darkify_displayed');
          grayMask.classList.remove('darkify_fade_out');
        },
        { once: true }
      );
      button.setAttribute('darkifying', 'false');
    },
    { once: true }
  );
}

function turnOffDarkMode(): void {
  var sessionID: string = generateID('d_');
  var button = document.querySelector('.darkify_button');
  button.setAttribute('darkifying', 'true');
  var keyframesLoader = document.createElement('style');
  keyframesLoader.id = `${sessionID}_keyframes`;
  keyframesLoader.innerHTML = getTransitionKeyframes();
  document.documentElement.appendChild(keyframesLoader);
  var grayMask = document.querySelector('.darkify_gray_mask');
  var transitionMask = document.querySelector('.darkify_transition_mask');
  transitionMask.classList.add('darkify_transitioning');
  transitionMask.addEventListener(
    'animationend',
    function (e) {
      var keyframesLoaderInstance = document.querySelector(`style#${sessionID}_keyframes`);
      if (!(keyframesLoaderInstance === null)) {
        keyframesLoaderInstance.remove();
      }
      transitionMask.classList.remove('darkify_transitioning');
      grayMask.classList.add('darkify_displayed');
      document.querySelector('style.dark_mode_style_loader').innerHTML = '';
      grayMask.classList.add('darkify_fade_out');
      grayMask.addEventListener(
        'animationend',
        function (e) {
          grayMask.classList.remove('darkify_displayed');
          grayMask.classList.remove('darkify_fade_out');
        },
        { once: true }
      );
      button.setAttribute('darkifying', 'false');
    },
    { once: true }
  );
}

function switchDarkMode(): void {
  var button = document.querySelector('.darkify_button');
  var currentMode = button.getAttribute('dark-mode');
  var darkifying = button.getAttribute('darkifying');
  if (darkifying === 'false') {
    if (currentMode === 'false') {
      button.setAttribute('dark-mode', 'true');
      turnOnDarkMode();
    } else {
      if (currentMode === 'true') {
        button.setAttribute('dark-mode', 'false');
        turnOffDarkMode();
      }
    }
  }
}
