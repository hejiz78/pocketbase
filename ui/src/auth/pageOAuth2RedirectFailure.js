export function pageOAuth2RedirectFailure(route) {
    app.store.title = "OAuth2 认证失败";

    window.close();

    return t.div(
        { pbEvent: "pageOAuth2RedirectFailure", className: "page" },
        t.div(
            { className: "page-content" },
            t.header(
                { className: "txt-center p-base" },
                t.h3({ className: "primary-heading m-b-sm" }, "认证失败。"),
                t.h6(
                    { className: "secondary-heading" },
                    "您可以关闭此窗口并返回应用重试。",
                ),
            ),
        ),
    );
}
