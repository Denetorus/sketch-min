import * as sc from './sk-cmp.js'

const SCObjectTableDBMix = {

    onStartObjectTableDB: function(object, itemProps){
        this.object = object;
        this.sorts = new ObjectSorts();
        this.filters = undefined;
        this.uidColumn = 'uid';
        this.textColumn = 'textColumn'
        this.itemProps = itemProps;
        this.isTree = false;
        this.parentColumn = 'parent';
    },

    fillByObject: function (){
        this.clear();
        this.object.rows.forEach(row=>{
            this.fillItemByRow(row);
        })
        if (this.isTree)
            this.buildTree();
    },

    fillItemByRow: function (row){
        this.items[row[this.uidColumn]] = this.getEmptyItem();
        this.items[row[this.uidColumn]].fillProps(this.getItemProps(row))
    },

    getItemProps: function (row){
        return { items: [''+row[this.textColumn]] }
    },

    buildTree: function (){
        const rows = this.object.rows;
        for (const rowsKey in rows) {
            const uid = rows[rowsKey][this.uidColumn];
            const parentUID = rows[rowsKey][this.parentColumn];
            const parent = this.items[parentUID];
            if (parent){
                parent.items[uid] = this.items[uid];
                delete this.items[uid];
            }
        }
    },

    loadData: function (){
        this.object.load()
            .then(()=>{
                this.fillByObject();
                this.render()
            })
            .catch(()=>{
                this.clearRender();
            })
    },

    setData: function (data){
        this.object.fill(data);
        this.fillByObject();
        this.render()
    },


}

export class SCSelectDB extends sc.SCSelect{
    constructor(object, startValue, name, props={}, itemProps={}) {
        super(startValue, name, {});
        this.setAttribute('is', 'sk-select-db');
        this.onStartObjectTableDB(object, itemProps);
        this.fillProps(props);
    }
    onStartObjectTableDB(object, itemProps){}
    getEmptyItem(){
        return new SCOption(this.itemProps);
    }
}
sc.mixin(SCSelectDB, SCObjectTableDBMix)
customElements.define('sk-select-db', SCSelectDB, {extends: 'select'})

export class SCUListDB extends sc.SCUList{
    constructor(object, props={}, itemProps={}) {
        super();
        this.setAttribute("is", "sk-ulist-db")
        this.onStartObjectTableDB(object, itemProps);
        this.fillProps(props);
    }
    onStartObjectTableDB(object, itemProps){}

    /**
     *
     * @returns {Element}
     */
    getEmptyItem(){
        return new SCLi(this.itemProps)
    }
}
sc.mixin(SCUListDB, SCObjectTableDBMix)
customElements.define('sk-ulist-db', SCUListDB, {extends: 'ul'})

export class SCTableBodyDB extends sc.SCTableBody{
    constructor(object, props={}, itemProps={}) {
        super();
        this.setAttribute("is", "sk-tbody-db");
        this.onStartObjectTableDB(object, itemProps);
        this.fillProps(props);
    }
    onStartObjectTableDB(object, itemProps){}
    getEmptyItem(){
        return new sc.SCTableRow(this.itemProps)
    }
}
sc.mixin(SCTableBodyDB, SCObjectTableDBMix)
customElements.define('sk-tbody-db', SCTableBodyDB, {extends: 'tbody'})

export class SCTableDB extends sc.SCTable{
    constructor(props) {
        super(props);
        this.setAttribute("is", "sk-table-db");
    }
}
customElements.define('sk-table-db', SCTableDB, {extends: 'table'})


const SORT_TYPE = {
    desc: 'desc',
    asc: 'asc'
}

const OBJECT_VALUE_TYPES = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    date: 'date',
    uid: 'uid'
}

const FILTER_TYPE = {
    number: {
        equally: '=',
        notEqually: '<>',
        more: '>',
        less: '<',
        moreOrEqually: '>=',
        lessOrEqually: '<=',
        in: 'in'
    },
    string: {
        ilike: 'ilike',
        notILike: 'not ilike',
        equally: '=',
        notEqually: '<>',
        in: 'in'
    },
    boolean: {
        true: 'true',
        false: 'false'
    },
    date: {
        equally: '=',
        notEqually: '<>',
        more: '>',
        less: '<',
        moreOrEqually: '>=',
        lessOrEqually: '<=',
        between: '..',
        in: 'in'
    },
    uid:{
        equally: '=',
        notEqually: '<>',
        in: 'in'
    }
}


class ObjectValue {

    constructor(object, propertyName, type = '', format='') {
        this.object = object;
        this.propertyName = propertyName;
        this.type = type;
        this.format = format;
        this.loadValue();
    }

    loadValue(){
        this.value = this.object[this.propertyName];
        if (this.type === '')
            this.defineType(this.value);
    }

    setValue(value){
        this.value = value;
        this.object[this.propertyName] = value;
    }

