/**
 * ZIP - XML - JSON으로 파싱된 고유번호 데이터
 * @typedef {Object} CorpCodeXML
 * @property {Corps} result
 */
/**
 * @typedef {Object} Corps
 * @property {Corp[]} list
 */
/**
 * 각 종목 인스턴스
 * @typedef {Object} Corp
 * @property {string} corp_code 고유번호(8자리)
 * @property {string} corp_name 종목명 - 정식회사명칭
 * @property {string} stock_code 종목코드 - 상장회사인 경우 주식의 종목코드(6자리)
 * @property {string} modify_date 최종변경일자 - 기업개황정보 최종변경일자(YYYYMMDD)
 */

/**
 * 즐겨찾기 한 종목
 * @typedef {Object} StarredCorp
 * @property {string} corp_name 종목명 - 정식회사명칭
 * @property {string} corp_code 고유번호(8자리)
 */

/**
 * 이미 공지한 고시정보 목록
 * @typedef {Object} AlreadyNoticed
 * @property {string} corp_code 고유번호(8자리)
 * @property {string} rcept_no 접수번호
 */

/**
 * 공시정보
 * @typedef {Object} PublicNotice
 * @property {string} corp_code 고유번호(8자리)
 * @property {string} corp_name 종목명 - 정식회사명칭
 * @property {string} stock_code 종목코드 - 상장회사인 경우 주식의 종목코드(6자리)
 * @property {'Y' | 'K' | 'N' | 'E'} corp_cls 법인구분 - Y(유가), K(코스닥), N(코넥스), E(기타)
 * @property {string} report_nm 보고서명
 * @property {string} rcept_no 접수번호
 * @property {string} flr_nm 공시 제출인명
 * @property {string} rcept_dt 접수일자(YYYYMMDD)
 * @property {string} rm 주석
 */

/**
 * 공시유형 Enum
 * @typedef {'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'} PublicType
 * 
 */

/**
 * 공시유형 Enum
 * @readonly
 * @enum {string}
 */
const PBLNTF_TYPE = {
    A: '정기공시',
    B: '주요사항보고',
    C: '발행공시',
    D: '지분공시',
    E: '기타공시',
    F: '외부감사관련',
    G: '펀드공시',
    H: '자산유동화',
    I: '거래소공시',
    J: '공정위공시',
};

export default class Type {}