document.addEventListener('contextmenu', function(e) {
    e.preventDefault();  // Disable right click
  });

  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'v' || e.key === 'c' || e.key === 's' || e.key === 'p')) {
      e.preventDefault();
    }

  });
  
const data = {
    "username": "",
    "score": 0,
    "text": ""
};

document.getElementById('name-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const userName = document.getElementById('user-name').value;
    document.getElementById('user-greeting').innerText = `Добре дошъл, ${userName}! Подготви се да пишеш...`;
    data.username = userName;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    updateDisplay();
});

const fullText = `Някакъв древен Посейдон обаче ме въвличаше в тайнствата на подводните рифове, караше ме да поглъщам жадно цветовете от кехлибарените силуети на кефалите, лилавото оперение на враните, червените леферени очи, улавяше ме като баща сина си за ръка и ми показваше потопени забравени кейове, котви, вериги и къси рухнали пътища, откъдето е тръгвал и където е свършвал животът...
Само да удари с тризъбеца, и ще ме превърне в скала... в хвърлен камък... но не, привързваше ме като Одисей към мачтата, към дъното, за да слушам песента на сирените, да се науча да пея тайнствената песен на морето...
Това дъно плаваше през времето и ме връщаше, изпълнен с благодарност, към далечни диви брегове, за които дори не подозирах...
Така започна да ме измъчва войната между думите в пустинята и царството на мълчанието.`;

const showText = ``;

let currentIndex = 0;
const linesToShow = 3;
let displayedText = '';
let userText = '';
let timerInterval;
let startTime;
let elapsedTime = 0;
let errors = 0;
let inactivityTimer;
let stopped = false;

const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const timerDisplay = document.getElementById('timer');
const resultDisplay = document.getElementById('result-display');
const submitBtn = document.getElementById('submit-btn');
const scoreDisplay = document.getElementById('score-display');

function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function updateDisplay() {
    let lines = showText.slice(currentIndex).split('\n');
    displayedText = lines.slice(0, linesToShow).join('\n');
    textDisplay.textContent = displayedText;
}

function startTimer() {
    if (!timerInterval) {
        stopped = false;
        startTime = new Date() - elapsedTime * 1000; // Adjust start time based on elapsed time
        timerInterval = setInterval(() => {
            elapsedTime = Math.floor((new Date() - startTime) / 1000);
            timerDisplay.textContent = `Време: ${elapsedTime}с`;
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    stopped = true;
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        stopTimer(); // Pause the timer after 3 seconds of inactivity
    }, 3000);
}

function displayResults() {
    stopTimer();
    const normalizedOriginal = normalizeText(fullText);
    const normalizedUser = normalizeText(userText);
    const wordsOriginal = normalizedOriginal.split(/(?<!\p{L})|\b|\B(?!\p{L})/gu);
    const wordsUser = normalizedUser.split(/(?<!\p{L})|\b|\B(?!\p{L})/gu);
    let results = '';
    errors = 0;
    console.log(wordsOriginal);
    const maxLength = Math.max(wordsOriginal.length, wordsUser.length);
    for (let i = 0; i < maxLength; i++) {
        const originalWord = wordsOriginal[i] || '';
        const userWord = wordsUser[i] || '';

        if (originalWord === userWord) {
            results += `<span class="correct">${userWord}</span>`;
        } else {
            results += `<span class="incorrect">${userWord || '<span class="missing">[missing]</span>'}</span>`;
            errors++;
        }
    }
    resultDisplay.innerHTML = results;
    displayScore();
}

function displayScore() {
    const penalty = errors * 5;
    const finalScore = elapsedTime + penalty;
    scoreDisplay.innerHTML = `<h3>Твоят резултат: ${finalScore} секунди (Време: ${elapsedTime}с, Наказание: +${penalty}с за ${errors} грешки)</h3>`;
    data.score = finalScore;
}

typingInput.addEventListener('input', () => {
    userText = typingInput.value;
    resetInactivityTimer();
    if (currentIndex === 0 && userText.length === 1 || userText.length > 1 && stopped == true) {
        startTimer();
    }
    if (userText.length >= displayedText.length) {
        currentIndex += displayedText.length;
        updateDisplay();
    }
});

submitBtn.addEventListener('click', () => {
    clearTimeout(inactivityTimer);
    displayResults();
    timerDisplay.style.display = 'none';
    typingInput.style.display = 'none';
    submitBtn.style.display = 'none';
    
    const url = 'https://programming-burgas.com/api/contest/1a735f2c-6dfe-4e51-ac89-92598ec22546/participate';
    data.text = normalizeText(userText);
    
    console.log(data);
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => alert("Благодарим Ви за участието!"))
    .catch((error) => alert(error));

});