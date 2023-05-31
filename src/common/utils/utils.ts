import { v4 } from "uuid";
import { QueryCommonDto } from "../dto/QueryCommon.dto";
const _ = require("lodash");

export const generateRandomCode = (): string => {
  const now = new Date();
  const randomCode = v4().split("-")[0];

  return `${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}${randomCode}`;
};

export const parseSkip = (page: number = 1, perPage: number = 20) => {
  return ((page >= 1 ? page : 1) - 1) * perPage;
};

export const parseFilter = (filter: any, keys: any = []) => {
  try {
    filter = typeof filter === "object" ? filter : JSON.parse(filter);
    keys = typeof filter === "object" ? Object.keys(filter) : [];
    filter = _.pick(filter, keys);
    // filter = _.pickBy(filter, _.identity);

    return filter;
  } catch (error) {
    return {};
  }
};

export const parseOrder = (order) => {
  return typeof order === "object" ? order : JSON.parse(order);
};

export const parseQuery = (query: QueryCommonDto<any>) => {
  return {
    filter: parseFilter(query.filter || {}),
    filterOptions: parseFilter(query.filterOptions || {}),
    order: parseOrder(query.order || {}),
    page: Number(query.page || 1),
    perPage: Number(query.perPage || 20),
  };
};

export const addWhere = (
  query: any,
  filter: any = {},
  relativeFields: string[] = []
): any => {
  Object.keys(filter).forEach((entity) => {
    Object.keys(filter[entity]).map((field) => {
      if (relativeFields.indexOf(`${entity}.${field}`) > -1) {
        const condition = `ilike '%' || :value || '%'`;
        query.andWhere(`unaccent(${entity}.${field}) ${condition}`, {
          value: removeWhiteSpace(
            toNonAccentVietnamese(filter[entity][field].toLowerCase())
          ),
        });
      } else {
        const value =
          typeof filter[entity][field] === "string"
            ? `'${filter[entity][field]}'`
            : `${filter[entity][field]}`;
        query.andWhere(`${entity}.${field} = ${value}`);
      }
    });
  });

  return query;
};

export const removeWhiteSpace = (str: string) => {
  return str.replace(/(\s\s\s*)/g, " ").trim();
  // return str.replace(/(\s{2,})/gmi, " ");
};

