// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Настройка интерфейса Mini App
tg.setHeaderColor("#ffffff"); // Цвет заголовка
tg.setBackgroundColor("#f4f4f9"); // Цвет фона

// Инициализация состояния питомца
let petLevel = 0;
let actionCount = 0;

// Текущие состояния питомца
const PET_STATES = {
    0: "Яйцо 🥚",
    1: "Малыш 🐣",
    2: "Подросток 🐤",
    3: "Взрослый 🦆",
    4: "Чемпион 🦢"
};

// Обновление состояния питомца
function updatePetState() {
    document.getElementById("pet-state").textContent = `Текущий уровень: ${PET_STATES[petLevel]}`;
}

// Выполнение действия
document.getElementById("action-button").addEventListener("click", () => {
    actionCount++;
    document.getElementById("status").textContent = `Выполнено действий: ${actionCount}/3`;

    if (actionCount >= 3 && petLevel < 4) {
        petLevel++;
        actionCount = 0;
        updatePetState();
    }

    // Отправка данных в бот через Telegram WebApp API
    sendToBot();
});

// Отправка данных в бот
function sendToBot() {
    const data = {
        level: petLevel,
        actions: actionCount
    };

    // Используем Telegram WebApp API для отправки данных
    tg.sendData(JSON.stringify(data));
}

// Закрытие Mini App
document.getElementById("close-button").addEventListener("click", () => {
    tg.close();
});

// Инициализация при загрузке
updatePetState();
