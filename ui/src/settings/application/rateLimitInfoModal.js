export let basePredefinedTags = [
    { value: "*:list" },
    { value: "*:view" },
    { value: "*:create" },
    { value: "*:update" },
    { value: "*:delete" },
    { value: "*:file", description: "针对文件下载端点" },
    { value: "*:listAuthMethods" },
    { value: "*:authRefresh" },
    { value: "*:auth", description: "针对所有认证方法" },
    { value: "*:authWithPassword" },
    { value: "*:authWithOAuth2" },
    { value: "*:authWithOTP" },
    { value: "*:requestOTP" },
    { value: "*:requestPasswordReset" },
    { value: "*:confirmPasswordReset" },
    { value: "*:requestVerification" },
    { value: "*:confirmVerification" },
    { value: "*:requestEmailChange" },
    { value: "*:confirmEmailChange" },
];

export function openRateLimitInfoModal() {
    const modal = rateLimitInfoModal();

    document.body.appendChild(modal);

    app.modals.open(modal);
}

function rateLimitInfoModal() {
    return t.div(
        {
            pbEvent: "rateLimitInfoModal",
            className: "modal rate-limit-info-modal",
            onafterclose: (el) => {
                el?.remove();
            },
        },
        t.header({ className: "modal-header" }, t.h5(null, "速率限制标签格式")),
        t.div(
            { className: "modal-content" },
            t.p(null, "速率限制规则按以下顺序解析（在第一个匹配时停止）："),
            t.ol(
                null,
                t.li(null, "精确标签（例如 ", t.code(null, "users:create")),
                t.li(null, "通配符标签（例如 ", t.code(null, "*:create")),
                t.li(null, "METHOD + 精确路径（例如 ", t.code(null, "POST /a/b")),
                t.li(null, "METHOD + 前缀路径（例如 ", t.code(null, "POST /a/b", t.strong(null, "/"))),
                t.li(null, "精确路径（例如 ", t.code(null, "/a/b")),
                t.li(null, "前缀路径（例如 ", t.code(null, "/a/b", t.strong(null, "/"))),
            ),
            t.p(
                null,
                `如果多个规则具有相同标签但不同的目标用户群体（例如"访客"与"认证用户"），则只考虑匹配的用户群体规则。`,
            ),
            t.hr(),
            t.p(null, "速率限制标签可以是以下格式之一："),
            t.ul(
                null,
                t.li(
                    { className: "m-b-sm" },
                    t.code(null, "[METHOD ]/my/path"),
                    " - 完整精确路由匹配（",
                    t.strong(null, "不能有尾部斜杠"),
                    "；\"METHOD\" 是可选的）。",
                    t.br(),
                    "例如：",
                    t.ul(
                        { className: "m-0" },
                        t.li(
                            null,
                            t.code(null, "/hello"),
                            " - 匹配 ",
                            t.code(null, "GET /hello"),
                            "、",
                            t.code(null, "POST /hello"),
                            " 等。",
                        ),
                        t.li(null, t.code(null, "POST /hello"), " - 仅匹配 ", t.code(null, "POST /hello")),
                    ),
                ),
                t.li(
                    { className: "m-b-sm" },
                    t.code(null, "[METHOD ]/my/prefix", t.strong(null, "/")),
                    " - 路径前缀（",
                    t.strong(null, "必须以尾部斜杠结尾；"),
                    "\"METHOD\" 是可选的）。例如：",
                    t.ul(
                        { className: "m-0" },
                        t.li(
                            null,
                            t.code(null, "/hello/"),
                            " - 匹配 ",
                            t.code(null, "GET /hello"),
                            "、",
                            t.code(null, "POST /hello/a/b/c"),
                            " 等。",
                        ),
                        t.li(
                            null,
                            t.code(null, "POST /hello/"),
                            " - 匹配 ",
                            t.code(null, "POST /hello"),
                            "、",
                            t.code(null, "POST /hello/a/b/c"),
                            " 等。",
                        ),
                    ),
                ),
                t.li(
                    { className: "m-b-0" },
                    t.code(null, "collectionName:predefinedTag"),
                    " - 针对单个集合的特定操作。",
                    " 要将规则应用于所有集合，您可以使用 ",
                    t.code(null, "*"),
                    " 通配符。例如：",
                    t.code(null, "posts:create"),
                    "、",
                    t.code(null, "users:listAuthMethods"),
                    "、",
                    t.code(null, "*:auth"),
                    "。",
                    t.br(),
                    "预定义的集合标签有（",
                    t.em(null, "开始输入后应有自动完成"),
                    "）：",
                    t.ul({ className: "m-0" }, () => {
                        return basePredefinedTags.map((tag) => {
                            return t.li(null, tag.value.replace("*:", ":"), () => {
                                if (tag.description) {
                                    return t.em({ className: "txt-hint" }, " (", tag.description, ")");
                                }
                            });
                        });
                    }),
                ),
            ),
        ),
        t.footer(
            { className: "modal-footer" },
            t.button(
                {
                    type: "button",
                    className: "btn transparent m-r-auto",
                    onclick: () => app.modals.close(),
                },
                t.span({ className: "txt" }, "关闭"),
            ),
        ),
    );
}
