import { expandInfo } from "./expandInfo";
import { fieldsInfo } from "./fieldsInfo";
import { filterSyntax } from "./filterSyntax";

export function docsCreate(collection) {
    const baseURL = app.utils.getApiExampleURL();

    const isSuperusersOnly = collection.createRule === null;

    const isAuth = collection.type === "auth";

    const excludedTableFields = isAuth ? ["password", "verified", "email", "emailVisibility"] : [];

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
                    "${isAuth ? "email" : tableFields.find((f) => !f.primaryKey)?.name || "someField"}": {
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

    return t.div(
        { pbEvent: "apiPreviewCreate", className: "content" },
        // description
        t.p(null, `Creates a new ${collection.name} record.`),
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

// example create body
const body = ${replaceDummyPayloadPlaceholder(JSON.stringify(fullDummyPayload(collection), null, 2))};

const record = await pb.collection('${collection.name}').create(body);
`+ (isAuth ? `
// (optional) send an email verification request
await pb.collection('${collection?.name}').requestVerification('test@example.com');
` : ""),
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

// example create body
final body = <String, dynamic>${JSON.stringify(primitivesDummyPayload(collection), null, 2)};

final record = await pb.collection('${collection.name}').create(body: body, files: []);
` + (isAuth ? `
// (optional) send an email verification request
await pb.collection('${collection?.name}').requestVerification('test@example.com');
` : ""),
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
                          -d '{ ... }' \\
                          '${baseURL}/api/collections/${collection.name}/records/RECORD_ID'
                    `,
                },
            ],
        }),
        // api
        t.div({ className: "block m-t-base" }, t.strong(null, "API详情")),
        t.div(
            { className: "alert success api-preview-alert" },
            t.span({ className: "label method" }, "POST"),
            t.span({ className: "path" }, `/api/collections/${collection.name}/records`),
            () => {
                if (isSuperusersOnly) {
                    return t.small({ className: "extra" }, "需要超级用户 Authorization:TOKEN 头");
                }
            },
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
                () => {
                    if (!isAuth) {
                        return;
                    }

                    return [
                        t.tr(
                            null,
                            t.th(
                                { colSpan: 99 },
                                "认证特定字段",
                            ),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "email ",
                                () => {
                                    if (collection.fields?.find((f) => f.name == "email")?.required) {
                                        return t.em(null, "（必需）");
                                    }
                                    return t.em(null, "（可选）");
                                },
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                            t.td(null, "认证记录邮箱地址。"),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "emailVisibility ",
                                () => {
                                    if (collection.fields?.find((f) => f.name == "emailVisibility")?.required) {
                                        return t.em(null, "（必需）");
                                    }
                                    return t.em(null, "（可选）");
                                },
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, "布尔值")),
                            t.td(
                                null,
                                "获取记录数据时是否显示/隐藏认证记录邮箱。",
                                t.br(),
                                "超级用户和记录所有者始终可以访问邮箱地址。",
                            ),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "password ",
                                t.em(null, "（必需）"),
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                            t.td(null, "认证记录密码。"),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "passwordConfirm ",
                                t.em(null, "（必需）"),
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                            t.td(null, "认证记录密码确认。"),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "verified ",
                                t.em(null, "（可选）"),
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, "字符串")),
                            t.td(
                                null,
                                t.p(null, "指示该认证记录是否已验证。"),
                                t.p(
                                    null,
                                    `此字段只能由超级用户或具有"管理"权限的认证记录设置。`,
                                ),
                            ),
                        ),
                        t.tr(
                            null,
                            t.th(
                                { colSpan: 99 },
                                "其他字段",
                            ),
                        ),
                    ];
                },
                () => {
                    return tableFields.map((f) => {
                        return t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                f.name,
                                t.em(null, f.required && !f.autogeneratePattern ? " (required)" : " (optional)"),
                            ),
                            t.td(
                                { className: "min-width" },
                                t.span(
                                    { className: "label" },
                                    () => {
                                        const dummyData = app.fieldTypes[f.type]?.dummyData(f, true);
                                        const dummyDataType = typeof dummyData;

                                        if (f.type == "file") return "文件";
                                        if (dummyDataType === "string") return "字符串";
                                        if (dummyDataType == "number") return "数字";
                                        if (dummyDataType == "bool") return "布尔值";
                                        if (Array.isArray(dummyData)) return "数组";
                                        if (app.utils.isObject(dummyData)) return "对象";

                                        return "混合";
                                    },
                                ),
                            ),
                            t.td(
                                null,
                                t.code(null, f.type),
                                " field type value.",
                                t.br(),
                                t.small(
                                    { className: "txt-hint" },
                                    "更多详情请查看",
                                    t.a({
                                        href: import.meta.env.PB_FIELDS_DOCS,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        textContent: "字段文档",
                                    }),
                                    ".",
                                ),
                            ),
                        );
                    });
                },
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

export function replaceDummyPayloadPlaceholder(payloadStr) {
    return payloadStr.replaceAll(`"[[`, "").replaceAll(`]]"`, "");
}

export function fullDummyPayload(collection, forUpdate = false) {
    let payload = app.utils.getDummyFieldsData(collection, true);

    delete payload.id;
    if (collection.type == "auth") {
        if (forUpdate) {
            payload.oldPassword = "987654321";
            delete payload.email;
        }

        payload.password = "123456789";
        payload.passwordConfirm = "123456789";

        delete payload.verified;
    }

    return payload;
}

export function primitivesDummyPayload(collection, forUpdate = false) {
    const payload = fullDummyPayload(collection, forUpdate);

    for (const prop in payload) {
        const type = typeof payload[prop];
        if (
            // placeholder
            payload[prop]?.startsWith?.("[[")
            // not a primitive
            || (!["number", "string", "boolean"].includes(type) && !Array.isArray(payload[prop]))
        ) {
            delete payload[prop];
        }
    }

    return payload;
}
