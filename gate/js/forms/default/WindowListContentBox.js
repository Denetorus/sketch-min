import {SCGroup} from "../../external/sk-cmp/sk-cmp.js";

export class WindowListContentBox extends SCGroup {

    constructor(owner) {
        super();
        this.classList.add('window-list-content-box');
        this.owner = owner;
        this.setItems();
    }

    setItems() {
        this.items = {
            comBar: this.owner.getCommandBar(),
            table: this.owner.table
        }
    }

}
customElements.define("window-list-content-box", WindowListContentBox);