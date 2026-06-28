import { defaultLogLevels } from "./defaultLogLevels";

window.app = window.app || {};
window.app.modals = window.app.modals || {};

window.app.modals.openLogsSettings = function(modalSettings = {
    onbeforeopen: null,
    onafteropen: null,
    onbeforeclose: null,
    onafterclose: null,
    onsave: null,
}) {
    const modal = logsSettingsModal(modalSettings);
    if (!modal) {
        return;
    }

    document.body.appendChild(modal);

    app.modals.open(modal);
};

function logsSettingsModal(modalSettings) {
    let modal;

    const data = store({
        isLoading: false,
        isSaving: false,
        formSettings: {},
        initFormSettingsHash: "",
        get hasChanges() {
            return data.initFormSettingsHash != JSON.stringify(data.formSettings);
        },
    });

    function init(settings = {}) {
        data.formSettings = {
            logs: settings?.logs || {},
        };

        data.initFormSettingsHash = JSON.stringify(data.formSettings);
    }

    async function loadSettings() {
        data.isLoading = true;

        try {
            const settings = await app.pb.settings.getAll({
                requestKey: "logsSettings",
            });

            init(settings);

            data.isLoading = false;
        } catch (err) {
            if (!err.isAbort) {
                data.isLoading = false;
                app.checkApiError(err);
            }
        }
    }

    async function save() {
        if (!data.hasChanges) {
            return;
        }

        data.isSaving = true;

        try {
            const settings = await app.pb.settings.update(app.utils.filterRedactedProps(data.formSettings));

            modalSettings.onsave?.(settings);

            init(settings);

            app.toasts.success("已成功保存日志设置。");

            data.isSaving = false;

            app.modals.close(modal);
        } catch (err) {
            if (!err.isAbort) {
                data.isSaving = false;
                app.checkApiError(err);
            }
        }
    }

    modal = t.div(
        {
            pbEvent: "logsSettingsModal",
            className: "modal popup sm logs-settings-modal",
            onbeforeopen: (el) => {
                loadSettings();
                return modalSettings.onbeforeopen?.(el);
            },
            onafteropen: (el) => {
                modalSettings.onafteropen?.(el);
            },
            onbeforeclose: (el) => {
                return modalSettings.onbeforeclose?.(el);
            },
            onafterclose: (el) => {
                modalSettings.onafterclose?.(el);
                el?.remove();
            },
        },
        t.header({ className: "modal-header" }, t.h5({ className: "m-auto" }, "日志设置")),
        () => {
            if (data.isLoading) {
                return t.div(
                    { className: "modal-content flex", style: "min-height: 200px" },
                    t.span({ className: "loader m-auto" }),
                );
            }

            return [
                t.form(
                    {
                        pbEvent: "logsSettingsForm",
                        id: "logsSettingsForm",
                        className: "modal-content logs-settings-form",
                        onsubmit: (e) => {
                            e.preventDefault();
                            save();
                        },
                    },
                    t.div(
                        { className: "grid" },
                        t.div(
                            { className: "col-lg-12" },
                            t.field(
                                { className: "field" },
                                t.label({ htmlFor: "logs.maxDays" }, "最大保留天数"),
                                t.input({
                                    type: "number",
                                    id: "logs.maxDays",
                                    name: "logs.maxDays",
                                    min: 0,
                                    required: true,
                                    value: () => data.formSettings.logs.maxDays,
                                    oninput: (e) => (data.formSettings.logs.maxDays = e.target.value << 0),
                                }),
                            ),
                            t.div(
                                { className: "field-help" },
                                "设置为",
                                t.code(null, 0),
                                " to disable logs persistence.",
                            ),
                        ),
                        t.div(
                            { className: "col-lg-12" },
                            t.field(
                                { className: "field" },
                                t.label({ htmlFor: "logs.minLevel" }, "最低日志级别"),
                                t.input({
                                    type: "number",
                                    id: "logs.minLevel",
                                    name: "logs.minLevel",
                                    min: -100,
                                    max: 100,
                                    required: true,
                                    value: () => data.formSettings.logs.minLevel,
                                    oninput: (e) => (data.formSettings.logs.minLevel = e.target.value << 0),
                                }),
                            ),
                            t.div(
                                { className: "field-help" },
                                t.div(null, "低于最低级别的日志将被忽略。"),
                                defaultLogLevels(),
                            ),
                        ),
                        t.div(
                            { className: "col-lg-12" },
                            t.field(
                                { className: "field" },
                                t.input({
                                    type: "checkbox",
                                    id: "logs.logIP",
                                    name: "logs.logIP",
                                    className: "switch",
                                    checked: () => data.formSettings.logs.logIP,
                                    onchange: (e) => (data.formSettings.logs.logIP = e.target.checked),
                                }),
                                t.label({ htmlFor: "logs.logIP" }, "启用IP记录"),
                            ),
                        ),
                        t.div(
                            { className: "col-lg-12" },
                            t.field(
                                { className: "field" },
                                t.input({
                                    type: "checkbox",
                                    id: "logs.logAuthId",
                                    name: "logs.logAuthId",
                                    className: "switch",
                                    checked: () => data.formSettings.logs.logAuthId,
                                    onchange: (e) => (data.formSettings.logs.logAuthId = e.target.checked),
                                }),
                                t.label({ htmlFor: "logs.logAuthId" }, "启用认证ID记录"),
                            ),
                        ),
                    ),
                ),
                t.footer(
                    { className: "modal-footer" },
                    t.button(
                        {
                            type: "button",
                            className: "btn transparent m-r-auto",
                            onclick: () => app.modals.close(modal),
                            disabled: () => data.isSaving,
                        },
                        t.span({ className: "txt" }, "关闭"),
                    ),
                    t.button(
                        {
                            type: "submit",
                            "html-form": "logsSettingsForm",
                            className: () => `btn ${data.isSaving ? "loading" : ""}`,
                            disabled: () => !data.hasChanges || data.isSaving,
                        },
                        t.span({ className: "txt" }, "保存更改"),
                    ),
                ),
            ];
        },
    );

    return modal;
}
