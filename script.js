class EggGame {
    constructor() {
        this.instruction = document.getElementById('instruction');
        this.eggContainer = document.getElementById('egg-container');
        this.petContainer = document.querySelector('.pet-container');
        this.shopContainer = document.getElementById('shop');
        this.questsContainer = document.getElementById('quests-list');
        this.leaderboardContainer = document.getElementById('leaderboard-list');
        
        const params = new URLSearchParams(window.location.search);
        this.swipeCount = parseInt(params.get('swipe_count')) || 0;
        
        this.cracked = false;
        this.isMouseDown = false;

        if (!window.Telegram?.WebApp) {
            alert("Эта игра работает только внутри Telegram Web App!");
            return;
        }

        this.init();
    }

    init() {
        this.loadRandomEgg();
        this.instruction.textContent = `Осталось движений: ${10 - this.swipeCount}`;
        
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        
        this.loadShop();
        this.loadQuests();
        this.loadLeaderboard();
    }

    loadRandomEgg() {
        const eggCount = 5; // Количество PNG файлов в папке /eggs
        const randomIndex = Math.floor(Math.random() * eggCount) + 1;

        this.eggImage = document.createElement('img');
        this.eggImage.src = `eggs/egg${randomIndex}.png`;
        this.eggImage.id = 'egg-image';
        this.eggImage.classList.add('egg');
        this.eggContainer.innerHTML = '';
        this.eggContainer.appendChild(this.eggImage);
    }

    handleMouseDown(e) {
        this.isMouseDown = true;
        this.startX = e.clientX;
    }

    handleMouseMove(e) {
        if (!this.isMouseDown || this.cracked) return;

        const distance = e.clientX - this.startX;
        if (Math.abs(distance) > 30) {
            this.swipeCount++;
            this.updateGameState();
            this.startX = e.clientX;
        }
    }

    handleMouseUp() {
        this.isMouseDown = false;
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        if (this.cracked) return;

        const distance = e.changedTouches[0].clientX - this.startX;
        if (Math.abs(distance) > 30) {
            this.swipeCount++;
            this.updateGameState();
        }
    }

    updateGameState() {
        this.instruction.textContent = `Осталось движений: ${10 - this.swipeCount}`;

        if (this.swipeCount >= 4) this.eggImage.classList.add('crack1');
        if (this.swipeCount >= 7) this.eggImage.classList.add('crack2');
        if (this.swipeCount >= 10) this.hatchEgg();

        this.sendTelegramData();
    }

    hatchEgg() {
        this.cracked = true;
        this.instruction.classList.add('hidden');

        setTimeout(() => {
            const pet = this.generateRandomPet();
            this.showPet(pet);
            this.sendTelegramData(pet);
        }, 800);
    }

    generateRandomPet() {
        const pets = [
            { name: "Барсик", img: "https://maximus9431.github.io/game/pets/pet1.jpg", rarity: "Обычный" },
            { name: "Мурзик", img: "https://maximus9431.github.io/game/pets/pet2.jpg", rarity: "Обычный" },
            { name: "Шарик", img: "https://maximus9431.github.io/game/pets/pet3.jpg", rarity: "Необычный" },
            { name: "Снежок", img: "https://maximus9431.github.io/game/pets/pet4.jpg", rarity: "Необычный" },
            { name: "Рыжик", img: "https://maximus9431.github.io/game/pets/pet5.jpg", rarity: "Редкий" },
            { name: "Звёздочка", img: "https://maximus9431.github.io/game/pets/pet6.jpg", rarity: "Редкий" },
            { name: "Пушистик", img: "https://maximus9431.github.io/game/pets/pet7.jpg", rarity: "Легендарный" },
            { name: "Лунтик", img: "https://maximus9431.github.io/game/pets/pet8.jpg", rarity: "Легендарный" }
        ];

        const rarityWeights = {
            "Обычный": 0.6,
            "Необычный": 0.3,
            "Редкий": 0.09,
            "Легендарный": 0.01
        };

        const getRandomPet = () => {
            const random = Math.random();
            let cumulativeWeight = 0;

            for (const pet of pets) {
                cumulativeWeight += rarityWeights[pet.rarity];
                if (random <= cumulativeWeight) {
                    return pet;
                }
            }

            return pets[0];
        };

        return getRandomPet();
    }

    showPet(pet) {
        this.eggContainer.classList.add('hidden');
        this.petContainer.innerHTML = `
            <img src="${pet.img}" class="pet">
            <div class="pet-name">Поздравляем! Это ${pet.name} 🐾</div>
            <div class="pet-rarity">Редкость: ${pet.rarity}</div>
        `;
        this.petContainer.classList.add('visible');
    }

    loadShop() {
        // Загрузка магазина, например, для покупки яйца или корма
        document.getElementById('buy-egg').addEventListener('click', () => {
            alert("Вы купили яйцо!");
        });

        document.getElementById('buy-food').addEventListener('click', () => {
            alert("Вы купили корм!");
        });
    }

    loadQuests() {
        // Пример квестов
        const quests = [
            { description: "Прокачайте питомца до уровня 2", reward: 20 },
            { description: "Проведите 5 движений", reward: 10 },
        ];

        quests.forEach(quest => {
            const questItem = document.createElement('div');
            questItem.textContent = `${quest.description} — Награда: ${quest.reward} монет`;
            this.questsContainer.appendChild(questItem);
        });
    }

    loadLeaderboard() {
        // Пример таблицы лидеров
        const leaderboard = [
            { name: "Игрок 1", score: 100 },
            { name: "Игрок 2", score: 90 },
        ];

        leaderboard.forEach(entry => {
            const entryItem = document.createElement('div');
            entryItem.textContent = `${entry.name} — ${entry.score} очков`;
            this.leaderboardContainer.appendChild(entryItem);
        });
    }

    sendTelegramData(pet = null) {
        try {
            const data = {
                level: 1,
                actions: this.swipeCount,
                pet: pet?.name || null,
                img: pet?.img || null,
                rarity: pet?.rarity || null
            };

            if (window.Telegram?.WebApp?.sendData) {
                window.Telegram.WebApp.sendData(JSON.stringify(data));
            }
        } catch (e) {
            console.error("Ошибка отправки данных:", e);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new EggGame());
