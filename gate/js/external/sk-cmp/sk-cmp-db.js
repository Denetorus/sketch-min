import {
    mixin, SCHTML,
    SCInputBox,
    SCLi, SCMix,
    SCOption,
    SCSelect,
    SCTable,
    SCTableBody,
    SCTableCell,
    SCTableHead,
    SCTableHeadCell,
    SCTableRow, SCUList
} from "./sk-cmp.js";
import {DBSelectObject} from "./sk-cmp-db-objects.js";

export const SCDBMix = {
    
    onStart: function(props){
        this.isTree = false;
        this.refColumn = 'ref';
        this.parentColumn = 'parent';
        SCMix.onStart.bind(this)(props);
    },
    
    render(){
        this.object.load().then(()=>{
            this.fillByObject()
            if (this.isTree)
                this.buildTree();
            SCMix.render.bind(this)()
        })
    },
    
    fillByObject(){
        this.clear();
        this.object.data.forEach((row)=>{
            this.renderRow(row)
        })
    
    },
    
    buildTree(){
        const rows = this.object.data;
        for (const rowsKey in rows) {
            const uid = rows[rowsKey][this.refColumn];
            const parentUID = rows[rowsKey][this.parentColumn];
            const parent = this.items[parentUID];
            if (parent){
                parent.items[uid] = this.items[uid];
                delete this.items[uid];
            }
        }
    },
    
}

export class SCInputBoxDB extends SCInputBox{
    
    constructor(object, fieldKey, props) {
        
        super(
            object.data[fieldKey],
            object.fieldDescriptions[fieldKey].type,
            fieldKey,
            fieldKey,
            object.fieldDescriptions[fieldKey].title
        );
        
        this.object = object;
        this.fieldKey = fieldKey;
        this.readonly = false;
        
        this.fillProps(props);
        
        if (!this.inputProps.hasOwnProperty('onchange')){
            this.inputProps['onchange'] = this.inputProps_onchange.bind(this)
        }
    }
    
    inputProps_onchange(event){
        if (this.readonly) {
            
            if (this.object.fieldDescriptions[this.fieldKey].type === 'object') {
                event.target.setValue(this.object.data[this.fieldKey].ref)
                return;
            }
            event.target.setValue(this.object.data[this.fieldKey]);
            return;
            
        }
        
        if (this.object.fieldDescriptions[this.fieldKey].type === 'object') {
            this.object.data[this.fieldKey].ref = event.target.getValue()
            return;
        }
        
        this.object.data[this.fieldKey] = event.target.getValue()

    }
    
    getInputItemByType(){
        
        if (this.type==='object'){
            
            const props = {}
            if (this.object.fieldDescriptions[this.fieldKey].hasOwnProperty('refFilters'))
                props.filters = this.object.fieldDescriptions[this.fieldKey];
            
            if (this.object.fieldDescriptions[this.fieldKey].hasOwnProperty('refSorts'))
                props.sorts = this.object.fieldDescriptions[this.fieldKey]
            
            return new SCSelectDB(
                new DBSelectObject(
                    this.value.db,
                    this.value.refTable,
                    props
                ),
                this.value.ref,
                this.name,
                this.inputId,
                this.inputProps
            )
        }
        return super.getInputItemByType();
    }
    
}
customElements.define('sc-input-box-db', SCInputBoxDB)

export class SCTableDB extends SCTable{

    constructor(object, props) {
        super();
        this.object = object;
        this.setAttribute("is", "sc-table-db")
        this.items = {
            head: new SCTableHead,
            body: new SCTableBody
        }
        
        this.prepareHead();
        this.fillProps(props)
    }

    clear(){
        this.items.body.items = [];
        this.items.body.rendered = false;
    }
    
    prepareHead(){
        this.items.head.items = {};
        for (const key in this.object.fieldDescriptions){
            if (this.object.fieldDescriptions[key].show !== true)
                continue;
            this.items.head.items[key] =
                this.renderHeadCell(key, this.object.fieldDescriptions[key]);
        }
    }
    
    renderHeadCell(key, fieldDescription){
        return new SCTableHeadCell({
            items: [fieldDescription.title],
            attributes: {col: key}
        });
    }

    renderRow(row){
        const curTableRow = new SCTableRow();
        for (const key in this.object.fieldDescriptions){
            if (this.object.fieldDescriptions[key].show !== true)
                continue;
            curTableRow.items[key] = this.renderCell(row[key], this.object.fieldDescriptions[key]);
            curTableRow.items[key].setAttribute("ref", row[this.object.keyName], key);
            curTableRow.items[key].setAttribute("col", key);
        }
        this.items.body.items.push(curTableRow);
    }
    
    renderCell(value, fieldDescription, fieldName){
        return new SCTableCell(this.renderValue(value, fieldDescription, fieldName))
    }

    renderValue(value, fieldDescription, fieldName){

        if (fieldDescription.type === 'object'){
            return {items: [value.presentation]}
        }

        if (fieldDescription.type === 'number'){
            return {items: [value.toString()]}
        }
    
        if (fieldDescription.type === 'date'){
            try{
                return {items: [value.toLocaleDateString()]}
            }catch{
                return {items: [value.toString()]}
            }
            
        }
        
        if (fieldDescription.type === 'html'){
            return {items: [new SCHTML({items: [value]})]}
        }
        
        return {items: [value]}
    }

}
mixin(SCTableDB, SCDBMix)
customElements.define('sc-table-db', SCTableDB, {extends: 'table'})

export class SCSelectDB extends SCSelect{

    constructor(object, value, name, id, props) {
        super(value, name, id, props);
        this.object = object;
        this.setAttribute("is", "sc-select-db")
    }

    renderRow(row){
        this.items.push(this.renderCell(row['ref'], row['presentation']))
    }
    
    renderCell(ref, presentation){
        return new SCOption(ref, this.renderValue(presentation))
    }

    renderValue(presentation){
        return {items: [presentation]}
    }

}
mixin(SCSelectDB, SCDBMix)
customElements.define('sc-select-db', SCSelectDB, {extends: 'select'})

export class SCUListDB extends SCUList{

    constructor(object, props) {
        super(props);
        this.object = object;
        this.setAttribute("is", "sc-ulist-db")
        this.items = {}
    }
    
    clear(){
        this.items = {};
    }
    
    renderRow(row){
        this.items[row.ref] = this.renderCell(row['ref'], row['presentation'])
    }
    
    renderCell(ref, presentation){
        return new SCLi(this.renderValue(ref, presentation))
    }
    
    renderValue(ref, presentation){
        return {
            items: [presentation],
            attributes: {ref: ref}
        }
    }
   
}
mixin(SCUListDB, SCDBMix)
customElements.define('sc-ulist-db', SCUListDB, {extends: 'ul'})
