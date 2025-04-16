
const eggColors = ['blue', 'green', 'red', 'purple', 'yellow'];
const eggColor = eggColors[Math.floor(Math.random() * eggColors.length)];
const egg = document.getElementById('egg');
const dragon = document.getElementById('dragon');
const instruction = document.getElementById('instruction');

egg.src = `eggs/${eggColor}.png`;

let startX = 0;
let cracked = false;

egg.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});

egg.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const distance = endX - startX;
    if (Math.abs(distance) > 50 && !cracked) {
        cracked = true;
        crackEgg();
    }
});

function crackEgg() {
    egg.classList.add('cracked');
    setTimeout(() => {
        egg.classList.add('hidden');
        dragon.classList.remove('hidden');
        instruction.textContent = 'Поздравляем! У тебя появился дракон 🐉';
        Telegram.WebApp.sendData(JSON.stringify({ level: 1, actions: 0 }));
    }, 800);
}
