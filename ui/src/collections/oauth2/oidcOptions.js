window.app = window.app || {};
window.app.oauth2 = window.app.oauth2 || {};

// note: data is the providerSettingsModal form store
window.app.oauth2.oidc = function(providerInfo, namePrefix, data) {
    const uniqueId = "oidc_" + app.utils.randomString();

    const userInfoOptions = [
        { label: "用户信息URL", value: true },
        { label: "ID Token", value: false },
    ];

    const local = store({
        useUserInfoUrl: false,
    });

    const watchers = [];

    return t.div(
        {
            pbEvent: "oauth2OIDCOptions",
            className: "oauth2-oidc-options",
            // init defaults
            onmount: (el) => {
                if (typeof data.config.displayName == "undefined") {
                    data.config.displayName = "OIDC";
                }

                if (typeof data.config.pkce == "undefined") {
                    data.config.pkce = true;
                }

                if (data.config.userInfoURL || !data.config.extra) {
                    local.useUserInfoUrl = true;
                }

                // unset the id_token or info url fields based on the toggle state
                watchers.push(
                    watch(() => local.useUserInfoUrl, (useURL, oldUseURL) => {
                        if (useURL) {
                            // note: null because {} will just result in JSON unmarshal merge with the existing data
                            data.config.extra = null;
                        } else {
                            data.config.userInfoURL = "";
                            // note: fallback to empty object to distinguish from the null state since all id_token fields are optional
                            data.config.extra = data.config.extra || {};
                        }
                    }),
                );
            },
            onunmount: () => {
                watchers.forEach((w) => w?.unwatch());
            },
        },
        t.div(
            { className: "grid" },
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "field" },
                    t.label({ htmlFor: uniqueId + ".displayName" }, "显示名称"),
                    t.input({
                        id: uniqueId + ".displayName",
                        name: namePrefix + ".displayName",
                        type: "text",
                        required: true,
                        value: () => data.config.displayName || "",
                        oninput: (e) => data.config.displayName = e.target.value,
                    }),
                ),
            ),
            t.div(
                { className: "col-12" },
                t.p({ className: "txt-bold" }, "端点"),
                t.div(
                    { className: "field" },
                    t.label({ htmlFor: uniqueId + ".authURL" }, "认证URL"),
                    t.input({
                        id: uniqueId + ".authURL",
                        name: namePrefix + ".authURL",
                        type: "url",
                        required: true,
                        value: () => data.config.authURL || "",
                        oninput: (e) => data.config.authURL = e.target.value,
                    }),
                ),
            ),
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "field" },
                    t.label({ htmlFor: uniqueId + ".tokenURL" }, "令牌URL"),
                    t.input({
                        id: uniqueId + ".tokenURL",
                        name: namePrefix + ".tokenURL",
                        type: "url",
                        required: true,
                        value: () => data.config.tokenURL || "",
                        oninput: (e) => data.config.tokenURL = e.target.value,
                    }),
                ),
            ),
            // User info
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "field" },
                    t.label({ htmlFor: uniqueId + ".userInfoSelect" }, "获取用户信息自"),
                    app.components.select({
                        id: uniqueId + ".userInfoSelect",
                        required: true,
                        options: userInfoOptions,
                        value: () => local.useUserInfoUrl,
                        onchange: (selectedOpts) => local.useUserInfoUrl = selectedOpts?.[0]?.value,
                    }),
                ),
                t.div({ className: "oidc-userinfo-options m-t-10" }, () => {
                    if (local.useUserInfoUrl) {
                        return t.div(
                            { className: "field" },
                            t.label({ htmlFor: uniqueId + ".userInfoURL" }, "用户信息URL"),
                            t.input({
                                id: uniqueId + ".userInfoURL",
                                name: namePrefix + ".userInfoURL",
                                type: "url",
                                required: true,
                                value: () => data.config.userInfoURL || "",
                                oninput: (e) => data.config.userInfoURL = e.target.value,
                            }),
                        );
                    }

                    return t.div(
                        { className: "grid sm" },
                        t.div(
                            { className: "col-12 txt-hint txt-sm" },
                            t.em(
                                null,
                                "这两个字段都是可选的，因为解析后的",
                                t.code(null, "id_token"),
                                " is a direct result of the TLS code->token exchange server response.",
                            ),
                        ),
                        t.div(
                            { className: "col-12" },
                            t.div(
                                { className: "field" },
                                t.label(
                                    { htmlFor: uniqueId + ".extra.jwksURL" },
                                    t.span({ className: "txt" }, "JWKS verification URL"),
                                    t.i({
                                        className: "ri-information-line link-hint",
                                        ariaDescription: app.attrs.tooltip(
                                            "URL to the public token verification keys.",
                                        ),
                                    }),
                                ),
                                t.input({
                                    id: uniqueId + ".extra.jwksURL",
                                    name: namePrefix + ".extra.jwksURL",
                                    type: "url",
                                    value: () => data.config.extra?.jwksURL || "",
                                    oninput: (e) => {
                                        data.config.extra = data.config.extra || {};
                                        data.config.extra.jwksURL = e.target.value;
                                    },
                                }),
                            ),
                        ),
                        t.div(
                            { className: "col-12" },
                            t.div(
                                { className: "field" },
                                t.label(
                                    { htmlFor: uniqueId + ".extra.issuers" },
                                    t.span({ className: "txt" }, "签发者"),
                                    t.i({
                                        className: "ri-information-line link-hint",
                                        ariaDescription: app.attrs.tooltip(
                                            "用于iss令牌声明验证的可接受值，以逗号分隔。",
                                        ),
                                    }),
                                ),
                                t.input({
                                    id: uniqueId + ".extra.issuers",
                                    name: namePrefix + ".extra.issuers",
                                    type: "text",
                                    value: () => app.utils.joinNonEmpty(data.config.extra?.issuers),
                                    oninput: (e) => {
                                        const newValue = app.utils.splitNonEmpty(e.target.value, ",");
                                        const newStr = app.utils.joinNonEmpty(newValue);
                                        const oldStr = app.utils.joinNonEmpty(data.config.extra?.issuers);

                                        // has an actual change
                                        if (oldStr != newStr) {
                                            data.config.extra = data.config.extra || {};
                                            data.config.extra.issuers = newValue;
                                        }
                                    },
                                }),
                            ),
                        ),
                    );
                }),
            ),
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "field" },
                    t.input({
                        id: uniqueId + ".pkce",
                        name: namePrefix + ".pkce",
                        type: "checkbox",
                        checked: () => data.config.pkce || false,
                        onchange: (e) => data.config.pkce = e.target.checked,
                    }),
                    t.label(
                        { htmlFor: uniqueId + ".pkce" },
                        t.span({ className: "txt", textContent: "支持PKCE" }),
                        t.i({
                            className: "ri-information-line link-hint",
                            ariaDescription: app.attrs.tooltip(
                                "通常始终启用是安全的，因为大多数提供商在不支持PKCE时会忽略额外的查询参数。",
                            ),
                        }),
                    ),
                ),
            ),
        ),
    );
};

window.app.oauth2.oidc2 = window.app.oauth2.oidc;
window.app.oauth2.oidc3 = window.app.oauth2.oidc;
