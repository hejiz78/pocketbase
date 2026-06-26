import PocketBase, { getTokenPayload } from "pocketbase";

export function pageConfirmPasswordReset(route) {
    const token = route.params?.token || "";
    const tokenPayload = getTokenPayload(token);

    if (!tokenPayload.email || !tokenPayload.collectionId) {
        app.toasts.error("密码重置令牌无效或已过期。");
        window.location.hash = "#/";
        return;
    }

    app.store.title = "确认密码重置";

    const data = store({
        newPassword: "",
        newPasswordConfirm: "",
        showNewPassword: false,
        showNewPasswordConfirm: false,
        isSubmitting: false,
        isSuccess: false,
    });

    async function submit() {
        if (data.isSubmitting) {
            return;
        }

        data.isSubmitting = true;

        // init a custom client to avoid interfering with the superuser state
        const client = new PocketBase(app.pb.baseURL);

        try {
            await client
                .collection(tokenPayload.collectionId)
                .confirmPasswordReset(token, data.newPassword, data.newPasswordConfirm);

            data.isSuccess = true;
        } catch (err) {
            app.checkApiError(err);
        }

        data.isSubmitting = false;
    }

    return t.div(
        {
            pbEvent: "pageConfirmPasswordReset",
            className: "wrapper sm m-auto p-b-base",
        },
        t.header(
            { className: "txt-center m-b-base" },
            t.img({ className: "main-logo", src: () => app.store.mainLogo, ariaHidden: true, alt: "App logo" }),
            t.h5({ className: "m-t-10" }, () => app.store.title),
        ),
        () => {
            if (data.isSuccess) {
                return t.div(
                    { pbEvent: "confirmPasswordResetAlert", className: "alert success txt-center" },
                    t.p(null, "密码已成功更改。"),
                    t.p(null, "您可以返回并使用新密码登录。"),
                );
            }

            return t.form(
                {
                    pbEvent: "confirmPasswordResetForm",
                    className: "grid confirm-password-reset-form",
                    onsubmit: (e) => {
                        e.preventDefault();
                        submit();
                    },
                },
                t.div(
                    { className: "col-12" },
                    t.div(
                        { className: "content txt-center m-b-sm" },
                        "请输入您的新密码，用于 ",
                        t.strong(null, tokenPayload.email),
                        "：",
                    ),
                    t.div(
                        { className: "fields" },
                        t.div(
                            { className: "field" },
                            t.label({ htmlFor: "newPassword" }, "新密码"),
                            t.input({
                                id: "newPassword",
                                name: "password",
                                required: true,
                                autofocus: true,
                                autocomplete: "new-password",
                                type: () => (data.showNewPassword ? "text" : "password"),
                                value: () => data.newPassword,
                                oninput: (e) => (data.newPassword = e.target.value),
                            }),
                        ),
                        t.div(
                            { className: "field addon" },
                            t.button(
                                {
                                    type: "button",
                                    tabIndex: -1,
                                    className: "btn sm transparent secondary circle tooltip-right",
                                    ariaLabel: app.attrs.tooltip(() => data.showNewPassword ? "隐藏密码" : "显示密码"),
                                    onclick: () => (data.showNewPassword = !data.showNewPassword),
                                },
                                t.i({
                                    className: () => (data.showNewPassword ? "ri-eye-off-line" : "ri-eye-line"),
                                    ariaHidden: true,
                                }),
                            ),
                        ),
                    ),
                ),
                t.div(
                    { className: "col-12" },
                    t.div(
                        { className: "fields" },
                        t.div(
                            { className: "field" },
                            t.label({ htmlFor: "newPasswordConfirm" }, "确认新密码"),
                            t.input({
                                id: "newPasswordConfirm",
                                name: "passwordConfirm",
                                required: true,
                                autocomplete: "new-password",
                                type: () => (data.showNewPasswordConfirm ? "text" : "password"),
                                value: () => data.newPasswordConfirm,
                                oninput: (e) => (data.newPasswordConfirm = e.target.value),
                            }),
                        ),
                        t.div(
                            { className: "field addon" },
                            t.button(
                                {
                                    type: "button",
                                    tabIndex: -1,
                                    className: "btn sm transparent secondary circle tooltip-right",
                                    ariaLabel: app.attrs.tooltip(() =>
                                        data.showNewPasswordConfirm ? "隐藏密码" : "显示密码"
                                    ),
                                    onclick: () => (data.showNewPasswordConfirm = !data.showNewPasswordConfirm),
                                },
                                t.i({
                                    className: () => (data.showNewPasswordConfirm ? "ri-eye-off-line" : "ri-eye-line"),
                                    ariaHidden: true,
                                }),
                            ),
                        ),
                    ),
                ),
                t.div(
                    { className: "col-12" },
                    t.button(
                        {
                            className: () => `btn lg block ${data.isSubmitting ? "loading" : ""}`,
                            disabled: () => data.isSubmitting,
                        },
                        t.span({ className: "txt" }, "设置新密码"),
                    ),
                ),
            );
        },
    );
}
