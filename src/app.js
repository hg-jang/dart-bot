const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const messageApi = require('./lib/apis/message')
const util = require('./lib/utils/util')

/**
 * requirements
 */
dotenv.config();

const projectDir = path.resolve(__dirname + '/../')

console.log('*********************************')
console.log('*                               *')
console.log('*      Start Telegram Bot!      *')
console.log('*                               *')
console.log('*********************************')

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

/**
 * reply to /start
 * 채팅 첫 시작 시 인포 메시지 전송
 */
bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const message = messageApi.infoMessage();

  bot.sendMessage(chatId, message);
});

/**
 * reply to /info
 * 인포 메시지 전송
 */
bot.onText(/\/info/, (msg, match) => {
  const chatId = msg.chat.id;
  const message = messageApi.infoMessage();
  bot.sendMessage(chatId, message);
});

/**
 * reply to /help
 * 도움말 메시지 전송
 * - 각종 명령어들 설명
 */
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = messageApi.helpMessage();

  bot.sendMessage(chatId, message);
})

/**
 * reply to /subscribe
 */
bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;

  const subscribersCsv = util.csvFileToString('subscribers.csv')
  const subscribers = util.csvToJson(subscribersCsv)

  const exist = subscribers.find((subscriber) => subscriber.chatId === String(chatId))
  if(!exist) {
    subscribers.push({
      chatId: chatId,
    })
    const newSubscribers = util.jsonToCsv(subscribers)
    fs.writeFileSync(path.resolve(projectDir + '/src/data/subscribers.csv'), newSubscribers, { encoding: 'utf8' })

    bot.sendMessage(chatId, '구독을 시작합니다.')
  } else {
    bot.sendMessage(chatId, '이미 구독 중입니다.')
  }
})

/**
 * reply to /unsubscribe
 */
bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;

  const subscribersCsv = util.csvFileToString('subscribers.csv')
  if(!subscribersCsv) {
    return bot.sendMessage(chatId, 'Not Found: No Subscribers')
  }
  const subscribers = util.csvToJson(subscribersCsv)

  const exist = subscribers.find((subscriber) => subscriber.chatId === String(chatId))
  if(exist) {
    const newSubscribers = subscribers.filter((subscriber) => subscriber.chatId !== String(chatId))
    const csv = util.jsonToCsv(newSubscribers)
    fs.writeFileSync(path.resolve(projectDir + '/src/data/subscribers.csv'), csv, { encoding: 'utf8' })

    bot.sendMessage(chatId, '구동을 중지합니다.')
  } else {
    bot.sendMessage(chatId, '현재 구독중이지 않습니다.')
  }
})

/**
 * reply to /starred
 */
bot.onText(/\/starred/, (msg, match) => {
  const chatId = msg.chat.id;
  const message = messageApi.starredHelpMessage();

  if(match[0] !== match.input) { return }

  bot.sendMessage(chatId, message);
})


/**
 * reply to /starred (.+)
 */
bot.onText(/\/starred (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const options = match[1]

  console.log('+++ match', match)

  /**
   * 즐겨찾기 리스트 출력
   */
  if(options.includes('--ls')) {
    const starredCsv = util.csvFileToString(`/starred/${chatId}.csv`)
    /** 즐겨찾기 파일 없음 */
    if(!starredCsv) {
      return bot.sendMessage(chatId, '즐겨찾기 된 기업이 없습니다.')
    }
    const starred = util.csvToJson(starredCsv)
    /** 즐겨찾기 파일은 있으나 목록 없음 */
    if(
      starred.length === 0
      || (
        starred.length === 1 && !starred[0].corp_code
      )
    ) {
      return bot.sendMessage(chatId, '즐겨찾기 된 기업이 없습니다.')
    }

    /**
     * 즐겨찾기 목록 있음
     * 출력
     */
    const message = messageApi.starredListMessage(starred)
    return bot.sendMessage(chatId, message);
  }
  
  /**
   * 즐겨찾기 추가
   */
  if(options.includes('--add')) {
    /**
     * 기업명으로 추가
     */
    if(options.includes('-name')) {
      return bot.sendMessage(chatId, '기업명으로 추가')
    }

    /**
     * 기업코드로 추가
     */
    if(options.includes('-code')) {
      return bot.sendMessage(chatId, '기업코드로 추가')
    }
  }

  /**
   * 즐겨찾기 제거
   */
  if(options.includes('--rm')) {
    /**
     * 기업명으로 제거
     */
    if(options.includes('-name')) {
      return bot.sendMessage(chatId, '기업명으로 제거')
    }

    /**
     * 기업코드로 제거
     */
    if(options.includes('-code')) {
      return bot.sendMessage(chatId, '기업코드로 제거')
    }
  }

  bot.sendMessage(chatId, 'Not found: Invalid Options');
})

/**
 * reply to /starred --ls
 */
bot.onText(/\/starred (--ls)/, (msg) => {
  // const chatId = msg.chat.id;
  // const starredCsv = util.csvFileToString(`/starred/${chatId}.csv`)
  // if(!starredCsv) {
  //   return bot.sendMessage(chatId, '즐겨찾기 된 기업이 없습니다.')
  // }

  // const starred = util.csvToJson(starredCsv)
  // console.log(starred)

  // bot.sendMessage(chatId, '즐겨찾기 된 기업 목록입니다.')
})



bot.on('message', (msg) => {
  console.log('received message: ', msg.text)

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');
});