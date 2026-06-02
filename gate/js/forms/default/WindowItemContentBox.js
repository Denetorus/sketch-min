import {SCGroup} from "../../external/sk-cmp/sk-cmp.js";
import {WindowItemCommonBar} from "./WindowItemCommonBar.js";
import {WindowItemFields} from "./WindowItemFields.js";

export class WindowItemContentBox extends SCGroup{

    constructor(owner, props) {
        super(props);
        this.classList.add("window-item-content-box");
        this.owner = owner;
        this.setItems();
    }

    setItems(){
        this.items = {
            comBar: this.getCommandBar(),
            fields: this.getFields()
        }
    }

    getCommandBar(){
        return new WindowItemCommonBar(this.owner);
    }

    getFields(){
        return new WindowItemFields(this.owner);
    }

    renderFields(){
        this.items.fields.render()
    }

}
customElements.define("window-item-content-box", WindowItemContentBox);