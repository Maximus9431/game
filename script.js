let swipeCount = 0;
let isCracked = false;
let petName = "";
let petImg = "";
let coins = 0;
let rarity = "common";

const eggContainer = document.getElementById("egg-container");
const instruction = document.getElementById("instruction");

const shopTab = document.getElementById("shop-tab");
const questsTab = document.getElementById("quests-tab");
const leaderboardTab = document.getElementById("leaderboard-tab");

const shop = document.getElementById("shop");
const quests = document.getElementById("quests");
const leaderboard = document.getElementById("leaderboard");

const buyEggButton = document.getElementById("buy-egg");
const buyFoodButton = document.getElementById("buy-food");

// Инициализация табов
shopTab.addEventListener("click", () => showTab(shop));
questsTab.addEventListener("click", () => showTab(quests));
leaderboardTab.addEventListener("click", () => showTab(leaderboard));

// Обработчики кнопок магазина
buyEggButton.addEventListener("click", () => {
    if (coins >= 10) {
        coins -= 10;
        rarity = getRandomRarity();
        updateCoins();
        alert("Вы купили яйцо!");
    } else {
        alert("Недостаточно монет.");
    }
});

buyFoodButton.addEventListener("click", () => {
    if (coins >= 5) {
        coins -= 5;
        updateCoins();
        alert("Вы купили корм для питомца!");
    } else {
        alert("Недостаточно монет.");
    }
});

// Обработчик клика по яйцу
eggContainer.addEventListener("click", function() {
    swipeCount += 1;

    // Разбиение яйца
    if (swipeCount >= 10) {
        isCracked = true;
        petName = getRandomPetName();
        petImg = getRandomPetImage();
        updateEgg();
        updateCoins(10); // Получаем монеты за разбитое яйцо
        showTabs();
    } else {
        updateEgg();
    }
});

// Обновление изображения яйца и состояния
function updateEgg() {
    if (isCracked) {
        eggContainer.innerHTML = `<img src="${petImg}" class="egg" />`;
        instruction.classList.add("hidden-instruction");
    } else {
        eggContainer.innerHTML = `<img src="egg.png" class="egg" />`;
    }
}

// Обновление монет
function updateCoins(amount = 0) {
    coins += amount;
    document.getElementById("coins-display").textContent = `Монеты: ${coins}`;
}

// Получить случайное имя питомца
function getRandomPetName() {
    const petNames = ["Котик", "Собачка", "Попугай", "Кролик", "Черепаха"];
    return petNames[Math.floor(Math.random() * petNames.length)];
}

// Получить случайное изображение питомца
function getRandomPetImage() {
    const petImages = [
        "cat.png", "dog.png", "parrot.png", "rabbit.png", "turtle.png"
    ];
    return petImages[Math.floor(Math.random() * petImages.length)];
}

// Получить случайную редкость
function getRandomRarity() {
    const rarities = ["common", "uncommon", "rare", "legendary"];
    return rarities[Math.floor(Math.random() * rarities.length)];
}

// Отображение табов
function showTabs() {
    document.getElementById("tabs").style.display = "flex";
    showTab(shop);  // По умолчанию показываем магазин
}

// Показать конкретный таб
function showTab(tab) {
    [shop, quests, leaderboard].forEach(tab => tab.style.display = "none");
    tab.style.display = "block";
}
