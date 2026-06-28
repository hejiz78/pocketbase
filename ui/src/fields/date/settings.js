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
                        t.label({ htmlFor: uniqueId + ".min" }, t.span({ className: "txt" }, "最小日期（本地）")),
                        t.input({
                            type: "datetime-local",
                            id: uniqueId + ".min",
                            step: 1,
                            name: () => `fields.${props.fieldIndex}.min`,
                            value: () => app.utils.toDatetimeLocalInputValue(props.field.min),
                            onchange: (e) => {
                                props.field.min = app.utils.toRFC3339Datetime(e.target.value);
                            },
                        }),
                    ),
                ),
                t.div(
                    { className: "col-sm-6" },
                    t.div(
                        { className: "field" },
                        t.label({ htmlFor: uniqueId + ".max" }, t.span({ className: "txt" }, "最大日期（本地）")),
                        t.input({
                            type: "datetime-local",
                            id: uniqueId + ".max",
                            step: 1,
                            name: () => `fields.${props.fieldIndex}.max`,
                            value: () => app.utils.toDatetimeLocalInputValue(props.field.max),
                            onchange: (e) => {
                                props.field.max = app.utils.toRFC3339Datetime(e.target.value);
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
