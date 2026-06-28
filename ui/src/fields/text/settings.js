// {
//     originalCollection: undefined,
//     collection: undefined,
//     field
//     get fieldIndex: int/-1,
//     get originalField: undefined
// }
export function settings(props) {
    const uniqueId = "f_" + app.utils.randomString();

    return app.components.fieldSettings(props, {
        content: () =>
            t.div(
                { className: "grid sm" },
                t.div(
                    { className: "col-sm-6" },
                    t.div(
                        { className: "field" },
                        t.label(
                            { htmlFor: uniqueId + ".min" },
                            t.span({ className: "txt" }, "最小长度"),
                            t.i({
                                className: "ri-information-line link-hint",
                                ariaDescription: app.attrs.tooltip("清除该字段或设为0表示无限制。"),
                            }),
                        ),
                        t.input({
                            type: "number",
                            id: uniqueId + ".min",
                            name: () => `fields.${props.fieldIndex}.min`,
                            step: 1,
                            min: 0,
                            max: Number.MAX_SAFE_INTEGER,
                            placeholder: "无最小限制",
                            value: () => props.field.min || "",
                            oninput: (e) => {
                                props.field.min = parseInt(e.target.value, 10);
                            },
                        }),
                    ),
                ),
                t.div(
                    { className: "col-sm-6" },
                    t.div(
                        { className: "field" },
                        t.label(
                            { htmlFor: uniqueId + ".max" },
                            t.span({ className: "txt" }, "最大长度"),
                            t.i({
                                className: "ri-information-line link-hint",
                                ariaDescription: app.attrs.tooltip(
                                    "清除该字段或设为0以使用默认限制。",
                                ),
                            }),
                        ),
                        t.input({
                            type: "number",
                            id: uniqueId + ".max",
                            name: () => `fields.${props.fieldIndex}.max`,
                            step: 1,
                            min: () => props.field.min || 0,
                            max: Number.MAX_SAFE_INTEGER,
                            placeholder: "默认最大5000个字符",
                            value: () => props.field.max || "",
                            oninput: (e) => {
                                props.field.max = parseInt(e.target.value, 10);
                            },
                        }),
                    ),
                ),
                t.div(
                    { className: "col-sm-6" },
                    t.div(
                        { className: "field" },
                        t.label(
                            { htmlFor: uniqueId + ".pattern" },
                            t.span({ className: "txt" }, "验证正则表达式"),
                            () => {
                                if (props.field.primaryKey) {
                                    return t.i({
                                        className: "ri-information-line link-hint",
                                        ariaDescription: app.attrs.tooltip(
                                            "除了用户定义的正则表达式外，所有记录ID都有禁止字符和唯一的不区分大小写（ASCII）验证。",
                                        ),
                                    });
                                }
                            },
                        ),
                        t.input({
                            type: "text",
                            id: uniqueId + ".pattern",
                            name: () => `fields.${props.fieldIndex}.pattern`,
                            value: () => props.field.pattern || "",
                            oninput: (e) => (props.field.pattern = e.target.value),
                        }),
                    ),
                    t.div({ className: "field-help" }, "例如", t.code(null, "^[a-z0-9]+$")),
                ),
                t.div(
                    { className: "col-sm-6" },
                    t.div(
                        { className: "field" },
                        t.label(
                            { htmlFor: uniqueId + ".autogeneratePattern" },
                            t.span({ className: "txt" }, "自动生成正则表达式"),
                            t.i({
                                className: "ri-information-line link-hint",
                                ariaDescription: app.attrs.tooltip(
                                    "在记录创建值缺失时，根据模式设置并自动生成文本。",
                                ),
                            }),
                        ),
                        t.input({
                            type: "text",
                            id: uniqueId + ".autogeneratePattern",
                            name: () => `fields.${props.fieldIndex}.autogeneratePattern`,
                            value: () => props.field.autogeneratePattern || "",
                            oninput: (e) => (props.field.autogeneratePattern = e.target.value),
                        }),
                    ),
                    t.div({ className: "field-help" }, "例如", t.code(null, "[a-z0-9]{30}")),
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
                    t.small({ className: "txt-hint" }, "(!='')"),
                    t.i({
                        className: "ri-information-line link-hint",
                        ariaDescription: app.attrs.tooltip("要求字段值为非空字符串。"),
                    }),
                ),
            ),
        ],
    });
}