export function toNonAccentVietnamese(str) {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export const addOrderBy = (query: any, orders: any = []) => {
  Object.keys(orders).map((alias) => {
    Object.keys(orders[alias]).map((field) => {
      // console.log(orders[alias]);
      query.orderBy(`${alias}.${field}`, orders[alias][field]);
    });
  });

  return query;
};

export function PromiseSetTimeout(timeout, callback) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Promise timed out after ${timeout} ms`));
    }, timeout);
    callback(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export const generateLink = ({ host, role, entity, id }: any) => {
  let link = `${host}/${role}/${entity}/${id}`;
  if (role) {
    link += `${role}/`;
  }
  if (entity) {
    link += `${entity}/`;
  }
  if (id) {
    link += `${id}/`;
  }

  return link;
};
export const generateEmailTemplate = ({
  host,
  role,
  entity,
  id,
  content,
  buttonText,
}: any) => {
  const link = generateLink({
    host,
    role,
    entity,
    id,
  });

  const htmlTemplate = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml>  <o:OfficeDocumentSettings>    <o:AllowPNG/>    <o:PixelsPerInch>96</o:PixelsPerInch>  </o:OfficeDocumentSettings></xml><![endif]-->  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  <meta name="viewport" content="width=device-width, initial-scale=1.0">  <meta name="x-apple-disable-message-reformatting">  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->  <title></title>      <style type="text/css">      @media only screen and (min-width: 620px) {  .u-row {    width: 600px !important;  }  .u-row .u-col {    vertical-align: top;  }  .u-row .u-col-100 {    width: 600px !important;  }}@media (max-width: 620px) {  .u-row-container {    max-width: 100% !important;    padding-left: 0px !important;    padding-right: 0px !important;  }  .u-row .u-col {    min-width: 320px !important;    max-width: 100% !important;    display: block !important;  }  .u-row {    width: 100% !important;  }  .u-col {    width: 100% !important;  }  .u-col > div {    margin: 0 auto;  }}body {  margin: 0;  padding: 0;}table,tr,td {  vertical-align: top;  border-collapse: collapse;}p {  margin: 0;}.ie-container table,.mso-container table {  table-layout: fixed;}* {  line-height: inherit;}a[x-apple-data-detectors='true'] {  color: inherit !important;  text-decoration: none !important;}table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 87% !important; } #u_content_heading_1 .v-container-padding-padding { padding: 40px 10px 0px !important; } #u_content_text_2 .v-container-padding-padding { padding: 5px 10px 10px !important; } #u_content_text_deprecated_1 .v-container-padding-padding { padding: 40px 10px 10px !important; } }    </style>    <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]--></head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ecf0f1;color: #000000">  <!--[if IE]><div class="ie-container"><![endif]-->  <!--[if mso]><div class="mso-container"><![endif]-->  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ecf0f1;width:100%" cellpadding="0" cellspacing="0">  <tbody>  <tr style="vertical-align: top">    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ecf0f1;"><![endif]-->    <div class="u-row-container" style="padding: 0px;background-color: transparent">  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->      <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->  <table id="u_content_image_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">  <tbody>    <tr>      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:60px 0px 0px;font-family:'Raleway',sans-serif;" align="left">        <table width="100%" cellpadding="0" cellspacing="0" border="0">  <tr>    <td style="padding-right: 0px;padding-left: 0px;" align="center">          </td>  </tr></table>      </td>    </tr>  </tbody></table><table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">  <tbody>    <tr>      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Raleway',sans-serif;" align="left">          <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;border-top: 3px solid #ecf0f1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">    <tbody>      <tr style="vertical-align: top">        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">          <span>&#160;</span>        </td>      </tr>    </tbody>  </table>      </td>    </tr>  </tbody></table>  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->  </div></div><!--[if (mso)|(IE)]></td><![endif]-->      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->    </div>  </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent">  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->      <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">  <div style="background-color: #ffffff;height: 100%;width: 100% !important;">  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->  <table id="u_content_heading_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">  <tbody>    <tr>      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 5px;font-family:'Raleway',sans-serif;" align="left">          <h1 style="margin: 0px; color: #f35900; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Playfair Display',serif; font-size: 26px; font-weight: 400;"><strong>edu-microservice.site</strong></h1>      </td>    </tr>  </tbody></table><table id="u_content_text_2" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">  <tbody>    <tr>      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 50px 10px;font-family:'Raleway',sans-serif;" align="left">          <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">    <p style="line-height: 140%;">${content}</p>  </div>      </td>    </tr>  </tbody></table><table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">  <tbody>    <tr>      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:'Raleway',sans-serif;" align="left">          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]--><div align="center">  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.unlayer.com" style="height:37px; v-text-anchor:middle; width:162px;" arcsize="11%"  stroke="f" fillcolor="#f35900"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Raleway',sans-serif;"><![endif]-->      <a href="${link}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:'Raleway',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #f35900; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word;font-size: 14px;">      <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">${buttonText}</span></span>    </a>  <!--[if mso]></center></v:roundrect><![endif]--></div>      </td>    </tr>  </tbody></table>  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->  </div></div><!--[if (mso)|(IE)]></td><![endif]-->      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->    </div>  </div></div><div class="u-row-container" style="padding: 0px;background-color: transparent">  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->      <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->  <table id="u_content_text_deprecated_1" style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">  <tbody>    <tr>      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:40px 80px 10px;font-family:'Raleway',sans-serif;" align="left">          <div style="line-height: 160%; text-align: center; word-wrap: break-word;">    <p style="font-size: 14px; line-height: 160%;">if you have any questions, please email us at edu.microservice@gmail.com. They can answer questions about your account. </p>  </div>      </td>    </tr>  </tbody></table><table style="font-family:'Raleway',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">  <tbody>    <tr>      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 0px;font-family:'Raleway',sans-serif;" align="left">          <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">    <tbody>      <tr style="vertical-align: top">        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">          <span>&#160;</span>        </td>      </tr>    </tbody>  </table>      </td>    </tr>  </tbody></table>  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->  </div></div><!--[if (mso)|(IE)]></td><![endif]-->      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->    </div>  </div></div>    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->    </td>  </tr>  </tbody>  </table>  <!--[if mso]></div><![endif]-->  <!--[if IE]></div><![endif]--></body></html>`;

  return htmlTemplate;
};
