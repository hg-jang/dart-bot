const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs')

const dartApi = require('../lib/apis/dart')
const messageApi = require('../lib/apis/message')
const util = require('../lib/utils/util')
const dateUtil = require('../lib/utils/date');

require('dotenv').config()

const token = process.env.TELEGRAM_BOT_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const projectDir = path.resolve(__dirname + '/../../')

/**
 * 주기 = 5s
 */
// const INTERVAL = 1000 * 60 * 5;
const INTERVAL = 1000 * 20;

/**
 * src/data에 오늘 날짜의 YYYYMMDD.js
 * 파일이 있는지 확인.
 * 없다면 생성하고 어제 날짜의 YYYYMMDD.js 파일은 삭제
 */
try {
  fs.readFileSync(path.resolve(__dirname + '/../data/' + `${dateUtil.getYYYYMMDD()}.csv`), { encoding: 'utf8' })
} catch(e) {
  // 오늘꺼 생성
  const content = 'corp_code,rcept_no\n'
  fs.writeFileSync(path.resolve(__dirname + '/../data/' + `${dateUtil.getYYYYMMDD()}.csv`), content, { encoding: 'utf8' });
  
  // 어제꺼 삭제
  try {
    fs.unlinkSync(__dirname + '/../data/' + `${dateUtil.getYesterdayYYYYMMDD()}.csv`);
  } catch(e) {
    console.log('Not Found: Yesterday\'s csv file - ', `${dateUtil.getYesterdayYYYYMMDD()}.csv`)
  }
}

/**
 * main task
 */
async function task() {
  /** 초기화 */
  /**
   * 즐겨찾기 된 종목 가져오기
   */
  /** @type {string} */ let starredCsv
  /** @type {import('../lib/types/type').StarredCorp[]} */ let starred
  try {
    starredCsv = util.csvFileToString('starred.csv')
    starred = util.csvToJson(starredCsv)
  } catch(e) {
    starred = []
  }

  /**
   * YYYYMMDD.csv에서 이미 공지한 고시정보 가져오기
   */
  const noticedCsv = util.csvFileToString(`${dateUtil.getYYYYMMDD()}.csv`)
  const noticed = /** @type {import('../lib/types/type').AlreadyNoticed[]} */ (util.csvToJson(noticedCsv))
  /**
   * 새롭게 공지할 공시정보들
   */
  let unNoticed = []
  /**
   * subscribers(구독자들)
   */
  const subscribersCsv = util.csvFileToString('subscribers.csv')
  const subscribers = /** @type {{ chatId: string }[]} */ (util.csvToJson(subscribersCsv))

  /**
   * 즐겨찾기 된 종목이 있다면
   */
  if(starred.length !== 0) {
    /**
       * 즐겨찾기 된 각 종목마다 공시정보 가져오기
       * 이미 공지된 공시정보는 제외하고
       * 새로운 공시정보만 unNoticed에 추가
       */
    Promise.all(
      starred.map(async (corp) => {
        /**
         * 고시정보 가져오기
         */
        const publicNotices = await dartApi.getPublicNotice(corp.corp_code)

        publicNotices.map((publicNotice) => {
          const isNoticed = noticed.find((notice) => notice.rcept_no === publicNotice.rcept_no)
          if(isNoticed) {
            return
          } else {
            unNoticed.push({
              corp_name: publicNotice.corp_name,
              corp_code: publicNotice.corp_code,
              corp_cls: publicNotice.corp_cls,
              stock_code: publicNotice.stock_code,
              report_nm: publicNotice.report_nm,
              rcept_no: publicNotice.rcept_no,
              flr_nm: publicNotice.flr_nm,
            })
          }
        })
      })
    )
    .then(() => {
      /**
       * 텔레그램 봇으로 새로운 공시정보 쏴주고
       * YYYYMMDD.csv에 공지한 공시정보 추가
       */
      // subscribers.map((subscriber) => {
      //   bot.sendMessage(Number(subscriber.chatId), 'Hello')
      // })

      // YYYYMMDD.csv에 공지한 공시정보 추가

    })
  } else {
    /** 즐겨찾기 된 종목 없을 때 */
    const publicNotices = await dartApi.getPublicNotice()

    // 새로운 공시정보만 unNoticed에 추가
    publicNotices.map((publicNotice) => {
      const isNoticed = noticed.find((notice) => notice.rcept_no === publicNotice.rcept_no)
      if(isNoticed) {
        return
      } else {
        unNoticed.push({
          corp_name: publicNotice.corp_name,
          corp_code: publicNotice.corp_code,
          corp_cls: publicNotice.corp_cls,
          stock_code: publicNotice.stock_code,
          report_nm: publicNotice.report_nm,
          rcept_no: publicNotice.rcept_no,
          rcept_dt: publicNotice.rcept_dt,
          flr_nm: publicNotice.flr_nm,
        })
      }
    })

    subscribers.map((subscriber) => {
      unNoticed.map((notice) => {
        bot.sendMessage(Number(subscriber.chatId), messageApi.sendPublicNoticeInfo(notice))
          .then((res) => {})
          .catch((e) => {
            console.log('Telegram Bot Error: ', e.message)
          })

        noticed.push({
          corp_code: notice.corp_code,
          rcept_no: notice.rcept_no
        })
      })
    })

    const noticedCsv = util.jsonToCsv(noticed)
    fs.writeFileSync(path.resolve(projectDir + '/src/data/' + `${dateUtil.getYYYYMMDD()}.csv`), noticedCsv, { encoding: 'utf8' });
  }
  
}

task()
setInterval(() => {
  console.log('task')
  task()
}, INTERVAL);