class EggGame {
    constructor() {
        this.instruction = document.getElementById('instruction');
        this.eggContainer = document.getElementById('egg-container');
        this.petContainer = document.querySelector('.pet-container');

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
        const uniqueNames = [
            "Барсик", "Мурзик", "Шарик", "Снежок", "Рыжик",
            "Звёздочка", "Пушистик", "Лунтик", "Спарки", "Тучка",
            "Комета", "Бусинка", "Вулкан", "Марсик", "Симба",
            "Тигра", "Персик", "Облачко", "Феникс"
        ];

        const index = Math.floor(Math.random() * uniqueNames.length);
        return {
            name: uniqueNames[index],
            img: `https://maximus9431.github.io/game/pets/pet${index + 1}.jpg`
        };
    }

    showPet(pet) {
        this.eggContainer.classList.add('hidden');
        this.petContainer.innerHTML = `
            <img src="${pet.img}" class="pet">
            <div class="pet-name">Поздравляем! Это ${pet.name} 🐾</div>
        `;
        this.petContainer.classList.add('visible');
    }

    sendTelegramData(pet = null) {
        try {
            const data = {
                level: 1,
                actions: this.swipeCount,
                pet: pet?.name || null,
                img: pet?.img || null
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