    defineType(value){
        switch (typeof value){
            case 'string': this.type = OBJECT_VALUE_TYPES.string; return;
            case 'number': this.type = OBJECT_VALUE_TYPES.number; return;
            case 'boolean': this.type = OBJECT_VALUE_TYPES.boolean; return;
            default: this.type = OBJECT_VALUE_TYPES.string;
        }
    }

}

class ObjectFilters{
    constructor(items={}) {
        this.items = {};
        this.addItems(items);
    }
    addItems(items){
        for (const key in Object.keys(items)) {
            this.addItem(key, items[key])
        }
    }
    addItem(key, item){
        this.items[key] = item;
    }
    deleteItem(key){
        delete this.items[key]
    }
    clear(){
        this.items = {};
    }
    filter(table){
        for (const tableKey in Object.keys(table)) {
            let row = table[tableKey];
            if (!row.hasOwnProperty("_options"))
                row._options = {};
            let result = true;
            for (const key in this.items) {
                result = this.items[key].checkItem(row);
                if (!result) break;
            }
            row._options.filtered = result;
        }
    }
}

class ObjectFilter {

    constructor(field, type, value) {

        this.field = undefined;
        this.type = undefined;
        this.value = undefined;

        this.setField(field);
        this.setType(type);
        this.setValue(value);

    }

    checkCorrect(){
        if (this.field===undefined || this.type === undefined)
            return false;
    }

    setField(field){
        if (!field.hasOwnProperty('name')){
            this.field = undefined;
            return
        }
        if (!field.hasOwnProperty('type')){
            this.field = undefined;
            return
        }
        this.field = {
            name: field.name,
            type: field.type,
        }
    }

    setType(type){

        this.type = undefined;
        if (this.field === undefined){
            return
        }

        const availableFilterTypes = this.getFilterTypesByFieldType();
        for (const key in availableFilterTypes) {
            if (type === availableFilterTypes[key]){
                this.type = type;
                return;
            }
        }

    }

    setValue(value){
        if (this.type === FILTER_TYPE.date.between){
            this.value = {
                min: undefined,
                max: undefined
            }
            if (value.hasOwnProperty('min')){
                this.value.min = value.min
            }
            if (value.hasOwnProperty('max')){
                this.value.max = value.max
            }
            return;
        }
        this.value = value;
    }

    filter(data){

        if (!this.checkCorrect()){
            return data;
        }
        const newData = {};
        for (const key in data) {
            const item = data[key];
            if (!item.hasOwnProperty(this.field.name))
                continue;
            if (this.checkItem(item[this.field.name])){
                newData[key] = item;
            }
        }
        return newData;
    }

    checkItem(value){
        switch (this.type){
            case FILTER_TYPE.number.equally: return value[this.field.name] === this.value;
            case FILTER_TYPE.number.notEqually: return value[this.field.name] !== this.value;
            case FILTER_TYPE.number.more: return value[this.field.name] > this.value;
            case FILTER_TYPE.number.less: return value[this.field.name] < this.value;
            case FILTER_TYPE.number.moreOrEqually: return value[this.field.name] >= this.value;
            case FILTER_TYPE.number.lessOrEqually: return value[this.field.name] <= this.value;
            case FILTER_TYPE.date.between:{
                return (this.value.min === undefined || value[this.field.name]>=this.value.min)
                    && (this.value.max === undefined || value[this.field.name]<=this.value.max)
            }
            case FILTER_TYPE.number.in:{
                return this.value.includes(value[this.field.name])
            }
            default: return false;
        }
    }

    getFilterTypesByFieldType(){

        if (this.field.type === undefined)
            return {}

        switch (this.field.type){
            case 'number': return FILTER_TYPE.number
            case 'string': return FILTER_TYPE.string
            case 'boolean': return FILTER_TYPE.boolean
            case 'date': return FILTER_TYPE.date
            case 'uid': return FILTER_TYPE.uid
        }
    }

    toSave(){
        return {
            field: this.field,
            type: this.type,
            value: this.value
        }

    }

    toJSON(){
        return JSON.stringify(this.toSave());
    }

}

class ObjectSorts{

    constructor(items=[]) {
        this.items = [];
        this.fill(items);
    }

    clear(){
        this.items = {};
    }

    fill(items){
        this.clear();
        for (const key of Object.keys(items)) {
            this.addItem(items[key]);
        }
    }

    addItem(item){
        switch (typeof item){
            case "string":
                this.items.push(new ObjectSort(item, undefined, this.onChange.bind()));
                break;
            case "object": {
                if (item.hasOwnProperty('name')){
                    this.items.push(new ObjectSort(
                        item.name,
                        item.hasOwnProperty('type') ? item.type: undefined,
                        this.onChange.bind()
                    ))
                }
                break;
            }
        }
    }

