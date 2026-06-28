export function batchAccordion(pageData) {
    return t.details(
        {
            pbEvent: "batchApiAccordion",
            className: "accordion batch-api-accordion",
            name: "settingsAccordion",
        },
        t.summary(
            null,
            t.i({ className: "ri-archive-stack-line", ariaHidden: true }),
            t.span({ className: "txt" }, "批量Web API"),
            t.div({ className: "flex-fill" }),
            () => {
                if (pageData.formSettings.batch.enabled) {
                    return t.span({ className: "label success" }, "已启用");
                }
                return t.span({ className: "label" }, "已禁用");
            },
            () => {
                if (!app.utils.isEmpty(app.store.errors?.batch)) {
                    return t.i({
                        className: "ri-error-warning-fill txt-danger",
                        ariaDescription: app.attrs.tooltip("存在错误", "left"),
                    });
                }
            },
        ),
        t.div(
            { className: "grid sm" },
            t.div(
                { className: "col-lg-12" },
                t.div(
                    { className: "field" },
                    t.input({
                        id: "batch.enabled",
                        name: "batch.enabled",
                        type: "checkbox",
                        className: "switch",
                        checked: () => pageData.formSettings.batch.enabled || false,
                        onchange: (e) => (pageData.formSettings.batch.enabled = e.target.checked),
                    }),
                    t.label(
                        { htmlFor: "batch.enabled" },
                        t.span({ className: "txt" }, "启用"),
                        t.small({ className: "txt-hint" }, "（实验性）"),
                    ),
                ),
            ),
            t.div(
                { className: "col-lg-4" },
                t.div(
                    { className: "field" },
                    t.label(
                        { htmlFor: "batch.maxRequests" },
                        t.span({ className: "txt" }, "批量最大请求数"),
                        t.i({
                            className: "ri-information-line link-faded",
                            ariaDescription: app.attrs.tooltip(
                                "速率限制（如果启用）也适用于批量创建/更新/插入/删除请求。",
                                "right",
                            ),
                        }),
                    ),
                    t.input({
                        id: "batch.maxRequests",
                        name: "batch.maxRequests",
                        type: "number",
                        min: 1,
                        step: 1,
                        required: () => pageData.formSettings.batch.enabled,
                        disabled: () => !pageData.formSettings.batch.enabled,
                        value: () => pageData.formSettings.batch.maxRequests,
                        oninput: (e) => (pageData.formSettings.batch.maxRequests = e.target.value << 0),
                    }),
                ),
            ),
            t.div(
                { className: "col-lg-4" },
                t.div(
                    { className: "field" },
                    t.label(
                        { htmlFor: "batch.timeout" },
                        t.span({ className: "txt" }, "最大处理时间（秒）"),
                    ),
                    t.input({
                        id: "batch.timeout",
                        name: "batch.timeout",
                        type: "number",
                        min: 1,
                        step: 1,
                        required: () => pageData.formSettings.batch.enabled,
                        disabled: () => !pageData.formSettings.batch.enabled,
                        value: () => pageData.formSettings.batch.timeout,
                        oninput: (e) => pageData.formSettings.batch.timeout = parseInt(e.target.value, 10),
                    }),
                ),
            ),
            t.div(
                { className: "col-lg-4" },
                t.div(
                    { className: "field" },
                    t.label(
                        { htmlFor: "batch.maxBodySize" },
                        t.span({ className: "txt" }, "最大请求体大小（字节）"),
                    ),
                    t.input({
                        id: "batch.maxBodySize",
                        name: "batch.maxBodySize",
                        type: "number",
                        min: 0,
                        step: 1,
                        placeholder: "默认128MB",
                        disabled: () => !pageData.formSettings.batch.enabled,
                        value: () => pageData.formSettings.batch.maxBodySize || "",
                        oninput: (e) => pageData.formSettings.batch.maxBodySize = parseInt(e.target.value, 10),
                    }),
                ),
            ),
        ),
    );
}
