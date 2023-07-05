const dateUtil = require('../utils/date')

module.exports = {
  infoMessage: function() {
    const message = ''
      + '안녕하세요.\n'
      + '신규 공시정보를 받을 수 있는 oo-bot입니다.\n'
      + '특정 기업을 즐겨찾기하여 해당 기업의 신규 공시정보만을 받을 수 있습니다.\n'
      + '명령어로 구독을 시작할 수 있습니다.\n'
      + '채팅창에 /help 를 입력해보세요.'

    return message;
  },

  helpMessage: function() {
    const message = ''
      + '명령어 도움\n'
      + '/info - oo-bot에 대한 정보를 알려줍니다.\n'
      + '/help - 사용 가능한 명령어들을 출력합니다..\n'
      + '\n'
      + '[구독 관리]\n'
      + '/subscribe - 구독을 시작합니다. 즐겨찾기 한 기업들의 신규 공시정보를 받아 볼 수 있습니다. 즐겨찾기 한 기업이 없다면 모든 기업의 공시정보를 받습니다.\n'
      + '/unsubscribe - 구독을 중지합니다. 즐겨찾기 정보는 유지됩니다.\n'
      + '\n'
      + '[즐겨찾기 관리]\n'
      + '/starred - 즐겨찾기 관련 명령어를 출력합니다. 옵션을 추가할 수 있습니다.\n'

    return message
  },

  starredHelpMessage: function() {
    const message = ''
      + 'starred 명령어 도움\n'
      + '/starred --ls - 즐겨찾기 기업들을 출력합니다.\n'
      + '\n'
      + '[즐겨찾기 기업 추가]\n'
      + '/starred --add-name <기업명> - 기업명으로 즐겨찾기 기업을 추가합니다.\n'
      + '/starred --add-code <기업코드> - 기업코드로 즐겨찾기 기업을 추가합니다.\n'
      + '\n'
      + '[즐겨찾기 기업 삭제]\n'
      + '/starred --rm-name <기업명> - 기업명으로 즐겨찾기 기업을 삭제합니다.\n'
      + '/starred --rm-code <기업코드> - 기업코드로 즐겨찾기 기업을 삭제합니다.\n'
      + '/starred --rm-all - 모든 즐겨찾기 기업을 삭제합니다.\n'

    return message
  },

  /**
   * 즐겨찾기 기업 목록 출력
   * @param {any[]} starred 
   */
  starredListMessage: function(starred) {
    const message = ''
      + '즐겨찾기 된 기업 목록\n'
      + starred.map((star, index) =>  `${index + 1}. [${star.corp_name}] ${star.corp_code}`).join('\n')

    return message
  },

  /**
   * 공시정보 전송
   * @param {import('../types/type').PublicNotice} publicNotice
   */
  sendPublicNoticeInfo: function(publicNotice) {
    const date = dateUtil.getFullDateString()
    const message = ''
      + date + '\n'
      + `기업명: ${publicNotice.corp_name}\n`
      + `보고서명: ${publicNotice.report_nm}\n`
      + `접수일자: ${publicNotice.rcept_dt}\n`
      + `제출인명: ${publicNotice.flr_nm}\n`
      + '\n'
      + `공시링크: https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${publicNotice.rcept_no}\n`

    return message
  }
}