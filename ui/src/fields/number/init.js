import { input } from "./input";
import { settings } from "./settings";
import { view } from "./view";

window.app = window.app || {};
window.app.fieldTypes = window.app.fieldTypes || {};
window.app.fieldTypes.number = {
    icon: "ri-hashtag",
    label: "数字",
    settings,
    input,
    view,
    dummyData: (f, forSubmit = false) => {
        return 123.456;
    },
};
