import {SCButton} from "../../external/sk-cmp/sk-cmp.js";

export class WindowCommandBarButton extends SCButton {

    constructor(props) {
        super(props);
        this.classList.add('window-combar-button');
        this.setAttribute("is", "window-combar-button")
    }

}
customElements.define("window-combar-button", WindowCommandBarButton, {extends: 'button'});