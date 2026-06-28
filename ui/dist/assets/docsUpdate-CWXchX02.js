import{t as e}from"./expandInfo-DFIAbt2n.js";import{t as n}from"./fieldsInfo-e84Zd23v.js";import{fullDummyPayload as r,primitivesDummyPayload as i,replaceDummyPayloadPlaceholder as a}from"./docsCreate-Buosp1x9.js";function o(o){let s=app.utils.getApiExampleURL(),c=o.updateRule===null,l=o.type===`auth`?[`id`,`password`,`verified`,`email`,`emailVisibility`]:[`id`],u=o.fields?.filter(e=>!e.hidden&&e.type!=`autodate`&&!l.includes(e.name))||[],d={collectionId:o.id,collectionName:o.name},f=[{title:200,value:JSON.stringify(Object.assign(d,app.utils.getDummyFieldsData(o)),null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "创建记录失败。",
                  "data": {
                    "${u.find(e=>!e.primaryKey)?.name||`someField`}": {
                      "code": "validation_required",
                      "message": "缺少必需的值。"
                    }
                  }
                }
            `}];return c&&f.push({title:403,value:`
                {
                  "status": 403,
                  "message": "只有超级用户才能执行此操作。",
                  "data": {}
                }
            `}),f.push({title:404,value:`
            {
              "status": 404,
              "message": "未找到请求的资源。",
              "data": {}
            }
        `}),t.div({pbEvent:`apiPreviewUpdate`,className:`content`},t.p(null,`Updates an existing ${o.name} record.`),t.p(null,`请求体参数可以以`,t.code(null,`application/json`),` or `,t.code(null,`multipart/form-data`),`.`),t.p(null,`文件上传仅支持通过`,t.code(null,`multipart/form-data`),`. For more info and examples you could check the detailed `,t.a({href:`https://pocketbase.io/docs/files-handling`,target:`_blank`,rel:`noopener noreferrer`,textContent:`文件上传和处理文档`}),`.`),t.p(null,t.em(null,`请注意，如果密码发生更改，当前记录之前发出的所有令牌将自动失效，如果您希望用户保持登录状态，需要在更新调用后手动重新认证。`)),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
import PocketBase from 'pocketbase';

const pb = new PocketBase('${s}');

...

// example update body
const body = ${a(JSON.stringify(r(o,!0),null,2))};

const record = await pb.collection('${o.name}').update('RECORD_ID', body);
`,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`JS SDK 文档`}))},{title:`Dart SDK`,language:`dart`,value:`
import 'package:pocketbase/pocketbase.dart';

final pb = PocketBase('${s}');

...

// example update body
final body = <String, dynamic>${JSON.stringify(i(o,!0),null,2)};

final record = await pb.collection('${o.name}').update(
  'RECORD_ID',
  body: body,
  files: [],
);
`,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`Dart SDK 文档`}))},{title:`curl`,language:`bash`,value:`
                        curl -X PATCH \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ ... }' \\
                          '${s}/api/collections/${o.name}/records/RECORD_ID'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,`API详情`)),t.div({className:`alert warning api-preview-alert`},t.span({className:`label method`},`PATCH`),t.span({className:`path`},`/api/collections/${o.name}/records/`,t.strong(null,`:id`)),()=>{if(c)return t.small({className:`extra`},`需要超级用户 Authorization:TOKEN 头`)}),t.table({className:`api-preview-table path-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`Path params`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`id`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`要更新的记录ID。`)))),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`?查询参数`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,e())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,n())))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,`示例响应`)),app.components.codeBlockTabs({tabs:f}))}export{o as docsUpdate};