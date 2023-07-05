const dayMap = {
  1: '월요일',
  2: '화요일',
  3: '수요일',
  4: '목요일',
  5: '금요일',
  6: '토요일',
  7: '일요일',
}

module.exports = {
  /**
   * Date 객체를 받아 YYYYMMDD 형식의 문자열로 변환
   * @param {Date} [date] Date 객체
   * @returns {string} YYYYMMDD
   */
  getYYYYMMDD: function(date = new Date()) {
    const YYYY = date.getFullYear();
    const MM = date.getMonth() + 1;
    const DD = date.getDate();
  
    return `${YYYY}${MM < 10 ? '0' + MM : MM}${DD < 10 ? '0' + DD : DD}`;
  },

  /**
   * 어제 날짜의 YYYYMMDD 문자열 반환
   * @returns {string} YYYYMMDD
   */
  getYesterdayYYYYMMDD: function() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().slice(0, 10).replace(/-/g, '');
  },

  /**
   * Date 객체를 받아 YYYY-MM-DD 요일 HH:mm:ss 형식의 문자열로 변환
   * @param {Date} date Date 객체
   * @returns {string}
   */
  getFullDateString: function(date = new Date()) {
    const YYYY = date.getFullYear();
    const MM = date.getMonth() + 1;
    const DD = date.getDate();
    const day = date.getDay();
    const HH = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();

    return `${YYYY}-${MM < 10 ? '0' + MM : MM}-${DD < 10 ? '0' + DD : DD} ${dayMap[day]} ${HH < 10 ? '0' + HH : HH}:${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}`;
  },
}