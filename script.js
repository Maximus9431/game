class EggGame {
    constructor() {
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

        // Инициализация Three.js
        this.initThreeJS();

        this.init();
    }

    initThreeJS() {
        const container = document.getElementById('egg-container');

        // Создаем сцену, камеру и рендерер
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(200, 200); // Размер контейнера
        container.appendChild(this.renderer.domElement);

        // Освещение
        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);

        // Камера
        this.camera.position.z = 5;

        // Загрузка модели
        const loader = new THREE.OBJLoader();
        loader.load(
            'models/egg_3d.obj', // Путь к .obj файлу
            (object) => {
                object.scale.set(0.5, 0.5, 0.5); // Уменьшаем размер модели
                object.position.y = -1; // Поднимаем модель немного вверх
                this.scene.add(object);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% загружено...');
            },
            (error) => {
                console.error('Ошибка при загрузке модели:', error);
            }
        );

        // Анимация
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Вращение модели
        if (this.scene.children.length > 0) {
            this.scene.children[0].rotation.x += 0.01;
            this.scene.children[0].rotation.y += 0.01;
        }

        this.renderer.render(this.scene, this.camera);
    }

    init() {
        // Отображаем текущее состояние яйца
        if (this.swipeCount >= 4) this.scene.children[0]?.classList.add('crack1');
        if (this.swipeCount >= 7) this.scene.children[0]?.classList.add('crack2');
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

        if (this.swipeCount >= 4) this.scene.children[0]?.classList.add('crack1');
        if (this.swipeCount >= 7) this.scene.children[0]?.classList.add('crack2');
        if (this.swipeCount >= 10) this.hatchEgg();

        // Отправляем данные в бота
        this.sendTelegramData();
    }

    hatchEgg() {
        this.cracked = true;
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