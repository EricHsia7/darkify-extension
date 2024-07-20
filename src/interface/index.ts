import css from './index.css';
import theme from './theme.css';

function initializeCSS(): void {
  //load css
  var style = document.createElement('style');
  style.innerHTML = theme + css;
  document.body.appendChild(style);
}

function initializeButton(): void {
  //add button
  var button = document.createElement('div');
  button.classList.add('autoDarkModeButton');
  button.addEventListener('click', function (event) {
    event.preventDefault();
    openSheet();
  });
  document.body.appendChild(button);
}

function initializeSheet(): void {
  //add background of the modal bottom sheet
  var sheetBackground = document.createElement('div');
  sheetBackground.classList.add('autoDarkModeSheetBackground');
  sheetBackground.addEventListener('click', function (event) {
    event.preventDefault();
    closeSheet();
  });
  document.body.appendChild(sheetBackground);

  //add modal bottom sheet
  var sheet = document.createElement('div');
  sheet.classList.add('autoDarkModeSheet');
  document.body.appendChild(sheet);
}

function openSheet(): void {
  const autoDarkModeSheetElement = document.querySelector('.autoDarkModeSheet');
  const autoDarkModeSheetBackgroundElement = document.querySelector('.autoDarkModeSheetBackground');
  autoDarkModeSheetElement.setAttribute('displayed', 'true');
  autoDarkModeSheetBackgroundElement.setAttribute('displayed', 'true');
}

function closeSheet(): void {
  const autoDarkModeSheetElement = document.querySelector('.autoDarkModeSheet');
  const autoDarkModeSheetBackgroundElement = document.querySelector('.autoDarkModeSheetBackground');
  autoDarkModeSheetElement.setAttribute('displayed', 'false');
  autoDarkModeSheetBackgroundElement.setAttribute('displayed', 'false');
}
