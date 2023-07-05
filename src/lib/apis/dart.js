const fs = require('fs')
const axios = require('axios')
const xmlParser = require('xml2json');

const dateUtil = require('../utils/date');

require('dotenv').config();

module.exports = {
  /**
   * 정식명칭(corp_name)으로 종목 정보(고유번호, 종목명, 종목코드, 최종변경일자) 가져오기
   * @param {string} corp_name 정식명칭(기업명, 종목명)
   * @returns {import('../types/type').Corp} 종목정보
   */
  getCorp: function(corp_name) {
    const corpCodeXML = fs.readFileSync('src/data/CORPCODE.xml')
    const corpCodeJSON = /** @type {CorpCodeXML} */ (xmlParser.toJson(corpCodeXML, { object: true }));
  
    const corps = corpCodeJSON.result.list;
    const corp = corps.find((corpCode) => corpCode.corp_name === corp_name);
    if(!corp) {
      throw new Error('Not Found:', corp_name)
    }
  
    return corp;
  },

  /**
   * 고유번호(corp_code)로 공시정보 가져오기
   * @param {string} [corp_code] 고유번호
   * @returns {Promise<import('../types/type').PublicNotice[]>}
   */
  getPublicNotice: async function(corp_code) {
    /** @type {import('../types/type').PublicNotice[]} */
    let result = []
    let page = 1

    const apiKey = process.env.DART_API_KEY;
    const url = 'https://opendart.fss.or.kr/api/list.json'

    while(true) {
      const options = {
        params: {
          crtfc_key: apiKey,
          corp_code: corp_code,
          bgn_de: dateUtil.getYYYYMMDD(),
          end_de: dateUtil.getYYYYMMDD(),
          page_no: page,
          page_count: 100, // max: 100
        }
      }
      const res = await axios.get(url, options)
    
      result.push(...res.data.list)

      if(page === res.data.total_page) { break; }
      else { page++ }
    }

    return result;
  }
}