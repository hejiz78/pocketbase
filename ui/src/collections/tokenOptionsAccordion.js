export function tokenOptionsAccordion(collection) {
    const uniqueId = "token_" + app.utils.randomString();

    const data = store({
        get tokensList() {
            if (collection?.name === "_superusers") {
                return [
                    { key: "authToken", label: "认证" },
                    { key: "passwordResetToken", label: "密码重置" },
                    { key: "fileToken", label: "受保护文件" },
                ];
            }

            return [
                { key: "authToken", label: "认证" },
                { key: "verificationToken", label: "邮箱验证" },
                { key: "passwordResetToken", label: "密码重置" },
                { key: "emailChangeToken", label: "邮箱变更" },
                { key: "fileToken", label: "受保护文件" },
            ];
        },
    });

    return t.details(
        {
            pbEvent: "tokenOptionsAccordion",
            name: "other",
            className: "accordion token-options-accordion",
        },
        t.summary(
            null,
            t.i({ className: "ri-key-2-line", ariaHidden: true }),
            t.span({ className: "txt", textContent: "令牌选项（失效、时长）" }),
        ),
        t.div({ className: "grid sm" }, () => {
            return data.tokensList.map((token) => {
                const fieldId = uniqueId + token.key;

                return t.div(
                    { className: "col-sm-6" },
                    t.div(
                        { className: "field token-field" },
                        t.label({
                            htmlFor: fieldId,
                            textContent: () => token.label + " duration (in seconds)",
                        }),
                        t.input({
                            id: fieldId,
                            type: "number",
                            min: 1,
                            step: 1,
                            required: true,
                            name: () => token.key + ".duration",
                            value: () => collection[token.key].duration,
                            oninput: (e) => (collection[token.key].duration = parseInt(e.target.value, 10)),
                        }),
                    ),
                    t.div(
                        { className: "field-help m-b-10" },
                        t.button({
                            type: "button",
                            className: () => `link-hint ${collection[token.key].secret ? "txt-success" : ""}`,
                            textContent: "使所有之前签发的令牌失效",
                            onclick: () => {
                                // toggle
                                if (collection[token.key].secret) {
                                    delete collection[token.key].secret;
                                } else {
                                    collection[token.key].secret = app.utils.randomSecret(50);
                                }
                            },
                        }),
                    ),
                );
            });
        }),
    );
}
