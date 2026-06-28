// {
//     originalCollection: undefined,
//     collection: undefined,
//     field
//     get fieldIndex: int/-1,
//     get originalField: undefined
// }
export function settings(props) {
    const uniqueId = "f_" + app.utils.randomString();

    const local = store({
        showInfo: false,
    });

    return app.components.fieldSettings(props, {
        content: () =>
            t.div(
                { className: "grid sm" },
                t.div(
                    { className: "col-sm-12" },
                    t.div(
                        { className: "field" },
                        t.label(
                            { htmlFor: uniqueId + ".maxSize" },
                            t.span(null, "最大大小"),
                            t.small(null, "(bytes)"),
                        ),
                        t.input({
                            type: "number",
                            id: uniqueId + ".maxSize",
                            name: () => `fields.${props.fieldIndex}.maxSize`,
                            min: 0,
                            step: 1,
                            max: Number.MAX_SAFE_INTEGER,
                            placeholder: "默认最大约1MB",
                            value: () => props.field.maxSize || "",
                            oninput: (e) => {
                                props.field.maxSize = parseInt(e.target.value, 10);
                            },
                        }),
                    ),
                ),
                t.div(
                    { className: "col-sm-12" },
                    t.div(
                        { className: "field" },
                        t.label({ htmlFor: uniqueId + ".help" }, "帮助文本"),
                        t.input({
                            type: "text",
                            id: uniqueId + ".help",
                            name: () => `fields.${props.fieldIndex}.help`,
                            value: () => props.field.help || "",
                            oninput: (e) => (props.field.help = e.target.value),
                        }),
                    ),
                ),
                t.div(
                    { className: "col-sm-12" },
                    t.button(
                        {
                            type: "button",
                            className: () => `btn sm secondary ${local.showInfo ? "" : "transparent"}`,
                            onclick: () => (local.showInfo = !local.showInfo),
                        },
                        t.span({ className: "txt" }, "字符串值规范化"),
                        t.i({
                            className: () => (local.showInfo ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"),
                            ariaHidden: true,
                        }),
                    ),
                    app.components.slide(
                        () => local.showInfo,
                        t.div(
                            { className: "alert m-t-10 info" },
                            t.div(
                                { className: "content" },
                                "为了无缝支持",
                                t.code(null, "application/json"),
                                " and ",
                                t.code(null, "multipart/form-data"),
                                "requests, the following normalization rules are applied if the ",
                                t.code(null, "json"),
                                " field is a plain string:",
                                t.ul(
                                    null,
                                    t.li(null, `"true" is converted to the json `, t.code(null, "true")),
                                    t.li(null, `"false" is converted to the json `, t.code(null, "false")),
                                    t.li(null, `"null" is converted to the json `, t.code(null, "null")),
                                    t.li(null, `"[1,2,3]" is converted to the json `, t.code(null, "[1,2,3]")),
                                    t.li(
                                        null,
                                        `'{"a":1,"b":2}' is converted to the json `,
                                        t.code(null, `{"a":1,"b":2}`),
                                    ),
                                    t.li(null, `numeric strings are converted to json number`),
                                    t.li(
                                        null,
                                        `double quoted strings are left as they are (aka. without normalizations)`,
                                    ),
                                    t.li(null, `any other string (empty string too) is double quoted`),
                                ),
                                "或者，如果您想避免字符串值规范化，可以将数据包装在对象中，例如",
                                t.code(null, "{\"data\": anything}"),
                                ".",
                            ),
                        ),
                    ),
                ),
            ),
        footer: () => [
            t.div(
                { className: "field" },
                t.input({
                    className: "sm",
                    type: "checkbox",
                    id: uniqueId + ".required",
                    name: () => `fields.${props.fieldIndex}.required`,
                    checked: () => !!props.field.required,
                    onchange: (e) => (props.field.required = e.target.checked),
                }),
                t.label(
                    { htmlFor: uniqueId + ".required" },
                    t.span({ className: "txt" }, "必填"),
                    t.i({
                        className: "ri-information-line link-hint",
                        ariaDescription: app.attrs.tooltip("Requires the field value NOT to be null, '', [], {}."),
                    }),
                ),
            ),
        ],
    });
}
