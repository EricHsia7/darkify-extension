import css from './index.css';
var md5 = require('md5');

var preloadedLinks: object = {};
var limit = 16;

interface link {
  link: string;
  score: number;
  hash: string;
  text: string;
}

function convertLinksToPermanent(href: string): string {
  const isAbsolute = href.startsWith('http://') || href.startsWith('https://');
  // If the link is not absolute, convert it to an absolute URL
  if (!isAbsolute) {
    const absoluteURL = new URL(href, document.baseURI);
    return absoluteURL.href;
  } else {
    return href;
  }
}

function addLinkToSheet(link: link): void {
  var sheet = document.querySelector('.webPreloaderSheet');
  var element = document.createElement('div');
  element.classList.add('webPreloaderSheetLink');

  var text = document.createElement('div');
  text.classList.add('webPreloaderSheetLinkText');
  text.innerText = link.text;
  element.appendChild(text);

  var url = document.createElement('div');
  url.classList.add('webPreloaderSheetLinkURL');
  url.innerText = decodeURIComponent(link.url);
  element.appendChild(url);

  sheet.appendChild(element);
}

function preloadLinks(): void {
  var button = document.querySelector('.webPreloaderButton');
  var currentURL = new URL(location.href);
  var links = document.querySelectorAll('a[href]');
  var queue: link[] = [];
  var queue_hash: string[] = [];
  for (var link of links) {
    if (!(link === null)) {
      var hrefStr: string = String(link.getAttribute('href'));
      if (/.*(login|signin|sign-in|auth|authenticate|account|user|password|key).*/gm.test(hrefStr)) {
        continue;
      }
      if (!/^http.*/gm.test(hrefStr) && !/^(\/|\.\/).*/gm.test(hrefStr)) {
        continue;
      }
      var score = 0;
      var url = new URL(convertLinksToPermanent(hrefStr));
      var rect = link.getBoundingClientRect();
      if (String(url.host).indexOf(String(currentURL.host)) > -1) {
        score += 1;
      }
      if (!/\.[a-z]{1,5}$/gm.test(String(url.pathname)) || /\.html$/gm.test(String(url.pathname))) {
        score += 10;
      }
      if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
        score += 1000;
      }
      var linkObj: link = { url: url.href, score: score, hash: md5(url), text: link.innerText };
      if (queue_hash.indexOf(linkObj.hash) < 0) {
        queue.push(linkObj);
        queue_hash.push(linkObj.hash);
      }
    }
  }
  queue.sort(function (a, b) {
    return b.score - a.score;
  });
  for (var i = 0; i < queue.length; i++) {
    if (i < limit) {
      var link = queue[i];
      preloadedLinks[`hash_${link.hash}`] = link;
      addLinkToSheet(link);
      GM_xmlhttpRequest({
        method: 'GET',
        url: link.url,
        onload: function (response) {
          if (Object.entries(preloadedLinks).length === limit || Object.entries(preloadedLinks).length === queue.length) {
            button.setAttribute('status', '2');
          } else {
            button.setAttribute('status', '1');
          }
        },
        onerror: function (error) {
          button.setAttribute('status', '0');
          console.error(`Error preloading ${url}:`, error);
        }
      });
    }
  }
}

function initialize(): void {
  //load css
  var style = document.createElement('style');
  style.innerHTML = css;
  document.body.appendChild(style);

  //add button
  var button = document.createElement('div');
  button.classList.add('webPreloaderButton');
  button.addEventListener('click', function (event) {
    event.preventDefault();
    document.querySelector('.webPreloaderSheet').setAttribute('displayed', 'true');
    document.querySelector('.webPreloaderSheetBackground').setAttribute('displayed', 'true');
  });
  document.body.appendChild(button);

  //add background of the modal bottom sheet
  var sheetBackground = document.createElement('div');
  sheetBackground.classList.add('webPreloaderSheetBackground');
  sheetBackground.addEventListener('click', function (event) {
    event.preventDefault();
    document.querySelector('.webPreloaderSheet').setAttribute('displayed', 'false');
    document.querySelector('.webPreloaderSheetBackground').setAttribute('displayed', 'false');
  });
  document.body.appendChild(sheetBackground);

  //add modal bottom sheet
  var sheet = document.createElement('div');
  sheet.classList.add('webPreloaderSheet');
  document.body.appendChild(sheet);

  //preload links
  preloadLinks();
}

var webPreloader = {
  initialize,
  preloadLinks
};

webPreloader.initialize();

export default webPreloader;
