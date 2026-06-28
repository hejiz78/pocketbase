import { emailTemplateAccordion } from "./emailTemplateAccordion";
import { mfaAccordion } from "./mfaAccordion";
import { oauth2Accordion } from "./oauth2Accordion";
import { otpAccordion } from "./otpAccordion";
import { passwordAuthAccordion } from "./passwordAuthAccordion";
import { tokenOptionsAccordion } from "./tokenOptionsAccordion";

export function collectionAuthOptionsTab(upsertData) {
    const uniqueId = "options_" + app.utils.randomString();

    return t.div(
        { className: "collection-tab-content collection-options-tab-content" },
        t.div(
            { className: "grid" },
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "section-heading" },
                    t.strong(null, "认证方式"),
                    t.div({ className: "flex-fill" }),
                    t.div(
                        { className: "field" },
                        t.input({
                            id: uniqueId + ".authAlert",
                            name: "authAlert.enabled",
                            type: "checkbox",
                            className: "switch sm",
                            checked: () => !!upsertData.collection.authAlert?.enabled,
                            onchange: (e) => {
                                upsertData.collection.authAlert = upsertData.collection.authAlert || {};
                                upsertData.collection.authAlert.enabled = e.target.checked;
                            },
                        }),
                        t.label({ htmlFor: uniqueId + ".authAlert" }, "新登录时发送邮件提醒"),
                    ),
                ),
                passwordAuthAccordion(upsertData.collection),
                () => {
                    if (upsertData.originalCollection?.name == "_superusers") {
                        return;
                    }

                    return oauth2Accordion(upsertData.collection);
                },
                otpAccordion(upsertData.collection),
                mfaAccordion(upsertData.collection),
            ),
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "section-heading" },
                    t.strong(null, "邮件模板"),
                    t.button({
                        tabIndex: -1,
                        type: "buttton",
                        className: "m-l-auto label handle txt-bold",
                        textContent: "发送测试邮件",
                        onclick: () => app.modals.openMailTest(upsertData.collection?.name),
                    }),
                ),
                emailTemplateAccordion(upsertData.collection, "verificationTemplate", {
                    title: "默认验证邮件模板",
                    placeholders: ["{APP_NAME}", "{APP_URL}", "{RECORD:*}", "{TOKEN}"],
                }),
                emailTemplateAccordion(upsertData.collection, "resetPasswordTemplate", {
                    title: "默认密码重置邮件模板",
                    placeholders: ["{APP_NAME}", "{APP_URL}", "{RECORD:*}", "{TOKEN}"],
                }),
                emailTemplateAccordion(upsertData.collection, "confirmEmailChangeTemplate", {
                    title: "默认确认邮箱变更邮件模板",
                    placeholders: ["{APP_NAME}", "{APP_URL}", "{RECORD:*}", "{TOKEN}"],
                }),
                emailTemplateAccordion(upsertData.collection, "otp.emailTemplate", {
                    title: "默认OTP邮件模板",
                    placeholders: ["{APP_NAME}", "{APP_URL}", "{RECORD:*}", "{OTP}", "{OTP_ID}"],
                }),
                emailTemplateAccordion(upsertData.collection, "authAlert.emailTemplate", {
                    title: "默认登录提醒邮件模板",
                    placeholders: ["{APP_NAME}", "{APP_URL}", "{RECORD:*}", "{ALERT_INFO}"],
                }),
            ),
            t.div(
                { className: "col-12" },
                t.div({ className: "section-heading" }, t.strong(null, "其他")),
                tokenOptionsAccordion(upsertData.collection),
            ),
        ),
    );
}
