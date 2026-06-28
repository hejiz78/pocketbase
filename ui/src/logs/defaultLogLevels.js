export function defaultLogLevels() {
    return t.div(
        { className: "inline-flex gap-5" },
        t.span(null, "默认日志级别："),
        () => {
            const result = [];
            for (const level in app.utils.logLevels) {
                result.push(t.code(null, `${level}:${app.utils.logLevels[level].label}`));
            }
            return result;
        },
    );
}
