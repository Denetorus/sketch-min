import {SCButton, SCGroup, SCSpan, SCTableRow, SCWindow} from "../../external/sk-cmp/sk-cmp.js";
import {DBObject, DBObjectUID, DBTableObject} from "../../external/db/DBObject.js";
import {ObjectAttributes} from "../../object/ObjectAttributes.js";
import {InputBox} from "../../pages/app/InputBox.js";

export class WindowItem extends SCWindow{

    constructor(db, tableName, key, owner) {
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
        this.owner = owner;
        this.object = new DBObject(this.db, this.tableName, key, ObjectAttributes[this.tableName]);
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
        return new SCGroup({
            cssText: 'display: flex; flex-direction: column; margin-top: 10px; border: 1px solid black; width: 100%; flex-grow: 1',
            items: {
                combar: this.getCommandBar(),
                fields: new SCGroup({
                    cssText: 'display: flex; flex-direction: column;'
                })
            }
        })
    }

    getCommandBar(){
        return new SCGroup({
            cssText: 'display: flex; flex-direction: row;',
            items: {
                save: new SCButton({
                    items: ['Save'],
                    onclick: function (){
                        this.object.save()
                            .then(()=>{
                                    this.owner.render()
                                    this.remove()
                                },
                                (error)=>{
                                    console.error(error)
                                }
                            )
                    }.bind(this)
                }),
                delete: new SCButton({
                    items: ['Delete'],
                    onclick: function (){
                        this.object.delete()
                            .then(()=>{
                                    this.owner.render()
                                    this.remove()
                                },
                                (error)=>{
                                    console.error(error)
                                }
                            )
                    }.bind(this)
                })
            }
        })
    }

    render(){
        if (this.object.data[this.object._keyName]===-1){
            this.fillContent();
            this.renderFields();
            super._render();
            return;
        }
        this.object.load().then(()=>{
            this.fillContent();
            this.renderFields();
            super._render();
        });
    }

    renderFields(){

        const items = {}
        for (const attrKey in this.object._attributes){
            if (this.object._attributes[attrKey].show !== true)
                continue;
            items[attrKey] = this.renderField(attrKey);
        }
        this.items.content_box.items.fields.items = items;
    }

    renderField(fieldName){
        const attr = this.object._attributes[fieldName];
        return new InputBox(
            this.object.data[fieldName],
            attr.type, fieldName,
            this.tableName+"_"+fieldName,
            attr.title,
            this.object.data
        );
    }


}
customElements.define("window-item", WindowItem)