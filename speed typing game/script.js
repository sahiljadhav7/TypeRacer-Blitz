const RandomQuote = "http://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quote-display");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const virtualKeyboardElement = document.getElementById("virtualKeyboard");

let timerStarted = false;
let startTime;
let timerInterval;

document.addEventListener("keydown", (event) => {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  const key = event.key.toUpperCase();
  handleInput(key);
});

function handleInput(key) {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");
  let correct = true;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) renderNewQuote();
  highlightVirtualKey(key);
}

function getRandomQuote() {
  return fetch(RandomQuote)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
  pauseTimer();
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  renderVirtualKeyboard();
  quoteInputElement.value = null;
}

function renderVirtualKeyboard() {
  virtualKeyboardElement.innerHTML = "";
  const keyboardLayout = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";

  for (let char of keyboardLayout) {
    const virtualKey = document.createElement("div");
    virtualKey.classList.add("virtual-key");
    virtualKey.innerText = char;
    virtualKey.addEventListener("click", () => {
      if (char === " ") {
        quoteInputElement.value += " ";
      } else {
        quoteInputElement.value += char;
      }
      handleInput(char);
      virtualKey.classList.add("active");
      setTimeout(() => {
        virtualKey.classList.remove("active");
      }, 200);
    });
    virtualKeyboardElement.appendChild(virtualKey);
  }
}

function highlightVirtualKey(key) {
  const virtualKeys = document.querySelectorAll(".virtual-key");
  virtualKeys.forEach((virtualKey) => {
    virtualKey.classList.remove("active");
    if (virtualKey.innerText === key) {
      virtualKey.classList.add("active");
      setTimeout(() => {
        virtualKey.classList.remove("active");
      }, 200);
    }
  });
}

function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 100);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerStarted = false;
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

renderNewQuote();
