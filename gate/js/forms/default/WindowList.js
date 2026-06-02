import {SCWindow} from "../../external/sk-cmp/sk-cmp.js";
import {SCTableDB} from "../../external/sk-cmp/sk-cmp-db.js";
import {WindowItem} from "./WindowItem.js";
import {DBTableObject} from "../../external/sk-cmp/sk-cmp-db-objects.js";
import {WindowListCommandBar} from "./WindowListCommandBar.js";
import {WindowListContentBox} from "./WindowListContentBox.js";
import {WindowHeaderPanel} from "./WindowHeaderPanel.js";



export class WindowList extends SCWindow{

    constructor(db, objectSchema) {
        super();
        this.classList.add('window-list');
        this.db = db;
        this.objectSchema = objectSchema;
        this.setTable();
    }

    updateTable(){
        this.table.object.load();
        this.table.render();
    }

    setTable(){
        this.table = new SCTableDB(this.getTableObject());
        this.ondblclick = this.event_dblclick.bind(this);
    }

    getWindowItem(key){
        return new WindowItem(this.db, this.objectSchema, key, this)
    }

    getTableObject(){
        return new DBTableObject(this.db, this.objectSchema.name,{
            fieldDescriptions:  this.objectSchema.fieldDescriptions,
            _itemsParent: this.parentElement,
        });
    }

    getHeaderPanel() {
        return new WindowHeaderPanel(this, this.objectSchema.titleList)
    }

    getContentBox(){
        return new WindowListContentBox(this);
    }

    getCommandBar(){
        return new WindowListCommandBar(this)
    }

    event_dblclick(event) {
        if (event.target.tagName === "TD") {

            const ref = event.target.getAttribute('ref');
            if (ref === undefined) return;

            const newWindowItem = this.getWindowItem(ref)
            this.parentElement.addWindow(newWindowItem);

        }
    }


}
customElements.define("window-list", WindowList)

