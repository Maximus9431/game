class EggGame {
    constructor() {
      this.instruction = document.getElementById("instruction");
      this.eggContainer = document.getElementById("egg-container");
      this.petContainer = document.querySelector(".pet-container");
      this.shopContainer = document.getElementById("shop");
      this.questsContainer = document.getElementById("quests-list");
      this.leaderboardContainer = document.getElementById("leaderboard-list");
      this.tabs = document.querySelectorAll(".tab-button");
      this.tabContents = document.querySelectorAll(".tab-content");
  
      this.cracked = false;
      this.isMouseDown = false;
      this.swipeCount = 0;
      
      // Инициализируем квесты из localStorage или задаем дефолтные значения
      this.quests = JSON.parse(localStorage.getItem("quests")) || [
        { id: 1, title: "Разбей 3 яйца", required: 3, progress: 0, reward: 10, claimed: false },
        { id: 2, title: "Найди редкого питомца", required: 1, progress: 0, reward: 20, claimed: false },
        { id: 3, title: "Сделай 15 свайпов", required: 15, progress: 0, reward: 15, claimed: false }
      ];
      this.saveQuests();
  
      if (!window.Telegram?.WebApp) {
        alert("Эта игра работает только внутри Telegram Web App!");
        return;
      }
  
      this.init();
    }
  
    init() {
      this.loadRandomEgg();
      this.instruction.textContent = `Осталось движений: ${10 - this.swipeCount}`;
  
      document.addEventListener("touchstart", this.handleTouchStart.bind(this));
      document.addEventListener("touchend", this.handleTouchEnd.bind(this));
      document.addEventListener("mousedown", this.handleMouseDown.bind(this));
      document.addEventListener("mousemove", this.handleMouseMove.bind(this));
      document.addEventListener("mouseup", this.handleMouseUp.bind(this));
  
      this.loadTabs();
    }
  
    loadTabs() {
      // Скрываем вкладки до вылупления питомца
      this.tabs.forEach(tab => (tab.style.display = "none"));
  
      // После получения питомца вкладки становятся видимыми
    }
  
    showTabs() {
      this.tabs.forEach(tab => (tab.style.display = "inline-block"));
      // Автоматически активируем первую вкладку
      this.switchTab(this.tabs[0]);
      this.tabContents.forEach(content => content.style.display = "none");
      document.getElementById("shop").style.display = "block"; // первая вкладка - магазин
      // Загружаем содержимое вкладок
      this.loadShop();
      this.loadQuests();
      this.loadLeaderboard();
    }
  
    switchTab(tab) {
      this.tabs.forEach(t => t.classList.remove("active"));
      this.tabContents.forEach(content => (content.style.display = "none"));
  
      tab.classList.add("active");
      const contentId = tab.id.replace("-tab", "");
      document.getElementById(contentId).style.display = "block";
    }
  
    loadRandomEgg() {
      const eggCount = 5; // Количество PNG файлов в папке /eggs
      const randomIndex = Math.floor(Math.random() * eggCount) + 1;
  
      this.eggImage = document.createElement("img");
      this.eggImage.src = `eggs/egg${randomIndex}.png`;
      this.eggImage.id = "egg-image";
      this.eggImage.classList.add("egg");
      this.eggContainer.innerHTML = "";
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
  
      if (this.swipeCount >= 4) this.eggImage.classList.add("crack1");
      if (this.swipeCount >= 7) this.eggImage.classList.add("crack2");
      if (this.swipeCount >= 10) this.hatchEgg();
  
      // Обновляем прогресс квестов (например, повышаем счетчик свайпов)
      this.updateQuests("swipe", 1);
      this.sendTelegramData();
    }
  
    hatchEgg() {
      this.cracked = true;
      this.instruction.classList.add("hidden");
  
      setTimeout(() => {
        const pet = this.generateRandomPet();
        this.showPet(pet);
        this.showTabs();
        this.sendTelegramData(pet);
        // Обновляем квест "Разбей 3 яйца" и "Найди редкого питомца" - условно
        this.updateQuests("eggCracked", 1);
        this.saveQuests();
        this.loadQuests();
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
      this.eggContainer.classList.add("hidden");
      this.petContainer.innerHTML = `
        <img src="${pet.img}" class="pet">
        <div class="pet-name">Поздравляем! Это ${pet.name} 🐾</div>
        <div class="pet-rarity">Редкость: ${pet.rarity}</div>
      `;
      this.petContainer.classList.add("visible");
    }
  
    loadShop() {
      document.getElementById("buy-egg").addEventListener("click", () => {
        alert("Вы купили яйцо за 10 монет!");
        // Здесь можно добавить логику списания монет и получения бонуса
      });
  
      document.getElementById("buy-food").addEventListener("click", () => {
        alert("Вы купили корм за 5 монет!");
        // Здесь можно добавить логику улучшения питомца
      });
    }
  
    loadQuests() {
      this.questsContainer.innerHTML = "";
      this.quests.forEach(quest => {
        const questEl = document.createElement("div");
        questEl.classList.add("quest");
        questEl.innerHTML = `
          <strong>${quest.title}</strong><br>
          Прогресс: ${quest.progress}/${quest.required}<br>
          Награда: ${quest.reward} монет
        `;
        if (quest.progress >= quest.required && !quest.claimed) {
          const claimBtn = document.createElement("button");
          claimBtn.textContent = "Забрать награду";
          claimBtn.addEventListener("click", () => {
            quest.claimed = true;
            alert(`Награда ${quest.reward} монет получена!`);
            // Здесь можно добавить логику прибавления монет к балансу
            this.saveQuests();
            this.loadQuests();
          });
          questEl.appendChild(claimBtn);
        } else if (quest.claimed) {
          questEl.innerHTML += "<br><em>Награда получена</em>";
        }
        this.questsContainer.appendChild(questEl);
      });
      this.saveQuests();
    }
  
    // Функция обновления прогресса квестов по типу события
    updateQuests(eventType, amount) {
      this.quests.forEach(quest => {
        // Пример: если квест "Разбей 3 яйца" отслеживает событие "eggCracked"
        if (eventType === "eggCracked" && quest.id === 1) {
          quest.progress += amount;
        }
        // Если квест "Сделай 15 свайпов" отслеживает событие "swipe"
        if (eventType === "swipe" && quest.id === 3) {
          quest.progress += amount;
        }
        // Если квест "Найди редкого питомца" — можно обновлять при получении питомца с редкостью "Редкий" или "Легендарный"
        if (eventType === "eggCracked" && quest.id === 2) {
          // Допустим, если питомец редкий или легендарный, увеличиваем прогресс
          // (эту логику можно добавить в hatchEgg, если pet.rarity соответствует)
        }
      });
      this.saveQuests();
    }
  
    saveQuests() {
      localStorage.setItem("quests", JSON.stringify(this.quests));
    }
  
    loadLeaderboard() {
      // Пример статической таблицы лидеров
      const leaderboard = [
        { name: "Игрок 1", score: 100 },
        { name: "Игрок 2", score: 90 },
        { name: "Игрок 3", score: 80 }
      ];
      this.leaderboardContainer.innerHTML = "";
      leaderboard.forEach(entry => {
        const entryEl = document.createElement("div");
        entryEl.textContent = `${entry.name} — ${entry.score} очков`;
        this.leaderboardContainer.appendChild(entryEl);
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
  
  window.addEventListener("DOMContentLoaded", () => {
    const game = new EggGame();
  
    // Обработчики для переключения вкладок
    document.getElementById("shop-tab").addEventListener("click", () => {
      game.switchTab(document.getElementById("shop-tab"));
    });
    document.getElementById("quests-tab").addEventListener("click", () => {
      game.switchTab(document.getElementById("quests-tab"));
    });
    document.getElementById("leaderboard-tab").addEventListener("click", () => {
      game.switchTab(document.getElementById("leaderboard-tab"));
    });
  });
  