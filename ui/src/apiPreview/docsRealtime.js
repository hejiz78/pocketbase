export function docsRealtime(collection) {
    const baseURL = app.utils.getApiExampleURL();

    const dummyRecord = Object.assign({
        collectionId: collection.id,
        collectionName: collection.name,
    }, app.utils.getDummyFieldsData(collection));

    return t.div(
        { pbEvent: "apiPreviewRealtime", className: "content" },
        // description
        t.p(null, `通过服务器发送事件（SSE）订阅实时更改。`),
        t.p(
            null,
            "事件将针对",
            t.strong(null, "create"),
            ", ",
            t.strong(null, "update"),
            " and ",
            t.strong(null, "delete"),
            `记录操作发送（参见下方"事件数据格式"）。`
        ),
        t.div(
            { className: "alert info" },
            t.p({ className: "txt-bold" }, "您可以订阅单条记录或整个集合。"),
            t.p(
                null,
                "当您订阅",
                t.strong(null, "单条记录"),
                "时，将使用该集合的",
                t.strong(null, "查看规则"),
                "来确定是否允许订阅者接收事件消息。",
            ),
            t.p(
                null,
                "当您订阅",
                t.strong(null, "整个集合"),
                "时，将使用该集合的",
                t.strong(null, "列表/搜索规则"),
                "来确定是否允许订阅者接收事件消息。",
            ),
        ),
        app.components.codeBlockTabs({
            className: "sdk-examples m-t-sm",
            historyKey: "pbLastSDK",
            tabs: [
                {
                    title: "JS SDK",
                    language: "js",
                    value: `
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${baseURL}');

                        ...

                        // (optionally) authenticate
                        await pb.collection('users').authWithPassword('test@example.com', '123456');

                        // subscribe to changes in any ${baseURL} record
                        pb.collection('${baseURL}').subscribe('*', function (e) {
                            console.log(e.action);
                            console.log(e.record);
                        }, { /* other options like: filter, expand, custom headers, etc. */ });

                        // subscribe to changes only in the specified record
                        pb.collection('${baseURL}').subscribe('RECORD_ID', function (e) {
                            console.log(e.action);
                            console.log(e.record);
                        }, { /* other options like: filter, expand, custom headers, etc. */ });

                        ...

                        // unsubscribe - remove all 'RECORD_ID' subscriptions
                        pb.collection('${baseURL}').unsubscribe('RECORD_ID');

                        // unsubscribe - remove all '*' topic subscriptions
                        pb.collection('${baseURL}').unsubscribe('*');

                        // unsubscribe - remove all collection subscriptions
                        pb.collection('${baseURL}').unsubscribe();
                    `,
                    footnote: t.div(
                        { className: "txt-right" },
                        t.a({
                            href: import.meta.env.PB_JS_SDK_URL,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            textContent: "JS SDK 文档",
                        }),
                    ),
                },
                {
                    title: "Dart SDK",
                    language: "dart",
                    value: `
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${baseURL}');

                        ...

                        // (optionally) authenticate
                        await pb.collection('users').authWithPassword('test@example.com', '123456');

                        // subscribe to changes in any ${baseURL} record
                        pb.collection('${baseURL}').subscribe('*', (e) {
                            print(e.action);
                            print(e.record);
                        }, /* other options like: filter, expand, custom headers, etc. */);

                        // subscribe to changes only in the specified record
                        pb.collection('${baseURL}').subscribe('RECORD_ID', (e) {
                            print(e.action);
                            print(e.record);
                        }, /* other options like: filter, expand, custom headers, etc. */);

                        ...

                        // unsubscribe - remove all 'RECORD_ID' subscriptions
                        pb.collection('${baseURL}').unsubscribe('RECORD_ID');

                        // unsubscribe - remove all '*' topic subscriptions
                        pb.collection('${baseURL}').unsubscribe('*');

                        // unsubscribe - remove all collection subscriptions
                        pb.collection('${baseURL}').unsubscribe();
                    `,
                    footnote: t.div(
                        { className: "txt-right" },
                        t.a({
                            href: import.meta.env.PB_DART_SDK_URL,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            textContent: "Dart SDK 文档",
                        }),
                    ),
                },
                {
                    title: "curl",
                    language: "bash",
                    value: `
                        # init an SSE connection and start listening for messages
                        # (the first message is always PB_CONNECT with the connection "clientId")
                        curl -N '${baseURL}/api/realtime'

                        # open a new terminal and submit the subscription topic(s)
                        # with the "clientId" from the initial PB_CONNECT message
                        curl -X POST \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "clientId": "YOUR_CLIENT_ID", "subscriptions": ["${collection.name}/*"] }' \\
                          '${baseURL}/api/realtime'

                        # create/update/delete a record in the ${collection.name} collection and
                        # you should see the event message(s) in the first terminal
                        # (as long as your client satisfies the topic API rule)
                    `,
                },
            ],
        }),
        // api
        t.div({ className: "block m-t-base" }, t.strong(null, "API详情")),
        t.div(
            { className: "alert api-preview-alert" },
            t.span({ className: "label method" }, "GET/POST"),
            t.span({ className: "path" }, "/api/realtime"),
            t.div(
                { className: "extra" },
                t.a({
                    href: import.meta.env.PB_REALTIME_DOCS,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    textContent: "实时通信文档",
                }),
            ),
        ),
        t.div({ className: "block m-t-base m-b-sm" }, t.strong(null, "事件数据格式")),
        app.components.codeBlock({
            value: JSON.stringify(
                {
                    "action": "create",
                    "record": dummyRecord,
                },
                null,
                2,
            ).replace(`"action": "create",`, "\"action\": \"create\", // create, update or delete"),
        }),
    );
}
