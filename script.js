
// Отключение прокрутки
document.body.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

const egg = document.getElementById('egg');
const topHalf = document.getElementById('egg-top');
const bottomHalf = document.getElementById('egg-bottom');
const instruction = document.getElementById('instruction');

const crackSound = new Audio('sounds/crack.mp3');
const hatchSound = new Audio('sounds/hatch.mp3');

const pets = Array.from({ length: 50 }, (_, i) => ({
    name: `Питомец ${i + 1}`,
    img: `pets/pet${i + 1}.png`
}));

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

        egg.classList.remove('egg-crack-animate');
        void egg.offsetWidth;
        egg.classList.add('egg-crack-animate');

        if (swipeCount >= 10) {
            cracked = true;
            crackEgg();
        }
    }
});

function crackEgg() {
    egg.classList.add('hidden');
    topHalf.classList.remove('hidden');
    bottomHalf.classList.remove('hidden');
    topHalf.classList.add('crack');
    bottomHalf.classList.add('crack');

    const pet = pets[Math.floor(Math.random() * pets.length)];

    setTimeout(() => {
        const petImg = document.createElement('img');
        petImg.src = pet.img;
        petImg.className = 'pet';
        document.querySelector('.container').appendChild(petImg);

        const petName = document.createElement('div');
        petName.className = 'pet-name';
        petName.textContent = `Поздравляем! Это ${pet.name}`;
        document.querySelector('.container').appendChild(petName);

        hatchSound.play();

        Telegram.WebApp.sendData(JSON.stringify({
            level: 1,
            actions: 0,
            pet: pet.name
        }));
    }, 800);
}
