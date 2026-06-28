const TEST_REQUEST_KEY = "test_view_query";

export function collectionViewQueryTab(upsertData) {
    const uniqueId = "query_" + app.utils.randomString();

    // dprint-ignore
    const autocomplete = [
        "SELECT", "FROM", "WHERE", "LEFT JOIN", "INNER JOIN", "ON",
        "AS", "GROUP BY", "HAVING", "ORDER BY", "ASC", "DESC", "LIMIT",
        "OFFSET", "WITH", "NOT", "IN", "AND", "OR", "EXISTS", "LIKE",
        "CAST", "REAL", "DECIMAL", "NUMERIC", "INT", "TEXT", "BOOL",
    ];

    const local = store({
        testRecords: [],
        testError: "",
        isTesting: false,
    });

    async function dryRunViewQuery(query) {
        local.isTesting = true;

        local.testRecords = [];

        // reset form errors related to the query
        if (app.store.errors?.viewQuery || app.store.errors?.fields) {
            delete app.store.errors.viewQuery;
            delete app.store.errors.fields;
        }

        if (!query) {
            local.testError = "";
            local.isTesting = false;
            return;
        }

        try {
            const result = await app.pb.collections.dryRunViewQuery(query, {
                requestKey: TEST_REQUEST_KEY,
            });

            if (upsertData.collection?.id) {
                // replace the collection meta fields
                local.testRecords = result.sample.map((r) => {
                    r.collectionId = upsertData.collection?.id;
                    r.collectionName = upsertData.collection?.name;
                    return r;
                });
            } else {
                local.testRecords = result.sample;
            }

            local.testError = "";
            local.isTesting = false;
        } catch (err) {
            if (!err.isAbort) {
                local.testError = err.message || "无效的查询。";
                local.isTesting = false;
            }
        }
    }

    let testDebounceId;

    const watchers = [
        watch(() => upsertData.collection?.viewQuery, (newQuery) => {
            clearTimeout(testDebounceId);
            testDebounceId = setTimeout(() => dryRunViewQuery(newQuery), 200);
        }),
    ];

    return t.div(
        {
            pbEvent: "collectionViewQueryTabContent",
            className: "collection-tab-content collection-view-query-tab-content",
            onunmount: () => {
                clearTimeout(testDebounceId);
                app.pb.cancelRequest(TEST_REQUEST_KEY);
                watchers.forEach((w) => w?.unwatch());
            },
        },
        t.div(
            { className: "grid" },
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "txt-right txt-sm m-b-10" },
                    t.button(
                        {
                            type: "button",
                            className: "txt-bold link-hint",
                            "html-popovertarget": uniqueId + "caveats_dropdown",
                        },
                        () => "查询注意事项",
                    ),
                ),
                t.div(
                    {
                        id: uniqueId + "caveats_dropdown",
                        className: "dropdown sm query-caveats-dropdown",
                        popover: "auto",
                    },
                    t.ul(
                        null,
                        t.li(null, "不支持通配符列（*）。"),
                        t.li(
                            null,
                            "查询必须具有唯一的",
                            t.code(null, "id"),
                            " column.",
                            t.br(),
                            "如果您的查询没有合适的，可以使用通用的",
                            t.code(null, "(ROW_NUMBER() OVER()) as id"),
                            ".",
                        ),
                        t.li(
                            null,
                            "表达式必须使用有效格式的字段名作为别名，例如",
                            t.code(null, "MAX(balance) as maxBalance"),
                            ".",
                        ),
                        t.li(
                            null,
                            "组合/多空格表达式必须用括号包裹，例如",
                            t.code(null, "(MAX(balance) + 1) as maxBalance"),
                            ".",
                        ),
                        t.li(
                            null,
                            "UNION expressions are supported but the entire query must be wrapped in parenthesis.",
                        ),
                    ),
                ),
                t.div(
                    { className: "field" },
                    t.label(
                        { htmlFor: uniqueId + ".viewQuery" },
                        t.span({ className: "txt" }, "查询语句"),
                        t.span(
                            {
                                hidden: () => !local.testError,
                                className: "query-state",
                                ariaDescription: app.attrs.tooltip("无效的查询", "left"),
                            },
                            t.i({ className: "ri-error-warning-fill txt-danger", ariaHidden: true }),
                        ),
                        t.span(
                            {
                                hidden: () => !!local.testError,
                                className: "query-state",
                                ariaDescription: app.attrs.tooltip("有效的查询", "left"),
                            },
                            t.i({ className: "ri-checkbox-circle-fill txt-success", ariaHidden: true }),
                        ),
                    ),
                    app.components.codeEditor({
                        id: uniqueId + ".viewQuery",
                        name: "viewQuery",
                        language: "sql",
                        required: true,
                        autocomplete: autocomplete,
                        className: "inline-error",
                        value: () => upsertData.collection.viewQuery || "",
                        oninput: (newVal) => {
                            upsertData.collection.viewQuery = newVal;
                        },
                    }),
                ),
            ),
            t.div(
                { className: "col-12" },
                t.p(
                    { className: "txt-sm txt-bold" },
                    "示例输出：",
                ),
                t.div(
                    { className: "view-query-sample-wrapper" },
                    t.span({ hidden: () => !local.isTesting, className: "loader sm" }),
                    app.components.codeBlock({
                        language: () => local.testError ? "plain" : "js",
                        className: () => `view-query-sample ${local.testError ? "txt-danger" : ""}`,
                        value: () => {
                            if (local.testRecords?.length) {
                                return JSON.stringify(local.testRecords, null, 2);
                            }

                            return local.testError || "N/A";
                        },
                    }),
                ),
            ),
        ),
    );
}
