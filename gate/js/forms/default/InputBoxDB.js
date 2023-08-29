import {SCInputBoxDB} from "../../external/sk-cmp/sk-cmp-db.js";
import {DBSelectObject} from "../../external/sk-cmp/sk-cmp-db-objects.js";
import {InputObject} from "./InputObject.js";

export class InputBoxDB extends SCInputBoxDB{

    constructor(object, fieldKey, props) {
        super(object, fieldKey, props)
    }

    once(){
        this.addCommonStyles(`
input-box-db {
    margin: 10px
}        
input-box-db label{
    display: block;
    min-width: 200px;
    margin-right: 10px;
}        
input-box-db input,select{
    min-width: 200px;
}        
        `);

        InputBoxDB.prototype.once = undefined;
    }

    inputProps_onchange(event){
        if (this.readonly) {

            if (this.object.fieldDescriptions.type === 'object') {
                event.target.setValue(this.object.data[this.fieldKey])
                return;
            }
            event.target.setValue(this.object.data[this.fieldKey]);
            return;

        }

        if (this.object.fieldDescriptions.type === 'object') {
            const value = event.target.getValue();
            this.object.data[this.fieldKey] = value
            return;
        }

        this.object.data[this.fieldKey] = event.target.getValue()

    }

    getInputItemByType(){

        if (this.type==='object'){

            return new InputObject(
                new DBSelectObject(this.value.db, this.value.refTable, {
                    keyName: "uid",
                    presentationName: "description",
                }),
                this.value,
                this.name,
                this.inputId,
                this.inputProps
            );

        }

        return super.getInputItemByType();

    }

}
customElements.define('input-box-db', InputBoxDB)