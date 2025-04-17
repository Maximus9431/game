
const eggColors = ['blue', 'green', 'red', 'purple', 'yellow'];
const eggColor = eggColors[Math.floor(Math.random() * eggColors.length)];
const egg = document.getElementById('egg');
const dragon = document.getElementById('dragon');
const instruction = document.getElementById('instruction');

const crackSound = new Audio('sounds/crack.mp3');
const hatchSound = new Audio('sounds/hatch.mp3');

egg.src = `eggs/${eggColor}.png`;

let startX = 0;
let swipeCount = 0;
let cracked = false;

egg.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});

egg.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const distance = endX - startX;

    if (Math.abs(distance) > 30 && !cracked) {
        swipeCount++;
        instruction.textContent = `Осталось движений: ${10 - swipeCount}`;
        crackSound.currentTime = 0;
        crackSound.play();

        egg.classList.remove('swipe-hit');
        void egg.offsetWidth;
        egg.classList.add('swipe-hit');

        if (swipeCount >= 4) egg.classList.add('crack1');
        if (swipeCount >= 7) egg.classList.add('crack2');

        if (swipeCount >= 10) {
            cracked = true;
            crackEgg();
        }
    }
});

function crackEgg() {
    egg.classList.add('cracked');
    setTimeout(() => {
        egg.classList.add('hidden');
        dragon.classList.remove('hidden');
        dragon.classList.add('fade-in');
        instruction.textContent = 'Поздравляем! У тебя появился дракон 🐉';
        hatchSound.play();
        Telegram.WebApp.sendData(JSON.stringify({ level: 1, actions: 0 }));
    }, 800);
}

function createScratch(x, y) {
    const scratch = document.createElement('div');
    scratch.className = 'scratch-mark';
    scratch.style.left = x - 10 + 'px';
    scratch.style.top = y - 10 + 'px';
    container.appendChild(scratch);
    setTimeout(() => scratch.remove(), 400);
}
