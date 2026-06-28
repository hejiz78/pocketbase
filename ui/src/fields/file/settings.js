// {
//     originalCollection: undefined,
//     collection: undefined,
//     field
//     get fieldIndex: int/-1,
//     get originalField: undefined
// }
export function settings(props) {
    const uniqueId = "f_" + app.utils.randomString();

    const isMultipleOptions = [
        { label: "单选", value: false },
        { label: "多选", value: true },
    ];

    return app.components.fieldSettings(props, {
        header: [
            t.div(
                {
                    className: "field header-select single-multiple-select",
                },
                app.components.select({
                    required: true,
                    options: isMultipleOptions,
                    value: () => {
                        return props.field.maxSelect > 1;
                    },
                    onchange: (opts) => {
                        if (opts?.[0]?.value) {
                            if (!props.field.maxSelect || props.field.maxSelect < 2) {
                                props.field.maxSelect = 10;
                            }
                        } else {
                            props.field.maxSelect = 1;
                        }
                    },
                }),
            ),
        ],
        content: () =>
            t.div(
                { className: "grid sm" },
                t.div(
                    { className: "col-sm-12" },
                    t.div(
                        { className: "field" },
                        t.label(
                            { htmlFor: uniqueId + ".mimeTypes" },
                            t.span({ className: "txt" }, "允许的MIME类型"),
                            t.i({
                                className: "ri-information-line link-hint",
                                ariaDescription: app.attrs.tooltip(
                                    "仅允许列出的MIME类型的文件。\n留空表示不限制。",
                                ),
                            }),
                        ),
                        app.components.select({
                            max: 99,
                            placeholder: "无限制",
                            options: app.utils.mimeTypes.map((opt) => {
                                return {
                                    value: opt.mimeType,
                                    label: () =>
                                        t.div(
                                            { className: "inline-flex gap-10" },
                                            t.span({ className: "txt" }, opt.ext || "-"),
                                            t.small({ className: "txt-hint" }, opt.mimeType),
                                        ),
                                };
                            }),
                            name: () => `fields.${props.fieldIndex}.mimeTypes`,
                            value: () => app.utils.toArray(props.field.mimeTypes),
                            onchange: (opts) => (props.field.mimeTypes = opts.map((opt) => opt.value)),
                        }),
                    ),
                    t.div(
                        { className: "field-help" },
                        t.button(
                            {
                                "type": "button",
                                "className": "link-hint gap-0",
                                "html-popovertarget": uniqueId + "mimeTypesDropdown",
                            },
                            t.span({ className: "txt" }, "选择预设"),
                            t.i({ className: "ri-arrow-drop-down-fill", ariaHidden: true }),
                        ),
                        t.div(
                            {
                                id: uniqueId + "mimeTypesDropdown",
                                className: "dropdown sm nowrap left p-10",
                                popover: "auto",
                            },
                            t.button({
                                type: "button",
                                className: "dropdown-item",
                                role: "menuitem",
                                onclick: (e) => {
                                    props.field.mimeTypes = [
                                        "image/jpeg",
                                        "image/png",
                                        "image/svg+xml",
                                        "image/gif",
                                        "image/webp",
                                    ];

                                    e.target.closest(".dropdown").hidePopover();
                                },
                                textContent: "图片（jpg, png, svg, gif, webp）",
                            }),
                            t.button({
                                type: "button",
                                className: "dropdown-item",
                                role: "menuitem",
                                onclick: (e) => {
                                    props.field.mimeTypes = [
                                        "application/pdf",
                                        "application/msword",
                                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                        "application/vnd.ms-excel",
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    ];

                                    e.target.closest(".dropdown").hidePopover();
                                },
                                textContent: "文档（pdf, doc/docx, xls/xlsx）",
                            }),
                            t.button({
                                type: "button",
                                className: "dropdown-item",
                                role: "menuitem",
                                onclick: (e) => {
                                    props.field.mimeTypes = [
                                        "video/mp4",
                                        "video/mpeg",
                                        "video/x-msvideo",
                                        "video/quicktime",
                                        "video/3gpp",
                                    ];

                                    e.target.closest(".dropdown").hidePopover();
                                },
                                textContent: "视频（mp4, mpeg, avi, mov, 3gp）",
                            }),
                            t.button({
                                type: "button",
                                className: "dropdown-item",
                                role: "menuitem",
                                onclick: (e) => {
                                    props.field.mimeTypes = [
                                        "application/zip",
                                        "application/x-7z-compressed",
                                        "application/x-rar-compressed",
                                    ];

                                    e.target.closest(".dropdown").hidePopover();
                                },
                                textContent: "压缩包（zip, 7zip, rar）",
                            }),
                        ),
                    ),
                ),
                t.div(
                    { className: () => (props.field.maxSelect > 1 ? "col-sm-6" : "col-sm-9") },
                    t.div(
                        { className: "field" },
                        t.label(
                            {
                                htmlFor: uniqueId + ".thumbs",
                            },
                            t.span({ className: "txt" }, "缩略图尺寸"),
                            t.i({
                                className: "ri-information-line link-hint",
                                ariaDescription: app.attrs.tooltip(
                                    "图像文件的额外缩略图尺寸列表，以及默认的100x100缩略图尺寸。缩略图在首次访问时按需生成。",
                                ),
                            }),
                        ),
                        t.input({
                            type: "text",
                            id: uniqueId + ".thumbs",
                            placeholder: "例如 50x50, 480x720",
                            name: () => `fields.${props.fieldIndex}.thumbs`,
                            value: () => app.utils.joinNonEmpty(props.field.thumbs),
                            onchange: (e) => (props.field.thumbs = app.utils.splitNonEmpty(e.target.value, ",")),
                        }),
                    ),
                    t.div(
                        { className: "field-help" },
                        t.span({ className: "txt m-r-5" }, "使用逗号分隔。"),
                        t.button(
                            {
                                "type": "button",
                                "className": "link-hint gap-0",
                                "html-popovertarget": uniqueId + "thumbFormatsDropdown",
                            },
                            t.span({ className: "txt" }, "支持的格式"),
                            t.i({ className: "ri-arrow-drop-down-fill", ariaHidden: true }),
                        ),
                        t.div(
                            {
                                id: uniqueId + "thumbFormatsDropdown",
                                className: "dropdown sm nowrap left p-10",
                                popover: "auto",
                            },
                            t.ul(
                                { className: "m-0 p-l-sm" },
                                t.li(
                                    null,
                                    t.strong(null, "宽x高"),
                                    t.span(null, " (e.g. 100x50) - crop to WxH viewbox (from center)"),
                                ),
                                t.li(
                                    null,
                                    t.strong(null, "宽x高t"),
                                    t.span(null, " (e.g. 100x50t) - crop to WxH viewbox (from top)"),
                                ),
                                t.li(
                                    null,
                                    t.strong(null, "宽x高b"),
                                    t.span(null, " (e.g. 100x50b) - crop to WxH viewbox (from bottom)"),
                                ),
                                t.li(
                                    null,
                                    t.strong(null, "宽x高f"),
                                    t.span(null, " (e.g. 100x50f) - fit inside a WxH viewbox (without cropping)"),
                                ),
                                t.li(
                                    null,
                                    t.strong(null, "0xH"),
                                    t.span(null, " (e.g. 0x50) - resize to H height preserving the aspect ratio"),
                                ),
                                t.li(
                                    null,
                                    t.strong(null, "宽x0"),
                                    t.span(null, " (e.g. 100x0) - resize to W width preserving the aspect ratio"),
                                ),
                            ),
                        ),
                    ),
                ),
                t.div(
                    { className: "col-sm-3" },
                    t.div(
                        { className: "field" },
                        t.label({ htmlFor: uniqueId + ".maxSize" }, "最大大小"),
                        t.input({
                            type: "number",
                            id: uniqueId + ".maxSize",
                            step: 1,
                            min: 0,
                            max: Number.MAX_SAFE_INTEGER,
                            placeholder: "默认约5MB",
                            name: () => `fields.${props.fieldIndex}.maxSize`,
                            value: () => props.field.maxSize || "",
                            oninput: (e) => (props.field.maxSize = parseInt(e.target.value, 10)),
                        }),
                    ),
                    t.div({ className: "field-help" }, "以字节为单位。"),
                ),
                t.div(
                    { className: "col-sm-3", hidden: () => props.field.maxSelect << 0 < 2 },
                    t.div(
                        { className: "field" },
                        t.label({ htmlFor: uniqueId + ".maxSelect" }, "最大选择数"),
                        t.input({
                            type: "number",
                            id: uniqueId + ".maxSelect",
                            placeholder: "默认为单选",
                            step: 1,
                            min: 2,
                            required: true,
                            max: Number.MAX_SAFE_INTEGER,
                            name: () => `fields.${props.fieldIndex}.maxSelect`,
                            value: () => props.field.maxSelect || "",
                            onchange: (e) => {
                                const maxSelect = parseInt(e.target.value, 10);
                                if (maxSelect > 1) {
                                    props.field.maxSelect = maxSelect;
                                } else {
                                    props.field.maxSelect = 1;
                                }
                            },
                        }),
                    ),
                ),
                t.div(
                    { className: "col-sm-12" },
                    t.div(
                        { className: "field m-t-5 m-b-5" },
                        t.input({
                            className: "switch",
                            type: "checkbox",
                            id: uniqueId + ".protected",
                            name: () => `fields.${props.fieldIndex}.protected`,
                            checked: () => !!props.field.protected,
                            onchange: (e) => (props.field.protected = e.target.checked),
                        }),
                        t.label(
                            { htmlFor: uniqueId + ".protected" },
                            t.span({ className: "txt" }, "受保护"),
                            t.small(
                                { className: "txt-hint" },
                                "文件下载请求需要满足查看API规则（",
                                t.a({
                                    href: import.meta.env.PB_PROTECTED_FILE_DOCS,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    textContent: "了解更多",
                                }),
                                ").",
                            ),
                        ),
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
                    t.small({ className: "txt-hint" }, () => props.field.maxSelect > 1 ? "(!=[])" : "(!='')"),
                    t.i({
                        className: "ri-information-line link-hint",
                        ariaDescription: app.attrs.tooltip(() =>
                            `Requires the field value to be nonempty ${props.field.maxSelect > 1 ? "array" : "string"}.`
                        ),
                    }),
                ),
            ),
        ],
    });
}
