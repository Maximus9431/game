class EggGame {
    constructor() {
        this.egg = document.getElementById('egg');
        this.instruction = document.getElementById('instruction');
        this.container = document.querySelector('.container');
        this.petContainer = document.querySelector('.pet-container');
        this.swipeCount = 0;
        this.cracked = false;

        this.init();
    }

    init() {
        const eggColors = ['blue', 'green', 'red', 'pink', 'yellow'];
        this.egg.src = `eggs/${eggColors[Math.floor(Math.random() * eggColors.length)]}.png`;

        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));


        document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        if (this.cracked) return;

        const endX = e.changedTouches[0].clientX;
        const distance = endX - this.startX;

        if (Math.abs(distance) > 30) {
            this.swipeCount++;
            this.updateGameState();
        }
    }

    updateGameState() {
        this.instruction.textContent = `Осталось движений: ${10 - this.swipeCount}`;
        this.egg.classList.add('swipe-hit');
        setTimeout(() => this.egg.classList.remove('swipe-hit'), 300);

        if (this.swipeCount >= 4) this.egg.classList.add('crack1');
        if (this.swipeCount >= 7) this.egg.classList.add('crack2');
        if (this.swipeCount >= 10) this.hatchEgg();
    }

    hatchEgg() {
        this.cracked = true;
        this.egg.classList.add('cracked', 'hidden');

        setTimeout(() => {
            const pet = this.generateRandomPet();
            this.showPet(pet);
            this.sendTelegramData(pet);
        }, 800);
    }

    generateRandomPet() {
        const index = Math.floor(Math.random() * 19) + 1; // От 1 до 19
        const uniqueNames = [
            "Барсик", "Мурзик", "Шарик", "Снежок", "Рыжик",
            "Звёздочка", "Пушистик", "Лунтик", "Спарки", "Тучка",
            "Комета", "Бусинка", "Вулкан", "Марсик", "Симба",
            "Тигра", "Персик", "Облачко", "Феникс"
        ];
        return {
            name: uniqueNames[index - 1], // Индексы 0-18 для 19 имен
            img: `pets/pet${index}.png`
        };
    }

    hatchEgg() {
        this.cracked = true;
        this.egg.classList.add('cracked', 'hidden');
        this.container.classList.add('hidden'); // Скрываем контейнер с яйцом
        
        setTimeout(() => {
            const pet = this.generateRandomPet();
            this.showPet(pet);
            this.sendTelegramData(pet);
        }, 800);
    }

    showPet(pet) {
        this.petContainer.innerHTML = `
            <img src="${pet.img}" class="pet">
            <div class="pet-name">Поздравляем! Это ${pet.name} 🐾</div>
        `;
        this.petContainer.classList.remove('hidden'); // Показываем контейнер
    }
}

    sendTelegramData(pet) {
        try {
            if (window.Telegram?.WebApp?.sendData) {
                window.Telegram.WebApp.sendData(JSON.stringify({
                    level: 1,
                    actions: this.swipeCount,
                    pet: pet.name
                }));
            }
        } catch (e) {
            console.error("Ошибка отправки данных:", e);
        }
    }

window.addEventListener('DOMContentLoaded', () => new EggGame());
