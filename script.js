class EggGame {
    constructor() {
        this.egg = document.getElementById('egg');
        this.instruction = document.getElementById('instruction');
        this.petContainer = document.querySelector('.pet-container');

        // Получаем параметр swipe_count из URL
        const params = new URLSearchParams(window.location.search);
        this.swipeCount = parseInt(params.get('swipe_count')) || 0;

        this.cracked = false;
        this.isMouseDown = false;

        // Проверка, что игра запущена через Telegram Web App
        if (!window.Telegram?.WebApp) {
            alert("Эта игра работает только внутри Telegram Web App!");
            return;
        }

        this.init();
    }

    init() {
        // Устанавливаем 3D-изображение яйца
        this.egg.src = "eggs/egg_3d.png";

        // Отображаем текущее состояние яйца
        if (this.swipeCount >= 4) this.egg.classList.add('crack1');
        if (this.swipeCount >= 7) this.egg.classList.add('crack2');
        if (this.swipeCount >= 10) {
            this.hatchEgg();
            return;
        }

        this.instruction.textContent = `Осталось движений: ${10 - this.swipeCount}`;

        // Добавляем обработчики событий
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // Отключаем прокрутку страницы во время свайпа
        document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }

    handleMouseDown(e) {
        this.isMouseDown = true;
        this.startX = e.clientX;
    }

    handleMouseMove(e) {
        if (!this.isMouseDown || this.cracked) return;

        const currentX = e.clientX;
        const distance = currentX - this.startX;

        if (Math.abs(distance) > 30) {
            this.swipeCount++;
            this.updateGameState();
            this.startX = currentX;
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

        // Отправляем данные в бота
        this.sendTelegramData();
    }

    hatchEgg() {
        this.cracked = true;
        this.egg.classList.add('cracked', 'hidden');
        this.instruction.classList.add('hidden');

        setTimeout(() => {
            const pet = this.generateRandomPet();
            console.log("Сгенерирован питомец:", pet); // Логирование
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
        this.petContainer.innerHTML = `
            <img src="${pet.img}" class="pet">
            <div class="pet-name">Поздравляем! Это ${pet.name} 🐾</div>
        `;
        this.petContainer.classList.add('visible');
    }

    sendTelegramData(pet = null) {
        try {
            let data = {
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