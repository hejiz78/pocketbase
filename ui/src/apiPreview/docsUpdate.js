import { fullDummyPayload, primitivesDummyPayload, replaceDummyPayloadPlaceholder } from "./docsCreate";
import { expandInfo } from "./expandInfo";
import { fieldsInfo } from "./fieldsInfo";

export function docsUpdate(collection) {
    const baseURL = app.utils.getApiExampleURL();

    const isSuperusersOnly = collection.updateRule === null;

    const isAuth = collection.type === "auth";

    const excludedTableFields = isAuth ? ["id", "password", "verified", "email", "emailVisibility"] : ["id"];

    const tableFields =
        collection.fields?.filter((f) => !f.hidden && f.type != "autodate" && !excludedTableFields.includes(f.name))
        || [];

    const baseDummyRecord = {
        collectionId: collection.id,
        collectionName: collection.name,
    };

    const responses = [
        {
            title: 200,
            value: JSON.stringify(
                Object.assign(baseDummyRecord, app.utils.getDummyFieldsData(collection)),
                null,
                2,
            ),
        },
        {
            title: 400,
            value: `
                {
                  "status": 400,
                  "message": "创建记录失败。",
                  "data": {
                    "${tableFields.find((f) => !f.primaryKey)?.name || "someField"}": {
                      "code": "validation_required",
                      "message": "缺少必需的值。"
                    }
                  }
                }
            `,
        },
    ];
    if (isSuperusersOnly) {
        responses.push({
            title: 403,
            value: `
                {
                  "status": 403,
                  "message": "只有超级用户才能执行此操作。",
                  "data": {}
                }
            `,
        });
    }
    responses.push({
        title: 404,
        value: `
            {
              "status": 404,
              "message": "未找到请求的资源。",
              "data": {}
            }
        `,
    });

    return t.div(
        { pbEvent: "apiPreviewUpdate", className: "content" },
        // description
        t.p(null, `Updates an existing ${collection.name} record.`),
        t.p(
            null,
            "请求体参数可以以",
            t.code(null, "application/json"),
            " or ",
            t.code(null, "multipart/form-data"),
            ".",
        ),
        t.p(
            null,
            "文件上传仅支持通过",
            t.code(null, "multipart/form-data"),
            ". For more info and examples you could check the detailed ",
            t.a({
                href: import.meta.env.PB_FILE_UPLOAD_DOCS,
                target: "_blank",
                rel: "noopener noreferrer",
                textContent: "文件上传和处理文档",
            }),
            ".",
        ),
        t.p(
            null,
            t.em(
                null,
                "请注意，如果密码发生更改，当前记录之前发出的所有令牌将自动失效，如果您希望用户保持登录状态，需要在更新调用后手动重新认证。",
            ),
        ),
        app.components.codeBlockTabs({
            className: "sdk-examples m-t-sm",
            historyKey: "pbLastSDK",
            tabs: [
                {
                    title: "JS SDK",
                    language: "js",
                    // dprint-ignore
                    value: `
import PocketBase from 'pocketbase';

const pb = new PocketBase('${baseURL}');

...

// example update body
const body = ${replaceDummyPayloadPlaceholder(JSON.stringify(fullDummyPayload(collection, true), null, 2))};

const record = await pb.collection('${collection.name}').update('RECORD_ID', body);
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
                    // dprint-ignore
                    value: `
import 'package:pocketbase/pocketbase.dart';

final pb = PocketBase('${baseURL}');

...

// example update body
final body = <String, dynamic>${JSON.stringify(primitivesDummyPayload(collection, true), null, 2)};

final record = await pb.collection('${collection.name}').update(
  'RECORD_ID',
  body: body,
  files: [],
);
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
                        curl -X PATCH \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ ... }' \\
                          '${baseURL}/api/collections/${collection.name}/records/RECORD_ID'
                    `,
                },
            ],
        }),
        // api
        t.div({ className: "block m-t-base" }, t.strong(null, "API详情")),
        t.div(
            { className: "alert warning api-preview-alert" },
            t.span({ className: "label method" }, "PATCH"),
            t.span({ className: "path" }, `/api/collections/${collection.name}/records/`, t.strong(null, ":id")),
            () => {
                if (isSuperusersOnly) {
                    return t.small({ className: "extra" }, "需要超级用户 Authorization:TOKEN 头");
                }
            },
        ),
        t.table(
            { className: "api-preview-table path-params" },
            t.thead(
                null,
                t.tr(
                    null,
                    t.th({ className: "min-width txt-primary" }, "Path params"),
                    t.th({ className: "min-width" }, "类型"),
                    t.th(null, "描述"),
                ),
            ),
            t.tbody(
                null,
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "id"),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                    t.td(null, "要更新的记录ID。"),
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
        t.div({ className: "block m-t-base m-b-sm" }, t.strong(null, "示例响应")),
        app.components.codeBlockTabs({
            tabs: responses,
        }),
    );
}
