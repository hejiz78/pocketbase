import{t as e}from"./expandInfo-DFIAbt2n.js";import{t as n}from"./fieldsInfo-e84Zd23v.js";function r(r){let i=app.utils.getApiExampleURL(),a=r.viewRule===null,o={collectionId:r.id,collectionName:r.name},s=[{title:200,value:JSON.stringify(Object.assign(o,app.utils.getDummyFieldsData(r)),null,2)}];return a&&s.push({title:403,value:`
                {
                  "status": 403,
                  "message": "只有超级用户才能访问此操作。",
                  "data": {}
                }
            `}),s.push({title:404,value:`
            {
              "status": 404,
              "message": "未找到请求的资源。",
              "data": {}
            }
        `}),t.div({pbEvent:`apiPreviewView`,className:`content`},t.p(null,`Fetch a single ${r.name} record.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${i}');

                        ...

                        const record = await pb.collection('${r.name}').getOne('RECORD_ID', {
                            expand: 'relField1,relField2.subRelField',
                        });
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`JS SDK 文档`}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${i}');

                        ...

                        final record = await pb.collection('${r.name}').getOne('RECORD_ID',
                          expand: 'relField1,relField2.subRelField',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`Dart SDK 文档`}))},{title:`curl`,language:`bash`,value:`
                        curl \\
                          -H 'Authorization:TOKEN' \\
                          '${i}/api/collections/${r.name}/records/RECORD_ID'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,`API详情`)),t.div({className:`alert info api-preview-alert`},t.span({className:`label method`},`GET`),t.span({className:`path`},`/api/collections/${r.name}/records/`,t.strong(null,`:id`)),()=>{if(a)return t.small({className:`extra`},`需要超级用户 Authorization:TOKEN 头`)}),t.table({className:`api-preview-table path-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`Path params`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`id`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,`要查看的记录ID。`)))),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`?查询参数`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,e())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,n())))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,`示例响应`)),app.components.codeBlockTabs({tabs:s}))}export{r as docsView};