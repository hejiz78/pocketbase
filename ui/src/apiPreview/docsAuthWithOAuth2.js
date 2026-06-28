import { expandInfo } from "./expandInfo";
import { fieldsInfo } from "./fieldsInfo";

export function docsAuthWithOAuth2(collection) {
    const baseURL = app.utils.getApiExampleURL();

    const baseDummyRecord = {
        collectionId: collection.id,
        collectionName: collection.name,
    };

    const responses = [
        {
            title: 200,
            value: JSON.stringify(
                {
                    token: "...JWT...",
                    record: Object.assign(baseDummyRecord, app.utils.getDummyFieldsData(collection)),
                    meta: {
                        "id": "abc123",
                        "name": "张三",
                        "username": "zhangsan",
                        "email": "test@example.com",
                        "avatarURL": "https://example.com/avatar.png",
                        "accessToken": "...",
                        "refreshToken": "...",
                        "expiry": "2022-01-01 10:00:00.123Z",
                        "isNew": false,
                        "rawUser": {},
                    },
                },
                null,
                2,
            ),
        },
        {
            title: 400,
            value: `
                {
                  "status": 400,
                  "message": "提交表单时发生错误。",
                  "data": {
                    "provider": {
                      "code": "validation_required",
                      "message": "缺少必需的值。"
                    }
                  }
                }
            `,
        },
    ];

    return t.div(
        {
            pbEvent: "apiPreviewAuthWithOAuth2",
            className: "content",
        },
        // description
        t.p(null, "使用OAuth2提供商进行认证，返回新的认证令牌和记录数据。"),
        t.p(
            null,
            "更多详情请查看",
            t.a({
                href: import.meta.env.PB_OAUTH2_DOCS,
                target: "_blank",
                rel: "noopener noreferrer",
                textContent: "OAuth2集成文档",
            }),
            ".",
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

                        // OAuth2 authentication with a single realtime call.
                        //
                        // Make sure to register ${baseURL}/api/oauth2-redirect
                        // as redirect url in the OAuth2 app configuration.
                        const authData = await pb.collection('${collection.name}').authWithOAuth2({ provider: 'google' });

                        // OR authenticate with manual OAuth2 code exchange
                        // const authData = await pb.collection('${collection.name}').authWithOAuth2Code(...);

                        // after the above you can also access the auth data from the authStore
                        console.log(pb.authStore.isValid);
                        console.log(pb.authStore.token);
                        console.log(pb.authStore.record.id);

                        // "logout"
                        pb.authStore.clear();
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
                        import 'package:url_launcher/url_launcher.dart';

                        final pb = PocketBase('${baseURL}');

                        ...

                        // OAuth2 authentication with a single realtime call.
                        //
                        // Make sure to register ${baseURL}/api/oauth2-redirect
                        // as redirect url in the OAuth2 app configuration.
                        final authData = await pb.collection('${collection.name}').authWithOAuth2('google', (url) async {
                          await launchUrl(url);
                        });

                        // OR authenticate with manual OAuth2 code exchange
                        // final authData = await pb.collection('${collection.name}').authWithOAuth2Code(...);

                        // after the above you can also access the auth data from the authStore
                        print(pb.authStore.isValid);
                        print(pb.authStore.token);
                        print(pb.authStore.record.id);

                        // "logout"
                        pb.authStore.clear();
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
                        # authenticate with manual OAuth2 code exchange
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "provider":"google", "code":"OAUTH2_CODE", "codeVerifier":"...", "redirectURL":"..." }' \\
                          '${baseURL}/api/collections/${collection.name}/auth-with-oauth2'
                    `,
                },
            ],
        }),
        // api
        t.div({ className: "m-t-base" }, t.strong(null, "API详情")),
        t.div(
            { className: "alert success api-preview-alert" },
            t.span({ className: "label method" }, "POST"),
            t.span({ className: "path" }, `/api/collections/${collection.name}/auth-with-password`),
        ),
        t.table(
            { className: "api-preview-table body-params" },
            t.thead(
                null,
                t.tr(
                    null,
                    t.th({ className: "min-width txt-primary" }, "请求体参数"),
                    t.th({ className: "min-width" }, "类型"),
                    t.th(null, "描述"),
                ),
            ),
            t.tbody(
                null,
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "provider ", t.em(null, "（必需）")),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                    t.td(null, `OAuth2客户端提供商的名称（例如"google"）。`),
                ),
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "code ", t.em(null, "（必需）")),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                    t.td(null, "从初始请求返回的授权码。"),
                ),
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "codeVerifier ", t.em(null, "（必需）")),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                    t.td(null, "作为code_challenge一部分随初始请求发送的代码验证器。"),
                ),
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "redirectURL ", t.em(null, "（必需）")),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                    t.td(null, "随初始请求发送的重定向URL。"),
                ),
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "createData ", t.em(null, "（可选）")),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                    t.td(
                        null,
                        t.p(null, "OAuth2注册时创建认证记录所使用的可选数据。"),
                        t.p(
                            null,
                            "创建的认证记录必须符合常规创建操作中的相同要求和验证。",
                        ),
                        t.p(
                            null,
                            "数据只能是JSON格式，也就是说OAuth2注册期间目前不支持用户上传的文件。",
                        ),
                    ),
                ),
            ),
        ),
        t.table(
            { className: "api-preview-table query-params" },
            t.thead(
                null,
                t.tr(
                    null,
                    t.th({ className: "min-width txt-primary" }, "?查询参数"),
                    t.th({ className: "min-width" }, "类型"),
                    t.th(null, "描述"),
                ),
            ),
            t.tbody(
                null,
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "expand"),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                    t.td(null, expandInfo()),
                ),
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "fields"),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                    t.td(null, fieldsInfo()),
                ),
            ),
        ),
        // responses
        t.div({ className: "m-t-base m-b-sm" }, t.strong(null, "示例响应")),
        app.components.codeBlockTabs({
            tabs: responses,
        }),
    );
}
