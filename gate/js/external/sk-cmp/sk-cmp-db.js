import {
    SCOption,
    SCSelect,
    SCTable,
    SCTableBody,
    SCTableCell,
    SCTableHead,
    SCTableHeadCell,
    SCTableRow
} from "./sk-cmp.js";

export class SCTableDB extends SCTable{

    constructor(object, props) {
        super();
        this.object = object;
        this.items = {
            head: new SCTableHead,
            body: new SCTableBody
        }
        this.prepareHead();
        this.fillProps(props);
    }

    prepareHead(){
        for (const attrKey in this.object._attributes){
            if (this.object._attributes[attrKey].show !== true)
                continue;
            this.items.head.items[attrKey] = new SCTableHeadCell({
                items: [this.object._attributes[attrKey].title]
            });
        }
    }

    render(){

        this.object.load().then(()=>{
            this.items.body.items = [];
            const keyName = this.object._keyName;
            this.object.data.forEach((value)=>{
                const curTableRow = new SCTableRow();
                for (const attrKey in this.object._attributes){
                    if (this.object._attributes[attrKey].show !== true)
                        continue;
                    curTableRow.items[attrKey] = this.renderValue(value[attrKey], this.object._attributes[attrKey]);
                    curTableRow.items[attrKey].setAttribute("ref", value[keyName]);
                    curTableRow.items[attrKey].setAttribute("col", attrKey);
                }
                this.items.body.items.push(curTableRow);
            })
            this.items.body.render();
            super.render();

        });
    }

    renderValue(value, attr){

        if (attr.type === 'object'){
            return new SCTableCell({
                items: [value.presentation]
            });
        }

        if (attr.type === 'number'){
            return new SCTableCell({
                items: [value.toString()]
            });
        }

        return new SCTableCell({
            items: [value]
        });
    }

}
customElements.define('sc-table-db', SCTableDB, {extends: 'table'})

export class SCSelectDB extends SCSelect{

    constructor(object, value, name, id, props) {
        super(value, name, id, props);
        this.object = object;
    }

    render(){

        this.object.load().then(()=>{
            this.items = [];
            this.object.data.forEach((value)=>{
                this.items.push(this.renderValue(value['ref'], value['presentation']));
            })
            super.render();

        });
    }

    renderValue(value, content){

        return new SCOption(value, {
            items: [content],
        })

    }

}
customElements.define('sc-select-db', SCSelectDB, {extends: 'select'})
