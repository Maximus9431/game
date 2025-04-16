from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

# База данных для хранения состояний питомцев
pets_db = {}

# Команда /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if user_id not in pets_db:
        pets_db[user_id] = {"level": 0, "action_count": 0}
    
    await update.message.reply_text(
        f"Привет! Получи своего питомца в виде яйца 🥚.\n"
        f"Чтобы начать игру, нажми кнопку ниже!!",
        reply_markup={
            "inline_keyboard": [[{"text": "Открыть игру", "web_app": {"url": "https://github.com/Maximus9431/game.git"}}]]
        }
    )

# Обработка данных от Mini App
async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    data = update.message.web_app_data.data
    parsed_data = json.loads(data)

    # Обновляем состояние питомца
    pets_db[user_id]["level"] = parsed_data["level"]
    pets_db[user_id]["action_count"] = parsed_data["actions"]

    await update.message.reply_text(f"Данные получены! Текущий уровень: {parsed_data['level']}")

# Основная функция
def main():
    token = "8135031305:AAHNRm3-PuG10Prai4z-dYV8N3FzElohCEA"
    application = Application.builder().token(token).build()
    
    # Регистрация обработчиков
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    
    # Запуск бота
    application.run_polling()

if __name__ == "__main__":
    main()