    deleteItem(key){
        this.items.splice(key,1);
    }

    sort(table){

        if (this.items.length===0)
            return;

        table.sort((a,b)=>{
            let result = 0;
            for (let i =0; i<this.items.length; i++){
                result = this.items[0].swapCompare(a,b);
                if (result)
                    break;
            }
            return result;
        })
    }

    onChange(){
    }
}

class ObjectSort{

    constructor(name, type=undefined, onChangeFunc) {
        const newType = (type!==SORT_TYPE.desc) ? SORT_TYPE.asc : SORT_TYPE.desc;
        this.changeData(name, newType);
        this.onChangeFunc = onChangeFunc;
    }

    changeData(name=undefined, type=undefined){
        let isEvent = false;
        if (name!==undefined && this.name!==name){
            this.name = name;
            isEvent = true;
        }
        if (type!==undefined){
            const newType = (type!==SORT_TYPE.desc) ? SORT_TYPE.asc : SORT_TYPE.desc;
            if (this.type!==newType){
                this.type = newType;
                isEvent = true;
            }
        }
        if(isEvent){
            this.onChange();
        }
    }

    turnType(){
        this.type = (this.type===SORT_TYPE.desc) ? SORT_TYPE.asc : SORT_TYPE.desc;
        this.onChange();
    }

    onChange(){
        if (this.onChangeFunc)
            this.onChangeFunc(this);
    }

    swapCompare(a,b){
        if (a[this.name]>b[this.name])
            return this.type === 'desc'? 1 : -1;
        if (a[this.name]===b[this.name])
            return 0;
        return -1;
    }

}

class ObjectTable {
    constructor() {
        this.archiveRows = [];
        this.sorts = new ObjectSorts();
        this.filters = new ObjectFilters();
        this.rows = [];
    }
    clear(){
        this.rows = [];
    }
    save(){
        this.archiveRows = [];
        for (let i =0; i< this.rows.length; i++){
            this.archiveRows.push(this.rows[i]);
        }
    }
    load(){
        return new Promise((resolve, reject) => {

            try {
                this.fill(this.archiveRows);
                this.filter();
                this.sort();
                resolve(this.archiveRows);
            } catch (error) {
                reject(error);
            }

        })
    }
    fill(data){
        this.clear();
        for (let i =0; i< data.length; i++){
            this.addRow(data[i])
        }
    }
    fillByObject(data){
        this.clear();
        for (const key in data) {
            const row = data[key];
            row.rowKey = key;
            this.addRow(row);
        }
    }
    sort(sorts=undefined){
        if (sorts)
            this.sorts = sorts;
        this.sorts.sort(this.rows);
    }
    filter(filters=undefined){
        if (filters)
            this.filters = filters;
        this.filters.filter(this.rows);
    }
    toSave(){
        return {
            rows: this.rows
        }
    }

    toJSON(){
        return JSON.stringify(this.toSave());
    }
    addRow(row){
        this.addEmptyOptions(row);
        this.transformRow(row);
        this.rows.push(row);
    }
    addEmptyOptions(row){
        row._options = {
            filtered: true,
        }
    }
    transformRow(row){
    }
    deleteRow(rowNumber){
        this.rows.slice(rowNumber,1);
    }
    getRow(rowNumber){
        return this.rows[rowNumber];
    }
    _getListUIDInHierarchyNextStep(parentUID, uidColumn, parentColumn, result){
        this.rows.forEach( row => {
            const curUID = row[uidColumn];
            if (
                (row[parentColumn]!==parentUID && curUID!==parentUID)
                || (result.indexOf(curUID)!==-1)
            ){
                return;
            }
            result.push(curUID);
            this._getListUIDInHierarchyNextStep(curUID, uidColumn, parentColumn, result);
        })
    }
    getListUIDInHierarchy(parentUID, uidColumn='uid', parentColumn='parent'){
        const result = [];
        this._getListUIDInHierarchyNextStep(parentUID, uidColumn, parentColumn, result);
        return result;
    }
}

class ObjectTableDB extends ObjectTable{
    constructor(tableName,db=undefined) {
        super();
        this.tableName = tableName;
        this.db = db;
        this.sortAtDB = false;
        this.filterAtDB = true;
    }
    load(){
        const params = {};
        if (this.sortAtDB)
            params['sorts'] = this.sorts;
        if (this.filterAtDB)
            params['filters'] = this.filters;
        return new Promise((resolve, reject) => {
            this.db.getTable(this.tableName, params)
                .then((data) => {
                    this.fill(data);
                    resolve(data);
                })
                .catch(reject);
        })
    }
    sort() {
        if (this.sortAtDB){
            return this.load();
        }
        super.sort();
    }

    filter(filters=undefined) {
        if (filters)
            this.filters = filters;
        if (this.filterAtDB){
            return this.load();
        }
        super.filter();
    }

    save(){
    }

}
