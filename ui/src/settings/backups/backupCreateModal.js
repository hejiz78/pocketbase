export function openBackupCreateModal(settings = {
    oncreated: null,
}) {
    const modal = backupCreateModal(settings);
    if (!modal) {
        return;
    }

    document.body.appendChild(modal);

    app.modals.open(modal);
}

function backupCreateModal(settings) {
    let modal;

    const uniqueId = "backup_create_" + app.utils.randomString();

    const data = store({
        name: "",
        isSubmitting: false,
    });

    let submitTimeoutId;

    async function submit() {
        if (data.isSubmitting) {
            return;
        }

        data.isSubmitting = true;

        clearTimeout(submitTimeoutId);
        submitTimeoutId = setTimeout(() => {
            app.modals.close(modal);
        }, 1500);

        try {
            await app.pb.backups.create(data.name, { requestKey: uniqueId });

            data.isSubmitting = false;

            if (settings.oncreated) {
                settings.oncreated(data.name);
            }

            app.toasts.success("已成功生成新备份。");

            app.modals.close(modal);
        } catch (err) {
            if (!err.isAbort) {
                clearTimeout(submitTimeoutId);
                data.isSubmitting = false;
                app.checkApiError(err);
            }
        }
    }

    modal = t.div(
        {
            pbEvent: "backupCreateModal",
            className: "modal popup backup-create-modal",
            onbeforeclose: () => {
                if (data.isSubmitting) {
                    app.toasts.info(
                        "备份已启动，但可能需要一些时间才能完成。您可以稍后再回来。",
                    );
                }
            },
            onafterclose: (el) => {
                clearTimeout(submitTimeoutId);
                el?.remove();
            },
        },
        t.header(
            { className: "modal-header" },
            t.h5({ className: "m-auto txt-center" }, "初始化新备份"),
        ),
        t.form(
            {
                id: uniqueId,
                className: "modal-content backup-restore-form",
                autocomplete: "off",
                onsubmit: (e) => {
                    e.preventDefault();
                    submit();
                },
            },
            t.div(
                { className: "grid" },
                t.div(
                    { className: "col-lg-12" },
                    t.div(
                        { className: "alert warning" },
                        t.div(
                            { className: "content" },
                            t.p(
                                null,
                                `请注意，在备份期间，其他并发写入请求可能会失败，因为数据库将被临时"锁定"（这通常仅在ZIP生成期间发生）。`,
                            ),
                            t.p(
                                { className: "txt-bold" },
                                `如果您使用S3存储来上传集合文件，您需要单独备份它们，因为它们不是本地存储的，不会包含在生成的备份中！`,
                            ),
                        ),
                    ),
                ),
                t.div(
                    { className: "col-lg-12" },
                    t.div(
                        { className: "field" },
                        t.label({ htmlFor: uniqueId + "_name" }, "备份名称"),
                        t.input({
                            id: uniqueId + "_name",
                            name: "name",
                            type: "text",
                            pattern: "^[a-z0-9_-]+\.zip$",
                            placeholder: "留空以自动生成",
                            value: () => data.name,
                            oninput: (e) => (data.name = e.target.value),
                        }),
                    ),
                    t.div({ className: "field-help" }, "必须为 [a-z0-9_-].zip 格式"),
                ),
            ),
        ),
        t.footer(
            { className: "modal-footer" },
            t.button(
                {
                    type: "button",
                    className: "btn transparent m-r-auto",
                    disabled: () => data.isSubmitting,
                    onclick: () => app.modals.close(modal),
                },
                t.span({ className: "txt" }, "取消"),
            ),
            t.button(
                {
                    "html-form": uniqueId,
                    type: "submit",
                    className: () => `btn ${data.isSubmitting ? "loading" : ""}`,
                    disabled: () => data.isSubmitting,
                },
                t.span({ className: "txt" }, "开始备份"),
            ),
        ),
    );

    return modal;
}
