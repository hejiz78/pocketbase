window.app = window.app || {};
window.app.components = window.app.components || {};

// @todo consider normalizing and changing args to props

/**
 * 返回指定值的"复制"图标按钮。
 *
 * @example
 * ```js
 * app.components.copyButton("test")
 * ```
 *
 * @param  {string|function} The value to copy.
 * @param  {Array} [children] Optional children to append after the icon.
 * @return {Element}
 */
window.app.components.copyButton = function(textOrFunc, ...children) {
    const data = store({
        active: false,
    });

    let activeTimeoutId;

    function copy() {
        let value = textOrFunc;
        if (typeof value == "function") {
            value = textOrFunc();
        }

        app.utils.copyToClipboard(value);

        data.active = true;

        clearTimeout(activeTimeoutId);
        activeTimeoutId = setTimeout(() => {
            data.active = false;
        }, 500);
    }

    return t.button(
        {
            tabIndex: -1,
            type: "button",
            className: () => `copy-to-clipboard ${data.active ? "active" : ""}`,
            title: "复制",
            ariaDescription: app.attrs.tooltip(() => data.active ? "已复制" : null),
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                copy();
            },
        },
        t.i({
            hidden: children?.length,
            ariaHidden: true,
            className: () => `copy-icon ${data.active ? "ri-check-double-line" : "ri-file-copy-line"}`,
        }),
        ...children,
    );
};
