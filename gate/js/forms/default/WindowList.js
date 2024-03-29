import {SCButton, SCGroup, SCSpan, SCWindow} from "../../external/sk-cmp/sk-cmp.js";
import {SCTableDB} from "../../external/sk-cmp/sk-cmp-db.js";
import {ObjectAttributes} from "../../object/ObjectAttributes.js";
import {WindowItem} from "./WindowItem.js";
import {DBTableObject} from "../../external/sk-cmp/sk-cmp-db-objects.js";


export class WindowList extends SCWindow{

    constructor(db, tableName) {
        super({
            styles: {
                position: 'absolute',
                top: 0,
                left: 0,
                border: '1px solid black',
                height: '100%',
                width: '100%',
                flexGrow: '1',
                padding: '10px',
                background: 'white',
            },
        });
        this.db = db;
        this.tableName = tableName;
    }

    getCloseBox() {
        return new SCGroup({
            cssText: `
                display: flex; 
                flex-direction: row; 
                justify-content: space-between;
            `,
            items: {
                title: new SCSpan({
                    items: [this.tableName],
                    cssText: 'font-family: cursive; font-size: x-large'
                }),
                close: new SCButton({
                    items: ['X'],
                    onclick: function (){
                        this.remove()
                    }.bind(this)
                })
            }
        })
    }

    getContentBox(){

        const tableObject = new DBTableObject(this.db, this.tableName,{
            fieldDescriptions:  ObjectAttributes[this.tableName],
            _itemsParent: this.parentElement
        });
        const table = new SCTableDB(tableObject,{
                addEventListeners: {
                    dblclick: function (event) {
                        if (event.target.tagName === "TD") {

                            const ref = event.target.getAttribute('ref');
                            if (ref === undefined) return;

                            const newWindowItem = new WindowItem(this.object.db, this.object.tableName, ref, this)
                            this.object._itemsParent.items.push(newWindowItem)
                            this.object._itemsParent.appendChild(newWindowItem)

                        }
                    }
                }
        });

        return new SCGroup({
            cssText: 'display: flex; flex-direction: column; margin-top: 10px; width: 100%; flex-grow: 1',
            items: {
                combar: this.getCommandBar(table),
                table: table
            }
        });
    }

    getCommandBar(table){
        return new SCGroup({
            cssText: 'display: flex; flex-direction: row;',
            items: {
                create: new SCButton({
                    items: ['Create'],
                    onclick: function (){
                        const newWindowItem = new WindowItem(this.object.db, this.object.tableName, undefined, this)
                        this.object._itemsParent.items.push(newWindowItem)
                        this.object._itemsParent.appendChild(newWindowItem)
                    }.bind(table)
                })
            }
        })
    }


}
customElements.define("window-list", WindowList)