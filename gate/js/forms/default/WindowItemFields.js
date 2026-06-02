import {SCGroup} from "../../external/sk-cmp/sk-cmp.js";
import {InputBoxDB} from "./InputBoxDB.js";

export class WindowItemFields extends SCGroup{

    constructor(owner, props) {
        super(props);
        this.classList.add('window-item-fields')
        this.owner = owner;
    }

    render(){
        if (typeof this.owner.renderFields === "function"){
            this.owner.renderFields.bind(this)();
            return;
        }
        this.items = {}
        for (const attrKey in this.owner.object.fieldDescriptions){
            if (this.owner.object.fieldDescriptions[attrKey].show !== true)
                continue;
            this.items[attrKey] = this.renderField(attrKey);
        }
        super._render();

    }

    renderField(fieldName, props){
        return new InputBoxDB(
            this.owner.object,
            fieldName,
            props
        );
    }



}
customElements.define('window-item-fields', WindowItemFields);