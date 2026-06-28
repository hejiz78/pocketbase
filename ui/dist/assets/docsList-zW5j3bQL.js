import{t as e}from"./expandInfo-DFIAbt2n.js";import{t as n}from"./fieldsInfo-e84Zd23v.js";import{t as r}from"./filterSyntax-DzJf6f_N.js";function i(i){let a=app.utils.getApiExampleURL(),o=i.listRule===null,s={collectionId:i.id,collectionName:i.name},c=[{title:200,value:JSON.stringify({page:1,perPage:30,totalPages:1,totalItems:2,items:[Object.assign(s,app.utils.getDummyFieldsData(i)),Object.assign(s,app.utils.getDummyFieldsData(i))]},null,2)},{title:400,value:`
                {
                  "status": 400,
                  "message": "处理您的请求时出现问题。",
                  "data": {}
                }
            `}];return o&&c.push({title:403,value:`
                {
                  "status": 403,
                  "message": "只有超级用户才能访问此操作。",
                  "data": {}
                }
            `}),t.div({pbEvent:`apiPreviewList`,className:`content`},t.p(null,`Fetch a paginated ${i.name} records list, supporting sorting and filtering.`),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${a}');

                        ...

                        // fetch a paginated records list
                        const resultList = await pb.collection('${i.name}').getList(1, 50, {
                          filter: 'someField1 != someField2',
                        });

                        // you can also fetch all records at once via getFullList
                        const records = await pb.collection('${i.name}').getFullList({
                          sort: '-someField',
                        });

                        // or fetch only the first record that matches the specified filter
                        const record = await pb.collection('${i.name}').getFirstListItem(
                          'someField="test"',
                          { expand: 'relField1,relField2.subRelField' },
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`JS SDK 文档`}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${a}');

                        ...

                        // fetch a paginated records list
                        final resultList = await pb.collection('${i.name}').getList(
                          page: 1,
                          perPage: 50,
                          filter: 'someField1 != someField2',
                        );

                        // you can also fetch all records at once via getFullList
                        final records = await pb.collection('${i.name}').getFullList(
                          sort: '-someField',
                        );

                        // or fetch only the first record that matches the specified filter
                        final record = await pb.collection('${i.name}').getFirstListItem(
                          'someField="test"',
                          expand: 'relField1,relField2.subRelField',
                        );
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`Dart SDK 文档`}))},{title:`curl`,language:`bash`,value:`
                        curl \\
                          -H 'Authorization:TOKEN' \\
                          '${a}/api/collections/${i.name}/records?perPage=50'
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,`API详情`)),t.div({className:`alert info api-preview-alert`},t.span({className:`label method`},`GET`),t.span({className:`path`},`/api/collections/${i.name}/records`),()=>{if(o)return t.small({className:`extra`},`需要超级用户 Authorization:TOKEN 头`)}),t.table({className:`api-preview-table query-params`},t.thead(null,t.tr(null,t.th({className:`min-width txt-primary`},`?查询参数`),t.th({className:`min-width`},`类型`),t.th(null,`描述`))),t.tbody(null,t.tr(null,t.td({className:`min-width`},`page`),t.td({className:`min-width`},t.span({className:`label`},`数字`)),t.td(null,`分页列表的页码（即偏移量，默认为1）。`)),t.tr(null,t.td({className:`min-width`},`perPage`),t.td({className:`min-width`},t.span({className:`label`},`数字`)),t.td(null,`指定每页返回的最大记录数（默认为30）。`)),t.tr(null,t.td({className:`min-width`},`sort`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,t.p(null,`指定记录排序属性。`,t.br(),`在属性前添加-/+（默认）以进行降序/升序排列。`),t.p(null,`例如：`,app.components.codeBlock({value:`// DESC by created and ASC by id
?sort=-created,id`})),t.p(null,`In addition to the collection non-hidden fields, the following special sort fields could be also used: `,t.code(null,`@random`),` `,t.code({hidden:()=>i.type==`view`},`@rowid`),`.`))),t.tr(null,t.td({className:`min-width`},`filter`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,t.p(null,`筛选返回的记录。例如：`),app.components.codeBlock({value:`?filter=(id='abc' && created>'2022-01-01')`,footnote:`所有查询参数必须正确进行URL编码（SDK会自动处理）。`}),r())),t.tr(null,t.td({className:`min-width`},`expand`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,e())),t.tr(null,t.td({className:`min-width`},`fields`),t.td({className:`min-width`},t.span({className:`label`},`字符串`)),t.td(null,n())),t.tr(null,t.td({className:`min-width`},`skipTotal`),t.td({className:`min-width`},t.span({className:`label`},`布尔值`)),t.td(null,t.p(null,`如果设置为`,t.code(null,`1/true`),` the total counts query will be skipped and the response fields `,t.code(null,`totalItems`),` and `,t.code(null,`totalPages`),` will have -1 value.`),t.p(null,`当不需要总数计数或使用基于游标的分页时，这可以大幅加速搜索查询。`,` For optimization purposes, it is set by default in the `,t.code(null,`getFirstListItem()`),` and `,t.code(null,`getFullList()`),` SDKs methods.`))))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,`示例响应`)),app.components.codeBlockTabs({tabs:c}))}export{i as docsList};