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

        this.egg.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.egg.addEventListener('touchend', this.handleTouchEnd.bind(this));

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
        const index = Math.floor(Math.random() * 50 + 1);
        return {
            name: `Питомец ${index}`,
            img: `pets/pet${index}.png`
        };
    }

    showPet(pet) {
        this.petContainer.innerHTML = `
            <img src="${pet.img}" class="pet">
            <div class="pet-name">Поздравляем! Это ${pet.name} 🐾</div>
        `;
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
}

window.addEventListener('DOMContentLoaded', () => new EggGame());
