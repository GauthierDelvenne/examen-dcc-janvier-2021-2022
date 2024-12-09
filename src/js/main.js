import {fonts} from "./fonts";
import {settings as s} from "./settings";
//Déclaration de const
const ulAppElement = document.querySelector(s.ulAppElementSelector);
const scoreElement = document.querySelector(s.scoreElementSelector);
const timeElement = document.querySelector(s.timeElementSelector);
const dataOptionElement = document.getElementById(s.dataOptionElementId);
const formElement = document.getElementById(s.formElementId);
const endFormElement = document.getElementById(s.endFormElementId);
const nameInputElement = document.getElementById(s.nameInputElementId);
const familyInputElement = document.getElementById(s.familyInputElementId);
const wrongCardsUlElement = document.querySelector(s.wrongCardsUlElementSelector);

//Déclaration de variables
let score = 0;
let timeLeft = s.maxTime;
let intervalId = null;


//Déclaration de fonction
function generateCardElement(font) {
    ulAppElement.insertAdjacentHTML('afterbegin', `<li data-font-name="${font.name}" data-family="${font.family}" class='app__item'>
  <div class="app__item__info"><span class="app__item__info__name">${font.name}</span>
    <span class="app__item__info__info">${font.family} - ${font.author}</span>
  </div>
  <img class='app__item__font' src='./assets/fonts/${font.file}.svg' alt='Aa, abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ'>
</li>`)
}

function displayScore() {
    scoreElement.textContent = scoreElement.dataset.text + score + '/' + fonts.length;
}

function formatTime(timeLeft) {
    const seconds = timeLeft % 60;
    const minutes = Math.trunc(timeLeft / 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function displayTime() {
    timeElement.textContent = timeElement.dataset.text + formatTime(timeLeft);
}

function generateOptionElement(font) {
    dataOptionElement.insertAdjacentHTML('beforeend', `<option value="${font.name}"></option>`)
}

function pushCardToWrongCardUl(lastCardElement) {
    wrongCardsUlElement.insertAdjacentElement('afterbegin', lastCardElement)
}

function updateScore() {
    const lastCardElement = document.querySelector(s.lastCardElementSelector);
    const oldScore = score;
    if (nameInputElement.value === lastCardElement.dataset.fontName) {
        score += s.halfPoint;
    }
    if (familyInputElement.value === lastCardElement.dataset.family) {
        score += s.halfPoint;
    }
    if (score !== (oldScore + s.halfPoint * 2)) {
        lastCardElement.classList.add('app__item--move')
        lastCardElement.classList.add('app__item--move--error')
        document.ontransitionend = () => {
            lastCardElement.classList.remove('app__item--move')
            lastCardElement.classList.remove('app__item--move--error')
            pushCardToWrongCardUl(lastCardElement);
            checkIfGameIsOver();
        }
    } else {
        lastCardElement.classList.add('app__item--move')
        lastCardElement.classList.add('app__item--move--success')
        document.ontransitionend = () => {
            lastCardElement.remove();
            checkIfGameIsOver();
        }
    }
    displayScore();
}

function updateTime() {
    const lastCardElement = document.querySelector(s.lastCardElementSelector);
    timeLeft--;
    displayTime();
    if (timeLeft === 0) {
        lastCardElement.classList.add('app__item--move')
        lastCardElement.classList.add('app__item--move--error')
        document.ontransitionend = () => {
            lastCardElement.classList.remove('app__item--move')
            lastCardElement.classList.remove('app__item--move--error')
            pushCardToWrongCardUl(lastCardElement);
            timeLeft = s.maxTime;
        }
    }
}

function checkIfGameIsOver() {
    if (ulAppElement.children.length === 0) {
        endFormElement.classList.remove('play--again--hidden');
        clearInterval(intervalId);
    }
}
function restartGame() {
    score = 0;
    timeLeft = s.maxTime;
    displayScore();
    displayTime();
    ulAppElement.innerHTML = '';
    wrongCardsUlElement.innerHTML = '';
    for (const font of fonts) {
        generateCardElement(font);
        generateOptionElement(font);
    }
    endFormElement.classList.add('play--again--hidden');
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(updateTime, 1000);
}


//Instruction
for (const font of fonts) {
    generateCardElement(font);
    generateOptionElement(font);

}
displayScore();
displayTime();
formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    updateScore();
    timeLeft = s.maxTime;
});
endFormElement.addEventListener('click', ()=>{
    endFormElement.classList.add('play--again--hidden');
    restartGame();
});
intervalId = setInterval(() => {
    updateTime();
}, 1000);


