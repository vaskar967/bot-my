const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
const token = '5691109988:AAEHkl9M2DEbltWhDwGMp3UD-TZyQG9wJyE'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!')
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветсвие' },
		{ command: '/info', description: 'Получить информацию о пользователе' },
		{ command: '/game', description: 'Игра угадай цифру' }
	])

	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id

		if (text === '/start') {
			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
			return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот автора vaskar967`)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
		}
		if (text === '/game') {
			return startGame(chatId)
		}
		return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!')
	})

	bot.on('callback_query', msg => {
		const data = msg.data
		const chatId = msg.message.chat.id
		if (data === '/again') {
			return startGame(chatId)
		}
		if (data === chats[chatId]) {
			return bot.sendMessage(chatId, `Поздравляю ты угадал цифру ${chats[chatId]}`, againOptions)
		} else {
			return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
		}
	})
}

start()