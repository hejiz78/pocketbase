import { settingsSidebar } from "../settingsSidebar";

export function pageStorageSettings() {
    app.store.title = "文件存储";

    const data = store({
        isLoading: false,
        isSaving: false,
        formSettings: null,
        initSerialized: "null",
        originalFormSettings: null,
        get hasChanges() {
            return data.initSerialized != JSON.stringify(data.formSettings);
        },
    });

    loadSettings();

    async function loadSettings() {
        data.isLoading = true;

        try {
            init(await app.pb.settings.getAll());

            data.isLoading = false;
        } catch (err) {
            if (!err.isAbort) {
                app.checkApiError(err);
                // data.isLoading = false; don't reset in case of a server error
            }
        }
    }

    async function save() {
        if (data.isSaving || !data.hasChanges) {
            return;
        }

        data.isSaving = true;

        try {
            const redacted = app.utils.filterRedactedProps(data.formSettings);
            const settings = await app.pb.settings.update(redacted);
            init(settings);

            app.toasts.success("已成功保存存储设置。");
        } catch (err) {
            app.checkApiError(err);
        }

        data.isSaving = false;
    }

    function init(settings = {}) {
        // refresh local app settings
        app.store.settings = JSON.parse(JSON.stringify(settings));

        data.formSettings = {
            s3: settings?.s3 || {},
        };

        data.initSerialized = JSON.stringify(data.formSettings);
        data.originalFormSettings = JSON.parse(data.initSerialized);
    }

    function reset() {
        data.formSettings = JSON.parse(data.initSerialized);
    }

    return t.div(
        {
            pbEvent: "pageStorageSettings",
            className: "page page-storage-settings",
        },
        settingsSidebar(),
        t.div(
            { className: "page-content full-height" },
            t.header(
                { className: "page-header" },
                t.nav(
                    { className: "breadcrumbs" },
                    t.div({ className: "breadcrumb-item" }, "设置"),
                    t.div({ className: "breadcrumb-item" }, () => app.store.title),
                ),
            ),
            t.div(
                { className: "wrapper m-b-base" },
                () => {
                    if (data.isLoading) {
                        return t.div({ className: "block txt-center" }, t.span({ className: "loader lg" }));
                    }

                    return t.form(
                        {
                            pbEvent: "storageSettingsForm",
                            className: "grid storage-settings-form",
                            inert: () => data.isSaving,
                            onsubmit: (e) => {
                                e.preventDefault();
                                save();
                            },
                        },
                        t.div(
                            { className: "col-lg-12 txt-lg" },
                            t.p(
                                null,
                                "默认情况下，PocketBase使用并推荐使用本地文件系统来存储上传的文件，因为它性能更好、更易于管理和备份。",
                            ),
                            t.p(
                                null,
                                "另外，如果您的磁盘空间有限，可以选择S3兼容的外部存储。",
                            ),
                        ),
                        t.div(
                            { className: "col-lg-12" },
                            app.components.s3ConfigFields({
                                config: () => data.formSettings.s3,
                                before: () => {
                                    const originalEnabled = data.originalFormSettings.s3?.enabled;

                                    if (originalEnabled == data.formSettings.s3?.enabled) {
                                        return;
                                    }

                                    return t.div(
                                        { className: "alert info m-t-sm" },
                                        "如果您已有上传的文件，您需要手动将它们从 ",
                                        t.strong(null, originalEnabled ? "S3存储" : "本地文件系统"),
                                        " 迁移到 ",
                                        t.strong(
                                            null,
                                            data.formSettings.s3?.enabled ? "S3存储" : "本地文件系统",
                                        ),
                                        "。",
                                        t.br(),
                                        "有一些命令行工具可以帮助您，例如：",
                                        t.a({
                                            href: "https://github.com/rclone/rclone",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "txt-bold",
                                            textContent: "rclone",
                                        }),
                                        "、",
                                        t.a({
                                            href: "https://github.com/peak/s5cmd",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "txt-bold",
                                            textContent: "s5cmd",
                                        }),
                                        " 等。",
                                    );
                                },
                            }),
                        ),
                        t.div({ className: "col-lg-12" }, t.hr()),
                        t.div(
                            { className: "col-lg-12" },
                            t.div(
                                { className: "flex" },
                                t.div({ className: "m-r-auto" }),
                                t.button(
                                    {
                                        hidden: () => !data.hasChanges,
                                        type: "button",
                                        className: "btn transparent secondary",
                                        onclick: reset,
                                    },
                                    t.span({ className: "txt" }, "取消"),
                                ),
                                t.button(
                                    {
                                        className: () => `btn expanded-lg ${data.isSaving ? "loading" : ""}`,
                                        disabled: () => !data.hasChanges || data.isSaving,
                                    },
                                    t.span({ className: "txt" }, "保存更改"),
                                ),
                            ),
                        ),
                    );
                },
            ),
            t.footer({ className: "page-footer" }, app.components.credits()),
        ),
    );
}
