import {SCWindow} from "../../external/sk-cmp/sk-cmp.js";
import {DbObject} from "../../external/sk-cmp/sk-cmp-db-objects.js";
import {WindowHeaderPanel} from "./WindowHeaderPanel.js";
import {WindowItemContentBox} from "./WindowItemContentBox.js";

export class WindowItem extends SCWindow{

    constructor(db, objectSchema, key, owner) {
        super();
        this.classList.add("window-item");
        this.db = db;
        this.objectSchema = objectSchema;
        this.owner = owner;
        this.object = this.getItemObject(key);
    }

    getItemObject(key){
        return new DbObject(this.db, this.objectSchema.name, key, {
            fieldDescriptions: this.objectSchema.fieldDescriptions
        });
    }

    close(data){
        this.owner.updateTable();
        const event = new CustomEvent("close", { detail: data });
        this.dispatchEvent(event);
        this.parentElement.closeWindow(this);
    }

    getHeaderPanel() {
        return new WindowHeaderPanel(this, this.objectSchema.title)
    }

    getContentBox(){
        return new WindowItemContentBox(this)
    }


    render(){
        if (this.object.data[this.object.keyName]===-1){
            this.fillContent();
            this.items.contentBox.renderFields();
            super._render();
            return;
        }
        this.object.load().then(()=>{
            this.fillContent();
            this.items.contentBox.renderFields();
            super._render();
        });
    }

}
customElements.define("window-item", WindowItem)