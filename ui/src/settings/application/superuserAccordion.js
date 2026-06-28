export function superuserAccordion(pageData) {
    const info = store({
        isLoading: false,
        realIP: "",
    });

    async function loadInfo() {
        info.isLoading = true;

        try {
            const health = await app.pb.health.check({ requestKey: "loadSuperuserIPsInfo" });

            info.realIP = health.data?.realIP || "";
            info.isLoading = false;
        } catch (err) {
            if (!err.isAbort) {
                app.checkApiError(err);
                info.isLoading = false;
            }
        }
    }

    return t.details(
        {
            pbEvent: "superuserAccordion",
            className: "accordion superuser-accordion",
            name: "settingsAccordion",
            onmount: (el) => {
                el._ipwatcher?.unwatch();
                el._ipwatcher = watch(
                    () => JSON.stringify(app.store.settings?.trustedProxy?.headers),
                    (newHash, oldHash) => {
                        if (newHash != oldHash) {
                            loadInfo();
                        }
                    },
                );
            },
            onunmount: (el) => {
                el._ipwatcher?.unwatch();
            },
        },
        t.summary(
            null,
            t.i({ className: "ri-fingerprint-2-line", ariaHidden: true }),
            t.span({ className: "txt" }, "超级用户IP"),
            t.div({ className: "flex-fill" }),
            () => {
                if (pageData.formSettings?.superuserIPs?.length) {
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
            { className: "content m-b-sm" },
            t.p(null, "超级用户允许的IP和子网的逗号分隔列表。"),
            t.p(
                null,
                "启用此选项极大地有助于加强应用程序的安全性，因为即使有人获取了超级用户的认证令牌，他们也无法使用它。",
            ),
            t.p(
                null,
                "如果您的IP发生更改，您可以随时使用 ",
                t.a(
                    {
                        href: import.meta.env.PB_SUPERUSER_IPS_RESET_DOCS,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "link-primary txt-bold txt-sm",
                    },
                    t.code(
                        null,
                        "superuser ips",
                        t.i({ ariaHidden: true, className: "ri-arrow-right-up-line txt-sm" }),
                    ),
                ),
                " 控制台命令重置该字段值。",
            ),
        ),
        t.div(
            { className: "fields" },
            t.div(
                { className: "field" },
                t.label(
                    { htmlFor: "superuserIPs" },
                    t.span({ className: "txt" }, "超级用户IP和子网"),
                ),
                t.input({
                    id: "superuserIPs",
                    name: "superuserIPs",
                    type: "text",
                    placeholder: "留空表示不限制",
                    value: () => app.utils.joinNonEmpty(pageData.formSettings.superuserIPs),
                    oninput: (e) => {
                        const newValue = app.utils.splitNonEmpty(e.target.value, ",");
                        const newStr = app.utils.joinNonEmpty(newValue);
                        const oldStr = app.utils.joinNonEmpty(pageData.formSettings.superuserIPs);

                        // has an actual change
                        if (oldStr != newStr) {
                            pageData.formSettings.superuserIPs = newValue;
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
                                app.utils.isEmpty(pageData.formSettings.superuserIPs) ? "hidden" : ""
                            }`,
                        onclick: () => {
                            pageData.formSettings.superuserIPs = [];

                            if (app.store.errors?.superuserIPs) {
                                delete app.store.errors.superuserIPs;
                            }
                        },
                    },
                    t.span({ className: "txt" }, "清除"),
                ),
            ),
        ),
        t.div(
            { className: "field-help" },
            "IP和子网的逗号分隔列表，例如：",
            t.div(
                { className: "inline-flex gap-5" },
                t.div({
                    role: "button",
                    className: "label sm link-primary",
                    onclick: () => {
                        if (info.isLoading) {
                            return;
                        }

                        const ips = app.utils.toArray(pageData.formSettings.superuserIPs);
                        app.utils.pushUnique(ips, info.realIP);
                        pageData.formSettings.superuserIPs = ips;
                    },
                    textContent: () => info.isLoading ? "..." : (info.realIP + " (you)"),
                }),
            ),
        ),
    );
}
