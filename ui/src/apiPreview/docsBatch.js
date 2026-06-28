export function docsBatch(collection) {
    const baseURL = app.utils.getApiExampleURL();

    const baseDummyRecord = {
        collectionId: collection.id,
        collectionName: collection.name,
    };

    const responses = [
        {
            title: 200,
            value: JSON.stringify(
                [
                    {
                        status: 200,
                        body: Object.assign(baseDummyRecord, app.utils.getDummyFieldsData(collection)),
                    },
                    {
                        status: 200,
                        body: Object.assign(baseDummyRecord, app.utils.getDummyFieldsData(collection)),
                    },
                ],
                null,
                2,
            ),
        },
        {
            title: 400,
            value: `
                {
                  "status": 400,
                  "message": "批量事务失败。",
                  "data": {
                    "requests": {
                      "1": {
                        "code": "batch_request_failed",
                        "message": "批量请求失败。",
                        "response": {
                          "status": 400,
                          "message": "创建记录失败。",
                          "data": {
                            "id": {
                              "code": "validation_min_text_constraint",
                              "message": "必须至少3个字符。",
                              "params": { "min": 3 }
                            }
                          }
                        }
                      }
                    }
                  }
                }
            `,
        },
        {
            title: 403,
            value: `
                {
                  "status": 403,
                  "message": "不允许批量请求。",
                  "data": {}
                }
            `,
        },
    ];

    return t.div(
        { pbEvent: "apiPreviewBatch", className: "content" },
        // description
        t.p(null, `在单个请求中批量执行多条记录的创建/更新/插入/删除操作（事务性）。`),
        t.div(
            { className: "alert warning" },
            t.p(
                { className: "txt-bold" },
                "批量Web API需要显式启用并从以下位置配置：",
                t.a({
                    href: "#/settings",
                    target: "_blank",
                    title: "在新标签中打开",
                    textContent: "应用设置",
                }),
                ".",
            ),
            t.p(
                null,
                "由于此端点在单个数据库事务中处理请求，如果使用不当和配置不合理，可能会降低应用程序的性能（使用较小的最大处理时间和请求体大小限制，避免在慢速S3网络上进行大文件上传，以及避免使用与慢速外部API通信的自定义钩子）。",
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

                        const batch = pb.createBatch();

                        batch.collection('${collection.name}').create({ ... });
                        batch.collection('${collection.name}').update('RECORD_ID', { ... });
                        batch.collection('${collection.name}').delete('RECORD_ID');
                        batch.collection('${collection.name}').upsert({ ... });

                        const result = await batch.send();
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

                        final batch = pb.createBatch();

                        batch.collection('${collection.name}').create(body: { ... });
                        batch.collection('${collection.name}').update('RECORD_ID', body: { ... });
                        batch.collection('${collection.name}').delete('RECORD_ID');
                        batch.collection('${collection.name}').upsert(body: { ... });

                        final result = await batch.send();
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
                        curl -X POST \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "requests": [...] }' \\
                          '${baseURL}/api/batch'
                    `,
                },
            ],
        }),
        // api
        t.div({ className: "block m-t-sm" }, t.strong(null, "API详情")),
        t.div(
            { className: "alert success api-preview-alert" },
            t.span({ className: "label method" }, "POST"),
            t.span({ className: "path" }, "/api/batch"),
        ),
        t.p(
            null,
            "该请求仅接受1个必需的",
            t.code(null, "requests: Array<Request>"),
            " parameter that defines the list of the batch requests to process.",
        ),
        t.p(
            null,
            "使用官方SDK时，批量请求由其服务处理器透明构建。",
        ),
        t.p(null, "当不使用SDK时，支持的批量请求操作有："),
        t.ul(
            null,
            t.li(null, "record create - ", t.code(null, "POST /api/collections/{collection}/records")),
            t.li(null, "record update - ", t.code(null, "PATCH /api/collections/{collection}/records")),
            t.li(
                null,
                "record upsert - ",
                t.code(null, "PUT /api/collections/{collection}/records"),
                t.br(),
                t.small({ className: "txt-hint" }, `(the body must have an "id" field)`),
            ),
            t.li(null, "record delete - ", t.code(null, "DELETE /api/collections/{collection}/records/{id}")),
        ),
        t.p(null, "每个批量", t.em(null, "请求"), "元素具有以下属性："),
        t.ul(
            null,
            t.li(null, t.code(null, "url"), t.em(null, "（可包含查询参数）")),
            t.li(null, t.code(null, "method"), t.em(null, "（GET, POST, PUT, PATCH, DELETE）")),
            t.li(
                null,
                t.code(null, "headers"),
                t.br(),
                t.em(
                    null,
                    "(custom per-request Authorization header is not supported at the moment, aka. all batch requests have the same auth state)",
                ),
            ),
            t.li(
                null,
                t.code(null, "body"),
                t.br(),
                "当批量请求以",
                t.code(null, "multipart/form-data"),
                ", the regular batch action fields are expected to be submitted as serialized json under the ",
                t.code(null, "@jsonPayload"),
                " field and file keys need to follow the pattern ",
                t.code(null, "requests.N.fileField"),
                " or ",
                t.code(null, "requests[N].fileField"),
                ".",
                t.br(),
                "这同样由官方SDK透明处理，但例如如果您更喜欢手动构建JS",
                t.code(null, "FormData"),
                " body, then it could look something like:",
                app.components.codeBlock({
                    className: "m-t-10",
                    value: `
                        const batchBody = new FormData();

                        batchBody.append("@jsonPayload", JSON.stringify({
                          requests: [
                            // create
                            {
                              url: "/api/collections/users/records?expand=someRelField",
                              method: "POST",
                              body: { someField: "test1" }
                            },
                            // update
                            {
                              url: "/api/collections/users/records/RECORD_ID",
                              method: "PATCH",
                              body: { someField: "test2" }
                            }
                          ]
                        }))

                        // bind file to the first request
                        batchBody.append("requests.0.someFileField", new File(...))

                        // bind file to the second request
                        batchBody.append("requests.1.someFileField", new File(...))
                    `,
                }),
            ),
        ),
        // responses
        t.div({ className: "block m-t-base m-b-sm" }, t.strong(null, "示例响应")),
        app.components.codeBlockTabs({
            tabs: responses,
        }),
    );
}
