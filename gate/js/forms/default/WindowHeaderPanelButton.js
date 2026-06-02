import {SCButton} from "../../external/sk-cmp/sk-cmp.js";

export class WindowHeaderPanelButton extends SCButton{

    constructor(props) {
        super(props);
        this.setAttribute("is", "window-header-panel-button")
    }

    once(){
        this.addCommonStyles(`

        `)
        WindowHeaderPanelButton.prototype.once = undefined;
    }

}
customElements.define('window-header-panel-button', WindowHeaderPanelButton, {extends: 'button'});