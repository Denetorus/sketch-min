import {SCButton, SCGroup, SCSpan, SCWindow} from "../../external/sk-cmp/sk-cmp.js";
import {ObjectAttributes} from "../../object/ObjectAttributes.js";
import {DbObject} from "../../external/sk-cmp/sk-cmp-db-objects.js";
import {InputBoxDB} from "./InputBoxDB.js";

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
        this.object = new DbObject(this.db, this.tableName, key, {
            fieldDescriptions: ObjectAttributes[this.tableName]
        });
    }

    close(data){
        const event = new CustomEvent("close", { detail: data });
        this.dispatchEvent(event);
        this.parentElement.closeWindow(this);
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
                        this.close(undefined);
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
                            .then((data)=>{
                                if (data.hasOwnProperty('ref')){
                                    this.close(data.ref.uid);
                                    return
                                }
                                this.close(undefined)
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
        if (this.object.data[this.object.keyName]===-1){
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
        for (const attrKey in this.object.fieldDescriptions){
            if (this.object.fieldDescriptions[attrKey].show !== true)
                continue;
            items[attrKey] = this.renderField(attrKey);
        }
        this.items.content_box.items.fields.items = items;
    }

    renderField(fieldName){
        return new InputBoxDB(
            this.object,
            fieldName,
            {
                inputProps: {
                    attributes: {
                        autocomplete: "off"
                    }
                }
            }
        );
    }


}
customElements.define("window-item", WindowItem)