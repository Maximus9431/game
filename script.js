const eggImage = document.getElementById('egg-image');
const crackOverlay = document.getElementById('crack-overlay');
const swipeCountElement = document.getElementById('swipe-count');
const coinsDisplay = document.getElementById('coins-display');
const hatchButton = document.getElementById('hatch-btn');

let swipeCount = 0;
let coins = 0;
let isHatched = false;

// Инициализация Telegram Web App
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// Загрузка начального состояния
const urlParams = new URLSearchParams(window.location.search);
swipeCount = parseInt(urlParams.get('swipe')) || 0;
updateDisplay();

// Обработчик свайпов
eggImage.addEventListener('click', handleSwipe);
hatchButton.addEventListener('click', hatchEgg);

function handleSwipe() {
    if(isHatched) return;
    
    swipeCount++;
    updateCrackEffect();
    updateDisplay();
    
    if(swipeCount >= 10) {
        hatchButton.disabled = false;
    }
}

function updateCrackEffect() {
    const crackLevel = Math.min(swipeCount / 10, 1);
    crackOverlay.style.opacity = crackLevel;
    crackOverlay.style.backgroundImage = `url(crack-${Math.floor(crackLevel * 3)}.png)`;
}

function updateDisplay() {
    swipeCountElement.textContent = swipeCount;
    coinsDisplay.textContent = coins;
}

function hatchEgg() {
    if(swipeCount < 10) return;
    
    const rarity = calculateRarity();
    const petName = generatePetName(rarity);
    coins += 50;
    
    // Отправка данных в бот
    const data = {
        action: 'hatch',
        swipeCount: swipeCount,
        petName: petName,
        rarity: rarity,
        coinsEarned: 50
    };
    
    Telegram.WebApp.sendData(JSON.stringify(data));
    isHatched = true;
    eggImage.style.opacity = '0.5';
    hatchButton.disabled = true;
}

function calculateRarity() {
    const rarities = ['common', 'uncommon', 'rare', 'legendary'];
    const weights = [50, 30, 15, 5];
    const total = weights.reduce((a, b) => a + b);
    const random = Math.random() * total;
    
    let sum = 0;
    for(let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if(random <= sum) return rarities[i];
    }
    return 'common';
}

function generatePetName(rarity) {
    const names = {
        common: ['Котёнок', 'Щенок'],
        uncommon: ['Попугай', 'Хомяк'],
        rare: ['Единорог', 'Лисёнок'],
        legendary: ['Дракон', 'Феникс']
    };
    return names[rarity][Math.floor(Math.random() * names[rarity].length)];
}

// Предзагрузка изображений
['egg.png', 'crack-0.png', 'crack-1.png', 'crack-2.png'].forEach(src => {
    new Image().src = src;
});