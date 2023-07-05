
/**
 * 고유번호(corp_code)가 담겨있는 XML 파일(.zip)을 다운로드 받아서 src/data/CORPCODE.xml 생성.
 */
(async function () {
  const axios = require('axios');
  const path = require('path');
  const fs = require('fs');
  const decompress = require("decompress");
  require('dotenv').config();

  console.log('*********************************')
  console.log('*                               *')
  console.log('*     Generate CORPCODE.xml     *')
  console.log('*                               *')
  console.log('*********************************')

  const apiKey = process.env.DART_API_KEY;
  if(!apiKey) {
    throw new Error('[Error] Not Found: DART API KEY!!')
  }

  try {
    // download corpCode.zip
    const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${apiKey}`
    const options = {
      responseType: 'arraybuffer',
    }
    const res = await axios.get(url, options)
    const outputFile = path.resolve(__dirname, '../data/corpCode.zip')

    fs.writeFileSync(outputFile, res.data);
  
    // unzip corpCode.zip to CORPCODE.xml
    const files = await decompress(outputFile, 'src/data')
    console.log('[INFO] Success download ', files[0].path);
  } catch(e) {
    console.log(e)
  }
})();
