export function collectionRulesTab(upsertData) {
    const local = store({
        showRulesInfo: false,
        showAuthRules: false,
    });

    const systemRuleTooltip = () =>
        app.attrs.tooltip(
            upsertData.originalCollection?.system ? "系统集合规则无法更改。" : null,
            "top-left",
        );

    function autocomplete(word) {
        return app.utils.collectionAutocompleteKeys(upsertData.collection, word);
    }

    return t.div(
        { className: "collection-tab-content collection-rules-tab-content" },
        t.div(
            { className: "grid" },
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "flex txt-hint txt-sm" },
                    t.span(
                        { className: "txt" },
                        "所有规则遵循",
                        t.a({
                            target: "_blank",
                            rel: "noopener noreferrer",
                            href: import.meta.env.PB_RULES_SYNTAX_DOCS,
                            textContent: "PocketBase 筛选语法和运算符",
                        }),
                        "。",
                    ),
                    t.strong({
                        tabIndex: -1,
                        className: "m-l-auto link-hint",
                        textContent: () => (local.showRulesInfo ? "隐藏可用字段" : "显示可用字段"),
                        onclick: () => (local.showRulesInfo = !local.showRulesInfo),
                    }),
                ),
                app.components.slide(
                    () => local.showRulesInfo,
                    t.div(
                        { className: "alert warning m-t-sm" },
                        t.div(
                            { className: "content" },
                            t.p(null, "以下记录字段可用："),
                            t.div({ className: "flex flex-wrap gap-5" }, () => {
                                const identifiers = app.utils.getAllCollectionIdentifiers(upsertData.collection);
                                return identifiers.map((f) => {
                                    return t.code(null, f);
                                });
                            }),
                            t.hr({ className: "m-t-10 m-b-10" }),
                            t.p(
                                null,
                                "请求字段可通过特殊的 ",
                                t.strong(null, "@request"),
                                " 字段访问：",
                            ),
                            t.div(
                                { className: "flex flex-wrap gap-5" },
                                t.code(null, "@request.headers.*"),
                                t.code(null, "@request.query.*"),
                                t.code(null, "@request.body.*"),
                                t.code(null, "@request.auth.*"),
                            ),
                            t.hr({ className: "m-t-10 m-b-10" }),
                            t.p(
                                null,
                                "您还可以使用 ",
                                t.strong(null, "@collection"),
                                " 字段添加约束并查询其他集合：",
                            ),
                            t.div(
                                { className: "flex flex-wrap gap-5" },
                                t.code(null, "@collection.ANY_COLLECTION_NAME.*"),
                            ),
                            t.hr({ className: "m-t-10 m-b-10" }),
                            t.p(null, "示例规则："),
                            () => {
                                const dateField = upsertData.collection.fields?.find(
                                    (f) => f.type == "date" || f.type == "autodate",
                                );
                                if (dateField) {
                                    return t.code(
                                        null,
                                        `@request.auth.id != "" && ${dateField.name} > "2022-01-01 00:00:00.000Z"`,
                                    );
                                }
                                return t.code(null, `@request.auth.id != ""`);
                            },
                        ),
                    ),
                ),
            ),
            t.div(
                { className: "col-12", ariaDescription: systemRuleTooltip() },
                app.components.ruleField({
                    label: "列表/搜索规则",
                    name: "listRule",
                    autocomplete: autocomplete,
                    disabled: () => upsertData.originalCollection?.system,
                    value: () => upsertData.collection.listRule,
                    oninput: (val) => (upsertData.collection.listRule = val),
                }),
            ),
            t.div(
                { className: "col-12", ariaDescription: systemRuleTooltip() },
                app.components.ruleField({
                    label: "查看规则",
                    name: "viewRule",
                    autocomplete: autocomplete,
                    disabled: () => upsertData.originalCollection?.system,
                    value: () => upsertData.collection.viewRule,
                    oninput: (val) => (upsertData.collection.viewRule = val),
                }),
            ),
            () => {
                // view collections has only List and View API rules
                if (upsertData.collection.type == "view") {
                    return;
                }

                return [
                    t.div(
                        { className: "col-12", ariaDescription: systemRuleTooltip() },
                        app.components.ruleField({
                            label: [
                                t.span({ className: "txt", textContent: "创建规则" }),
                                t.i({
                                    hidden: () => upsertData.collection.createRule == null,
                                    className: "ri-information-line link-hint",
                                    ariaDescription: app.attrs.tooltip(
                                        "主记录字段保存将插入数据库的值。",
                                    ),
                                }),
                            ],
                            name: "createRule",
                            autocomplete: autocomplete,
                            disabled: () => upsertData.originalCollection?.system,
                            value: () => upsertData.collection.createRule,
                            oninput: (val) => (upsertData.collection.createRule = val),
                        }),
                    ),
                    t.div(
                        { className: "col-12", ariaDescription: systemRuleTooltip() },
                        app.components.ruleField({
                            label: [
                                t.span({ className: "txt", textContent: "更新规则" }),
                                t.i({
                                    hidden: () => upsertData.collection.updateRule == null,
                                    className: "ri-information-line link-hint",
                                    ariaDescription: app.attrs.tooltip(
                                        "主记录字段保存旧的/现有的记录字段值。\n要定位新提交的值，可使用 @request.body.*。",
                                    ),
                                }),
                            ],
                            name: "updateRule",
                            autocomplete: autocomplete,
                            disabled: () => upsertData.originalCollection?.system,
                            value: () => upsertData.collection.updateRule,
                            oninput: (val) => (upsertData.collection.updateRule = val),
                        }),
                    ),
                    t.div(
                        { className: "col-12", ariaDescription: systemRuleTooltip() },
                        app.components.ruleField({
                            label: "删除规则",
                            name: "deleteRule",
                            autocomplete: autocomplete,
                            disabled: () => upsertData.originalCollection?.system,
                            value: () => upsertData.collection.deleteRule,
                            oninput: (val) => (upsertData.collection.deleteRule = val),
                        }),
                    ),
                ];
            },
        ),
        // auth specific fields
        () => {
            if (upsertData.collection.type != "auth") {
                return;
            }

            return [
                t.hr({ className: "m-t-base m-b-base" }),
                t.button(
                    {
                        type: "button",
                        onmount: () => {
                            local.showAuthRules = upsertData.collection.manageRule !== null
                                || upsertData.collection.authRule !== "";
                        },
                        className: () => `btn secondary sm ${local.showAuthRules ? "" : "transparent"}`,
                        onclick: () => {
                            local.showAuthRules = !local.showAuthRules;
                        },
                    },
                    t.span({ className: "txt" }, "额外的认证集合规则"),
                    t.i({
                        ariaHidden: true,
                        className: () => (local.showAuthRules ? "ri-arrow-drop-up-line" : "ri-arrow-drop-down-line"),
                    }),
                ),
                app.components.slide(
                    () => local.showAuthRules,
                    t.div(
                        { className: "grid sm m-t-sm" },
                        t.div(
                            { className: "col-12", ariaDescription: systemRuleTooltip() },
                            app.components.ruleField({
                                label: "认证规则",
                                name: "authRule",
                                placeholder: "",
                                autocomplete: autocomplete,
                                disabled: () => upsertData.originalCollection?.system,
                                value: () => upsertData.collection.authRule,
                                oninput: (val) => (upsertData.collection.authRule = val),
                            }),
                            t.div(
                                { className: "field-help" },
                                t.p(
                                    null,
                                    "此规则在每次",
                                    t.strong(null, "认证前"),
                                    "执行，允许您限制谁可以进行认证。",
                                ),
                                t.p(
                                    null,
                                    "例如，要仅允许已验证用户，您可以将其设置为 ",
                                    t.code(null, "verified = true"),
                                    "。",
                                ),
                                t.p(null, "留空则允许任何拥有账户的用户进行认证。"),
                                t.p(
                                    null,
                                    `要完全禁用认证，您可以将其更改为"仅限超级用户"。`,
                                ),
                            ),
                        ),
                        t.div(
                            { className: "col-12", ariaDescription: systemRuleTooltip() },
                            app.components.ruleField({
                                label: "管理规则",
                                name: "manageRule",
                                autocomplete: autocomplete,
                                disabled: () => upsertData.originalCollection?.system,
                                value: () => upsertData.collection.manageRule,
                                oninput: (val) => (upsertData.collection.manageRule = val),
                            }),
                            t.div(
                                { className: "field-help" },
                                t.p(
                                    null,
                                    "此规则在 ",
                                    t.strong(null, "创建"),
                                    " 和 ",
                                    t.strong(null, "更新"),
                                    " API 规则之外额外执行。",
                                ),
                                t.p(
                                    null,
                                    "它启用类似超级用户的权限，允许完全管理认证记录，例如无需输入旧密码即可更改密码、直接更新验证状态或邮箱等。",
                                ),
                            ),
                        ),
                    ),
                ),
            ];
        },
    );
}
