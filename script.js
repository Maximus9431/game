document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, { passive: false });
  
const eggColors = ['blue', 'green', 'red', 'pink', 'yellow'];
const eggColor = eggColors[Math.floor(Math.random() * eggColors.length)];
const egg = document.getElementById('egg');

const instruction = document.getElementById('instruction');

const pets = [
    { name: "Игнис", img: "pets/pet1.jpg" },
    { name: "Флэймур", img: "pets/pet2.jpg" },
    { name: "Глимми", img: "pets/pet3.jpg" },
    { name: "Тенекрыл", img: "pets/pet5.jpg" },
    { name: "Ардора", img: "pets/pet6.jpg" },
    { name: "Фьорик", img: "pets/pet7.jpg" },
    { name: "Циркса", img: "pets/pet8.jpg" },
    { name: "Лаврон", img: "pets/pet9.jpg" },
    { name: "Вайспик", img: "pets/pet10.jpg" },
    { name: "Шейдис", img: "pets/pet11.jpg" },
    { name: "Лиракс", img: "pets/pet12.jpg" },
    { name: "Скэлло", img: "pets/pet13.jpg" },
    { name: "Дракис", img: "pets/pet14.jpg" },
    { name: "Нефира", img: "pets/pet15.jpg" },
    { name: "Талум", img: "pets/pet16.jpg" },
    { name: "Твисти", img: "pets/pet17.jpg" },
    { name: "Зорракс", img: "pets/pet18.jpg" },
    { name: "Лимфус", img: "pets/pet19.jpg" },
  ];

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
    
        // Выбираем случайного питомца
        const chosenPet = pets[Math.floor(Math.random() * pets.length)];
    
        // Показываем изображение питомца
        const pet = document.createElement('img');
        pet.src = chosenPet.img;
        pet.className = 'pet';
        document.querySelector('.container').appendChild(pet);
    
        // Имя питомца
        const petName = document.createElement('div');
        petName.className = 'pet-name';
        petName.textContent = `Поздравляем! Это ${chosenPet.name} 🐾`;
        document.querySelector('.container').appendChild(petName);
    
        hatchSound.play();
        Telegram.WebApp.sendData(JSON.stringify({
            level: 1,
            actions: 0,
            pet: chosenPet.name
          }));
          
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

