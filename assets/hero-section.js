let word = document.querySelector('.split-animation');
let buttons = document.querySelectorAll('.buttons--container .gradient-button');

let text = word.dataset.text;
let delayTimings = '';

let STAGGERCHILDREN = parseFloat(word.dataset.revealgap);
for (let index = 0; index < text.length + 20; index++) {
  let delay = index * STAGGERCHILDREN;
  delayTimings += `
  [data-delay="${delay}"]{
  --delay: ${delay}s;
  }
  `;
}

buttons.forEach((child, index) => {
  child.dataset.delay = (text.length + 2 + index * 2) * STAGGERCHILDREN;
});

document.head.innerHTML += `<style>${delayTimings}</style>`;

let empty = 0;
let sentence = text.split(' ');

let index = 0;
sentence.forEach((text) => {
  let wordHTMLContainer = text.split('').reduce((wordContainer, letter) => {
    let isEmpty = letter == ' ';

    let modifiedIndex = index <= empty ? index : index - empty;
    let delay = isEmpty ? 0 : modifiedIndex * STAGGERCHILDREN;
    index++;
    wordContainer += `<div class="animation-slide-in" data-delay=${delay}>${isEmpty ? '' : letter}</div>`;
    return wordContainer;
  }, '');

  word.innerHTML += `<div class="word-wrapper">
  ${wordHTMLContainer}
  </div>
  `;
});

let follower = document.querySelector('.follower');

window.addEventListener('mousemove', (e) => {
  if (
    e.target.parentElement.classList.contains('split-animation') ||
    e.target.parentElement.classList.contains('word-wrapper')
  ) {
    follower.style.setProperty('--scale', '2.2');
  } else if (e.target.classList.contains('gradient-button')) {
    follower.style.setProperty('--scale', '0');
  } else {
    follower.style.setProperty('--scale', '1');
  }

  follower.style.setProperty('--left', `${e.pageX - 17.5}px`);
  follower.style.setProperty('--top', `${e.pageY - 17.5}px`);
});
