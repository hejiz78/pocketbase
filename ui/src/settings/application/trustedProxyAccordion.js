export function trustedProxyAccordion(pageData) {
    const commonProxyHeaders = ["X-Forwarded-For", "Fly-Client-IP", "CF-Connecting-IP"];

    const ipOptions = [
        { label: "使用最左侧IP", value: true },
        { label: "使用最右侧IP", value: false },
    ];

    const proxyInfo = store({
        isLoading: false,
        realIP: "",
        possibleProxyHeader: "",
        get suggestedProxyHeaders() {
            if (!proxyInfo.possibleProxyHeader) {
                return commonProxyHeaders;
            }

            return [proxyInfo.possibleProxyHeader].concat(
                commonProxyHeaders.filter((h) => h != proxyInfo.possibleProxyHeader),
            );
        },
        get isEnabled() {
            return !app.utils.isEmpty(pageData.formSettings.trustedProxy?.headers);
        },
    });

    async function loadProxyInfo() {
        proxyInfo.isLoading = true;

        try {
            const health = await app.pb.health.check({ requestKey: "loadProxyInfo" });

            proxyInfo.realIP = health.data?.realIP || "";
            proxyInfo.possibleProxyHeader = health.data?.possibleProxyHeader || "";
            proxyInfo.isLoading = false;
        } catch (err) {
            if (!err.isAbort) {
                app.checkApiError(err);
                proxyInfo.isLoading = false;
            }
        }
    }

    return t.details(
        {
            pbEvent: "trustedProxyAccordion",
            className: "accordion trusted-proxy-accordion",
            name: "settingsAccordion",
            onmount: (el) => {
                el._infoWatcher?.unwatch();
                el._infoWatcher = watch(() => JSON.stringify(app.store.settings?.trustedProxy), (newHash, oldHash) => {
                    if (newHash != oldHash) {
                        loadProxyInfo();
                    }
                });
            },
            onunmount: (el) => {
                el._infoWatcher?.unwatch();
            },
        },
        t.summary(
            null,
            t.i({ className: "ri-route-line", ariaHidden: true }),
            t.span({ className: "txt" }, "IP代理头"),
            () => {
                if (proxyInfo.isLoading) {
                    return t.span({ className: "loader sm" });
                }

                if (!proxyInfo.isEnabled && proxyInfo.possibleProxyHeader) {
                    return t.i({
                        className: "ri-alert-line txt-warning",
                        ariaDescription: app.attrs.tooltip(
                            "检测到代理头。\n建议将其列为受信任。",
                            "right",
                        ),
                    });
                }

                if (
                    proxyInfo.isEnabled
                    && proxyInfo.possibleProxyHeader
                    && !pageData.formSettings.trustedProxy.headers.includes(proxyInfo.possibleProxyHeader)
                ) {
                    return t.i({
                        className: "ri-alert-line txt-hint",
                        ariaDescription: app.attrs.tooltip(
                            "配置的代理头与检测到的不匹配。",
                            "right",
                        ),
                    });
                }
            },
            t.div({ className: "flex-fill" }),
            () => {
                if (proxyInfo.isEnabled) {
                    return t.span({ className: "label success" }, "已启用");
                }
                return t.span({ className: "label" }, "已禁用");
            },
            () => {
                if (!app.utils.isEmpty(app.store.errors?.trustedProxy)) {
                    return t.i({
                        className: "ri-error-warning-fill txt-danger",
                        ariaDescription: app.attrs.tooltip("存在错误", "left"),
                    });
                }
            },
        ),
        t.p(
            { className: "m-t-0" },
            "下方您应该能看到您的真实IP。如果不是，请为您的环境配置正确的代理头。",
        ),
        t.div(
            { className: "alert info m-b-sm" },
            t.div(
                { className: "flex gap-5" },
                t.span(null, "解析的用户IP："),
                t.strong(null, () => proxyInfo.isLoading ? "..." : (proxyInfo.realIP || "N/A")),
            ),
            t.div(
                { className: "flex gap-5" },
                t.span(null, "检测到的代理头："),
                t.strong(null, () => proxyInfo.isLoading ? "..." : (proxyInfo.possibleProxyHeader || "N/A")),
            ),
        ),
        t.div(
            { className: "content m-b-sm" },
            t.p(
                null,
                `
                当PocketBase部署在Fly等平台上或通过NGINX等代理访问时，来自不同用户的请求将来自同一IP地址（连接到您的PocketBase应用的代理IP）。
            `,
            ),
            t.p(
                null,
                `
                在这种情况下，要获取实际用户IP（用于速率限制、日志记录等），您需要正确配置代理并在下方列出PocketBase可用于提取用户IP的受信任头。
            `,
            ),
            t.p({ className: "txt-bold" }, `使用此类代理时，为防止欺骗，建议：`),
            t.ul(
                { className: "txt-bold" },
                t.li(
                    null,
                    "使用仅由代理控制且用户无法手动设置的头",
                ),
                t.li(null, "确保PocketBase服务器只能通过代理访问"),
            ),
            t.p(null, "如果PocketBase未部署在代理后面，您可以清除头字段。"),
        ),
        t.div(
            { className: "grid sm" },
            t.div(
                { className: "col-lg-9" },
                t.div(
                    { className: "fields" },
                    t.div(
                        { className: "field" },
                        t.label({ htmlFor: "trustedProxy.headers" }, "受信任的IP代理头"),
                        t.input({
                            type: "text",
                            id: "trustedProxy.headers",
                            name: "trustedProxy.headers",
                            placeholder: "留空以禁用",
                            value: () => app.utils.joinNonEmpty(pageData.formSettings.trustedProxy.headers),
                            oninput: (e) => {
                                const newValue = app.utils.splitNonEmpty(e.target.value, ",");
                                const newStr = app.utils.joinNonEmpty(newValue);
                                const oldStr = app.utils.joinNonEmpty(pageData.formSettings.trustedProxy.headers);

                                // has an actual change
                                if (oldStr != newStr) {
                                    pageData.formSettings.trustedProxy.headers = newValue;
                                }
                            },
                        }),
                    ),
                    t.div(
                        { className: "field addon" },
                        t.button(
                            {
                                type: "button",
                                className: () =>
                                    `btn sm secondary transparent ${
                                        app.utils.isEmpty(pageData.formSettings.trustedProxy.headers) ? "hidden" : ""
                                    }`,
                                onclick: () => {
                                    pageData.formSettings.trustedProxy.headers = [];
                                },
                            },
                            t.span({ className: "txt" }, "清除"),
                        ),
                    ),
                ),
                t.div(
                    { className: "field-help" },
                    "头的逗号分隔列表，例如：",
                    t.div({ className: "inline-flex gap-5" }, () => {
                        return proxyInfo.suggestedProxyHeaders.map((header) => {
                            return t.div({
                                role: "button",
                                className: "label sm link-primary",
                                onclick: () => {
                                    pageData.formSettings.trustedProxy.headers = [header];
                                },
                                textContent: header,
                            });
                        });
                    }),
                ),
            ),
            t.div(
                { className: "col-lg-3" },
                t.div(
                    { className: "field" },
                    t.label(
                        { htmlFor: "trustedProxy.useLeftmostIP" },
                        t.span({ className: "txt" }, "IP优先级"),
                        t.i({
                            className: "ri-information-line tooltip-right",
                            ariaDescription: app.attrs.tooltip(
                                "这是针对代理返回多个IP作为头值的情况。最右侧的IP通常被认为更可信，但这可能因代理而异。",
                            ),
                        }),
                    ),
                    app.components.select({
                        id: "trustedProxy.useLeftmostIP",
                        name: "trustedProxy.useLeftmostIP",
                        options: ipOptions,
                        required: true,
                        value: () => pageData.formSettings.trustedProxy.useLeftmostIP || false,
                        onchange: (selected) => {
                            pageData.formSettings.trustedProxy.useLeftmostIP = selected?.[0]?.value;
                        },
                    }),
                ),
            ),
        ),
    );
}
