window.app = window.app || {};
window.app.modals = window.app.modals || {};

window.app.modals.openApiPreview = function(collection, settings = {
    onbeforeopen: null,
    onafteropen: null,
    onbeforeclose: null,
    onafterclose: null,
}) {
    const modal = apiPreviewModal(collection, settings);
    if (!modal) {
        return;
    }

    document.body.appendChild(modal);

    app.modals.open(modal);
};

function apiPreviewModal(collection, settings) {
    if (!collection) {
        console.warn("[apiPreviewModal] missing required collection");
        return;
    }

    let modal;

    const data = store({
        activeTab: "列表/搜索",
        tabEl: null,
        isLoading: false,
    });

    const docs = {
        "列表/搜索": async (collection) => {
            const { docsList } = await import("./docsList");
            return data.tabEl = docsList(collection);
        },
        "查看": async (collection) => {
            const { docsView } = await import("./docsView");
            return data.tabEl = docsView(collection);
        },
    };

    if (collection.type != "view") {
        docs["创建"] = async (collection) => {
            const { docsCreate } = await import("./docsCreate");
            return data.tabEl = docsCreate(collection);
        };

        docs["更新"] = async (collection) => {
            const { docsUpdate } = await import("./docsUpdate");
            return data.tabEl = docsUpdate(collection);
        };

        docs["删除"] = async (collection) => {
            const { docsDelete } = await import("./docsDelete");
            return data.tabEl = docsDelete(collection);
        };

        docs["实时"] = async (collection) => {
            const { docsRealtime } = await import("./docsRealtime");
            return data.tabEl = docsRealtime(collection);
        };

        docs["批量"] = async (collection) => {
            const { docsBatch } = await import("./docsBatch");
            return data.tabEl = docsBatch(collection);
        };
    }

    if (collection.type == "auth") {
        docs[""] = null; // hr

        docs["列出认证方法"] = async (collection) => {
            const { docsListAuthMethods } = await import("./docsListAuthMethods");
            return data.tabEl = docsListAuthMethods(collection);
        };

        docs["密码认证"] = collection.passwordAuth?.enabled
            ? async (collection) => {
                const { docsAuthWithPassword } = await import("./docsAuthWithPassword");
                return data.tabEl = docsAuthWithPassword(collection);
            }
            : null;

        if (collection.name != "_superusers") {
            docs["OAuth2认证"] = collection.oauth2?.enabled
                ? async (collection) => {
                    const { docsAuthWithOAuth2 } = await import("./docsAuthWithOAuth2");
                    return data.tabEl = docsAuthWithOAuth2(collection);
                }
                : null;
        }

        docs["OTP认证"] = collection.otp?.enabled
            ? async (collection) => {
                const { docsAuthWithOTP } = await import("./docsAuthWithOTP");
                return data.tabEl = docsAuthWithOTP(collection);
            }
            : null;

        docs["刷新认证"] = async (collection) => {
            const { docsAuthRefresh } = await import("./docsAuthRefresh");
            return data.tabEl = docsAuthRefresh(collection);
        };

        if (collection.name != "_superusers") {
            docs["验证"] = async (collection) => {
                const { docsVerification } = await import("./docsVerification");
                return data.tabEl = docsVerification(collection);
            };
        }

        docs["密码重置"] = async (collection) => {
            const { docsPasswordReset } = await import("./docsPasswordReset");
            return data.tabEl = docsPasswordReset(collection);
        };

        docs["邮箱变更"] = async (collection) => {
            const { docsEmailChange } = await import("./docsEmailChange");
            return data.tabEl = docsEmailChange(collection);
        };
    }

    const watchers = [
        watch(() => data.activeTab, async () => {
            data.isLoading = true;
            await docs[data.activeTab]?.(collection);
            data.isLoading = false;
        }),
    ];

    modal = t.div(
        {
            pbEvent: "apiPreviewModal",
            className: "modal api-preview-modal",
            onbeforeopen: (el) => {
                return settings.onbeforeopen?.(el);
            },
            onafteropen: (el) => {
                settings.onafteropen?.(el);
            },
            onbeforeclose: (el) => {
                return settings.onbeforeclose?.(el);
            },
            onafterclose: (el) => {
                settings.onafterclose?.(el);
                watchers.forEach((w) => w?.unwatch());
                el?.remove();
            },
            onmount: (el) => {
            },
            onunmount: (el) => {
                watchers.forEach((w) => w?.unwatch());
            },
        },
        t.div(
            { className: "modal-content" },
            t.aside(
                { className: "api-preview-sidebar" },
                t.nav(
                    { className: "api-preview-nav" },
                    () => {
                        const items = [];

                        for (let title in docs) {
                            if (!title) {
                                items.push(t.hr());
                                continue;
                            }

                            const isDisabled = !docs[title];

                            items.push(
                                t.button(
                                    {
                                        type: "button",
                                        className: () => `nav-item ${data.activeTab == title ? "active" : ""}`,
                                        disabled: isDisabled,
                                        ariaDescription: app.attrs.tooltip(
                                            () => isDisabled ? "该集合未启用" : "",
                                            "left",
                                        ),
                                        onclick: () => {
                                            if (!isDisabled) {
                                                data.activeTab = title;
                                            }
                                        },
                                    },
                                    title,
                                ),
                            );
                        }

                        return items;
                    },
                ),
            ),
            t.div(
                {
                    className: () => `api-preview-content ${data.isLoading ? "faded" : ""}`,
                    // always scroll to the top of the new doc
                    scrollTop: () => data.activeTab ? 0 : null,
                },
                t.header(
                    { className: "api-preview-content-header" },
                    t.h6(null, () => data.activeTab + ` (${collection.name})`),
                    t.button(
                        {
                            type: "button",
                            className: () =>
                                `btn sm circle transparent secondary m-l-auto preview-close-btn ${
                                    data.isLoading ? "loading" : ""
                                }`,
                            title: "关闭",
                            onclick: () => app.modals.close(modal),
                        },
                        t.i({ className: "ri-close-line", ariaHidden: true }),
                    ),
                ),
                () => data.tabEl,
            ),
        ),
    );

    return modal;
}
