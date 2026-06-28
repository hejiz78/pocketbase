function e(e){let n=app.utils.getApiExampleURL(),r=Object.assign({collectionId:e.id,collectionName:e.name},app.utils.getDummyFieldsData(e));return t.div({pbEvent:`apiPreviewRealtime`,className:`content`},t.p(null,`通过服务器发送事件（SSE）订阅实时更改。`),t.p(null,`事件将针对`,t.strong(null,`create`),`, `,t.strong(null,`update`),` and `,t.strong(null,`delete`),`记录操作发送（参见下方"事件数据格式"）。`),t.div({className:`alert info`},t.p({className:`txt-bold`},`您可以订阅单条记录或整个集合。`),t.p(null,`当您订阅`,t.strong(null,`单条记录`),`时，将使用该集合的`,t.strong(null,`查看规则`),`来确定是否允许订阅者接收事件消息。`),t.p(null,`当您订阅`,t.strong(null,`整个集合`),`时，将使用该集合的`,t.strong(null,`列表/搜索规则`),`来确定是否允许订阅者接收事件消息。`)),app.components.codeBlockTabs({className:`sdk-examples m-t-sm`,historyKey:`pbLastSDK`,tabs:[{title:`JS SDK`,language:`js`,value:`
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${n}');

                        ...

                        // (optionally) authenticate
                        await pb.collection('users').authWithPassword('test@example.com', '123456');

                        // subscribe to changes in any ${n} record
                        pb.collection('${n}').subscribe('*', function (e) {
                            console.log(e.action);
                            console.log(e.record);
                        }, { /* other options like: filter, expand, custom headers, etc. */ });

                        // subscribe to changes only in the specified record
                        pb.collection('${n}').subscribe('RECORD_ID', function (e) {
                            console.log(e.action);
                            console.log(e.record);
                        }, { /* other options like: filter, expand, custom headers, etc. */ });

                        ...

                        // unsubscribe - remove all 'RECORD_ID' subscriptions
                        pb.collection('${n}').unsubscribe('RECORD_ID');

                        // unsubscribe - remove all '*' topic subscriptions
                        pb.collection('${n}').unsubscribe('*');

                        // unsubscribe - remove all collection subscriptions
                        pb.collection('${n}').unsubscribe();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/js-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`JS SDK 文档`}))},{title:`Dart SDK`,language:`dart`,value:`
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${n}');

                        ...

                        // (optionally) authenticate
                        await pb.collection('users').authWithPassword('test@example.com', '123456');

                        // subscribe to changes in any ${n} record
                        pb.collection('${n}').subscribe('*', (e) {
                            print(e.action);
                            print(e.record);
                        }, /* other options like: filter, expand, custom headers, etc. */);

                        // subscribe to changes only in the specified record
                        pb.collection('${n}').subscribe('RECORD_ID', (e) {
                            print(e.action);
                            print(e.record);
                        }, /* other options like: filter, expand, custom headers, etc. */);

                        ...

                        // unsubscribe - remove all 'RECORD_ID' subscriptions
                        pb.collection('${n}').unsubscribe('RECORD_ID');

                        // unsubscribe - remove all '*' topic subscriptions
                        pb.collection('${n}').unsubscribe('*');

                        // unsubscribe - remove all collection subscriptions
                        pb.collection('${n}').unsubscribe();
                    `,footnote:t.div({className:`txt-right`},t.a({href:`https://github.com/pocketbase/dart-sdk`,target:`_blank`,rel:`noopener noreferrer`,textContent:`Dart SDK 文档`}))},{title:`curl`,language:`bash`,value:`
                        # init an SSE connection and start listening for messages
                        # (the first message is always PB_CONNECT with the connection "clientId")
                        curl -N '${n}/api/realtime'

                        # open a new terminal and submit the subscription topic(s)
                        # with the "clientId" from the initial PB_CONNECT message
                        curl -X POST \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "clientId": "YOUR_CLIENT_ID", "subscriptions": ["${e.name}/*"] }' \\
                          '${n}/api/realtime'

                        # create/update/delete a record in the ${e.name} collection and
                        # you should see the event message(s) in the first terminal
                        # (as long as your client satisfies the topic API rule)
                    `}]}),t.div({className:`block m-t-base`},t.strong(null,`API详情`)),t.div({className:`alert api-preview-alert`},t.span({className:`label method`},`GET/POST`),t.span({className:`path`},`/api/realtime`),t.div({className:`extra`},t.a({href:`https://pocketbase.io/docs/api-realtime/`,target:`_blank`,rel:`noopener noreferrer`,textContent:`实时通信文档`}))),t.div({className:`block m-t-base m-b-sm`},t.strong(null,`事件数据格式`)),app.components.codeBlock({value:JSON.stringify({action:`create`,record:r},null,2).replace(`"action": "create",`,`"action": "create", // create, update or delete`)}))}export{e as docsRealtime};