import { parseString } from 'xml2js';

export default function useParser() {
  const xmlToJson = (xml: string) => {
    try {
      if (xml) parseString(xml, { explicitArray: false }, function (error, result) {
          console.info(result)
          console.error(error)
        });
    } catch {}
  }


  return {
    xmlToJson
  }
}