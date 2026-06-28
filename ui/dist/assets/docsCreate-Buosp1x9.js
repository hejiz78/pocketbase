import{t as e}from"./expandInfo-DFIAbt2n.js";import{t as n}from"./fieldsInfo-e84Zd23v.js";function r(r){let s=app.utils.getApiExampleURL(),c=r.createRule===null,l=r.type===`auth`,u=l?[`password`,`verified`,`email`,`emailVisibility`]:[],d=r.fields?.filter(e=>!e.hidden&&e.type!=`autodate`&&!u.includes(e.name))||[],f={collectionId:r.id,collectionName:r.name},p=[{title:200,value:JSON.stringify(Object.assign(f,app.utils.getDummyFieldsData(r)),null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "创建记录失败。",
                  "data": {
                    "${l?`email`:d.find(e=>!e.primaryKey)?.name||`someField`}": {
                      "code": "validation_required",
                      "message": "缺少必需的值。"
                    }
                  }
                }
            `}];return c&&p.push({title:403,value:`
                {
                  "status": 403,
                  "message": "只有超级用户才能执行此操作。",
                  "data": {}
                }
            `}),t.div({pbEvent:`apiPreviewCreate`,className:`content`},t.p(null,`Creates a new ${r.name} record.`),t.p(null,`请求体参数可以以`,t.code(null,`application/json`),` or `,t.code(null,`multipart/form-data`),`.`),t.p(null,`文件上传仅支持通过`,t.code(null,`multipart/form-data`),`. For more info and examples you could check the detailed `,t.a({href:`https://pocketbase.io/docs/files-handling`,target:`_blank`,rel:`noopener noreferrer`,textContent:`文件上传和处理文档`}),`.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
import PocketBase from 'pocketbase';

const pb = new PocketBase('${s}');

...

// example create body
const body = ${i(JSON.stringify(a(r),null,2))};

const record = await pb.collection('${r.name}').create(body);
`+(l?`
// (optional) send an email verification request
await pb.collection('${r?.name}').requestVerification('test@example.com');
`:``),footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`JS SDK 文档`}))},{title:`Dart SDK`,language:`dart`,value:`
import 'package:pocketbase/pocketbase.dart';

final pb = PocketBase('${s}');

...

// example create body
final body = <String, dynamic>${JSON.stringify(o(r),null,2)};

final record = await pb.collection('${r.name}').create(body: body, files: []);
`+(l?`
// (optional) send an email verification request
await pb.collection('${r?.name}').requestVerification('test@example.com');
`:``),footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`Dart SDK 文档`}))},{title:`curl`,language:`bash`,value:`
                        curl -X POST \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ ... }' \\
                          '${s}/api/collections/${r.name}/records/RECORD_ID'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,`API详情`)),t.div({className:`alert success api-preview-alert`},t.span({className:`label method`},`POST`),t.span({className:`path`},`/api/collections/${r.name}/records`),()=>{if(c)return t.small({className:`extra`},`需要超级用户 Authorization:TOKEN 头`)}),t.table({className:`api-preview-table body-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`请求体参数`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,()=>{if(l)return[t.tr(null,t.th({colSpan:99},`认证特定字段`)),t.tr(null,t.td({className:`min-width`},`email `,()=>r.fields?.find(e=>e.name==`email`)?.required?t.em(null,`（必需）`):t.em(null,`（可选）`)),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`认证记录邮箱地址。`)),t.tr(null,t.td({className:`min-width`},`emailVisibility `,()=>r.fields?.find(e=>e.name==`emailVisibility`)?.required?t.em(null,`（必需）`):t.em(null,`（可选）`)),t.td({className:`min-width`},t.span({className:`label`},`布尔值`)),t.td(null,`获取记录数据时是否显示/隐藏认证记录邮箱。`,t.br(),`超级用户和记录所有者始终可以访问邮箱地址。`)),t.tr(null,t.td({className:`min-width`},`password `,t.em(null,`（必需）`)),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`认证记录密码。`)),t.tr(null,t.td({className:`min-width`},`passwordConfirm `,t.em(null,`（必需）`)),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`认证记录密码确认。`)),t.tr(null,t.td({className:`min-width`},`verified `,t.em(null,`（可选）`)),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,t.p(null,`指示该认证记录是否已验证。`),t.p(null,`此字段只能由超级用户或具有"管理"权限的认证记录设置。`))),t.tr(null,t.th({colSpan:99},`其他字段`))]},()=>d.map(e=>t.tr(null,t.td({className:`min-width`},e.name,t.em(null,e.required&&!e.autogeneratePattern?` (required)`:` (optional)`)),t.td({className:`min-width`},t.span({className:`label`},()=>{let n=app.fieldTypes[e.type]?.dummyData(e,!0),r=typeof n;return e.type==`file`?`文件`:r===`string`?`字符串`:r==`number`?`数字`:r==`bool`?`布尔值`:Array.isArray(n)?`数组`:app.utils.isObject(n)?`对象`:`混合`})),t.td(null,t.code(null,e.type),` field type value.`,t.br(),t.small({className:`txt-hint`},`更多详情请查看`,t.a({href:`https://pocketbase.io/docs/collections/#fields`,target:`_blank`,rel:`noopener noreferrer`,textContent:`字段文档`}),`.`)))))),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`?查询参数`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,e())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,n())))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,`示例响应`)),app.components.codeBlockTabs({tabs:p}))}function i(e){return e.replaceAll(`"[[`,``).replaceAll(`]]"`,``)}function a(e,n=!1){let r=app.utils.getDummyFieldsData(e,!0);return delete r.id,e.type==`auth`&&(n&&(r.oldPassword=`987654321`,delete r.email),r.password=`123456789`,r.passwordConfirm=`123456789`,delete r.verified),r}function o(e,n=!1){let r=a(e,n);for(let e in r){let n=typeof r[e];(r[e]?.startsWith?.(`[[`)||![`number`,`string`,`boolean`].includes(n)&&!Array.isArray(r[e]))&&delete r[e]}return r}export{r as docsCreate,a as fullDummyPayload,o as primitivesDummyPayload,i as replaceDummyPayloadPlaceholder};