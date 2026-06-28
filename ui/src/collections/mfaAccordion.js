export function mfaAccordion(collection) {
    const uniqueId = "mfa_" + app.utils.randomString();

    const data = store({
        get config() {
            if (!collection.mfa) {
                collection.mfa = {
                    enabled: false,
                    duration: 600,
                    rule: "",
                };
            }

            return collection.mfa;
        },
        get isSuperusers() {
            return collection.system && collection.name == "_superusers";
        },
    });

    return t.details(
        {
            pbEvent: "mfaAccordion",
            name: "auth-methods",
            className: "accordion mfa-accordion",
        },
        t.summary(
            null,
            t.i({ className: "ri-shield-check-line", ariaHidden: true }),
            t.span({ className: "txt", textContent: "多因素认证（MFA）" }),
            t.span({
                className: () => `label m-l-auto ${data.config.enabled ? "success" : ""}`,
                textContent: () => (data.config.enabled ? "已启用" : "已禁用"),
            }),
            () => {
                if (!app.store.errors?.mfa) {
                    return;
                }

                return t.i({
                    className: "ri-error-warning-fill txt-danger",
                    ariaDescription: app.attrs.tooltip("存在错误", "left"),
                });
            },
        ),
        t.div(
            { className: "grid sm" },
            t.div(
                { className: "col-sm-12" },
                t.div(
                    { className: "alert info" },
                    t.div(
                        { className: "content" },
                        t.p(
                            null,
                            "Multi-factor authentication (MFA) requires the user to authenticate with any 2 different auth methods (otp, identity/password, oauth2) before issuing an auth token. ",
                            t.a({
                                href: import.meta.env.PB_MFA_DOCS,
                                className: "link-hint",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                textContent: "了解更多。",
                            }),
                        ),
                    ),
                ),
            ),
            t.div(
                { className: "col-sm-12" },
                t.div(
                    { className: "field" },
                    t.input({
                        type: "checkbox",
                        id: uniqueId + ".enabled",
                        name: "mfa.enabled",
                        className: "switch",
                        checked: () => data.config.enabled,
                        onchange: (e) => {
                            data.config.enabled = e.target.checked;

                            if (data.isSuperusers) {
                                collection.otp.enabled = e.target.checked;
                            }
                        },
                    }),
                    t.label({
                        htmlFor: uniqueId + ".enabled",
                        textContent: "启用",
                    }),
                ),
            ),
            t.div(
                { className: "col-sm-12" },
                t.div(
                    { className: "field" },
                    t.label({
                        htmlFor: uniqueId + ".duration",
                        textContent: "两次认证之间的最大间隔（秒）",
                    }),
                    t.input({
                        type: "number",
                        id: uniqueId + ".duration",
                        name: "mfa.duration",
                        min: 1,
                        step: 1,
                        required: true,
                        value: () => data.config.duration || "",
                        oninput: (e) => (data.config.duration = parseInt(e.target.value, 10)),
                    }),
                ),
            ),
            t.div(
                { className: "col-sm-12" },
                app.components.ruleField({
                    label: "MFA规则",
                    id: uniqueId + ".rule",
                    name: "mfa.rule",
                    nullable: false,
                    placeholder: "留空表示对所有用户要求MFA",
                    autocomplete: (word) => {
                        return app.utils.collectionAutocompleteKeys(collection, word);
                    },
                    value: () => data.config.rule || "",
                    oninput: (newVal) => (data.config.rule = newVal),
                }),
                t.div(
                    { className: "field-help" },
                    t.p(null, "此可选规则可用于在账户级别启用/禁用MFA。"),
                    t.p(
                        null,
                        "例如，要仅对非空邮箱的账户要求MFA，可以设置为",
                        t.code(null, "email != ''"),
                        ".",
                    ),
                    t.p(null, "将规则留空表示对所有人要求MFA。"),
                ),
            ),
        ),
    );
}
