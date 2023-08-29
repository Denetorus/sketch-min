// ========================================================================
// DB OBJECT (Version 1.0.1 original) (C) 2023 Mylnikov Denis
// =========================================================================

"use strict";

export class DbObject {

    /**
     * Create object DBObject
     *
     * @constructor
     * @param db {DbConnector}
     * @param tableName {string} Database table name
     * @param key {string|undefined} Database key record value
     * @param props {{}} Additional object properties
     * @param props.fieldDescriptions {{DBFieldDescription}} Database record fields description
     * @param props.events {{}} Callbacks <br/>
     * @param props.events.beforeSave {function} use before save object (if it returns 'true' save will not execute)
     * @param props.events.beforeLoad {function} use before load object (if it returns 'true' load will not execute)
     * @param props.events.beforeDelete {function} use before delete object (if it returns 'true' delete don't execute
     * @param props.events.onError {function(code,message)} on different errors
     *
     */
    constructor(db, tableName, key= undefined, props={}) {
        
        this.db = db;
        this.tableName = tableName;
        this.fieldDescriptions = {};
        this.events = {};
        this.data = {};
        this.keyName = '';
        this.key = key;
        
        if (props.hasOwnProperty('fieldDescriptions')){
            this.setFieldDescriptions(props.fieldDescriptions);
            delete props.fieldDescriptions;
        }
        this.fillProps(props);
    
    }
    
    /**
     * Set object field descriptions
     *
     * @param fieldDescriptions {{}}}
     */
    setFieldDescriptions(fieldDescriptions){
    
        for (const attrKey in fieldDescriptions) {
            this.setFieldDescription(attrKey, fieldDescriptions[attrKey])
        }

    }
    
    /**
     * Set object field description
     *
     * @param key {string}
     * @param value {DBFieldDescription}
     */
    setFieldDescription(key, value){
        
        this.fieldDescriptions[key] = value;
    
        this.data[key] = value.defaultValue;

        if (value.definePropertyPattern){
            Object.defineProperty(this.data, key, value.definePropertyPattern);
        }
        if (value.type==='object'){
            this.data[key].db = this.db;
        }
    
        if (value.isKey === true){
            this.keyName = key;
            if (this.key!==undefined){
                this.data[key] = this.key;
            }
        }
        
    }
    
    /**
     * Inform subscribers "onError" event about errors
     *
     * @this {IndexedDB}
     * @param code {number} error code
     * @param message {string} - error system message
     */
    onError(code=0, message=""){
        if (this.events.hasOwnProperty('onError')){
            this.events.onError(code, message, this);
        }
    }
    
    /**
     * Fill properties
     *
     * @param props {{}} Additional object properties
     */
    fillProps(props={}){
        
        for (const propsKey in props) {
            this[propsKey] = props[propsKey];
        }
    
    }
    
    /**
     * Reset errors and data to default values
     */
    clear(){
        this.data = {};
        for (const attrKey in this.fieldDescriptions) {
            if (attrKey === this.keyName)
                continue;
            this.data[attrKey] = this.fieldDescriptions[attrKey].defaultValue;
        }
    }

    /**
     * Get promise to Save object to database 'db'
     *
     * @returns {Promise<boolean>}
     */
    save(){
    
        return new Promise((resolve,reject)=> {

            if (this.events.hasOwnProperty('beforeSave')
                && this.events.beforeSave()){
                    resolve(true);
            }

            if (!this.validate()){
                this.onError(0, 'Object validate has errors');
                reject(false);
            }
            
            this.db.saveRecord(this.tableName, this.toSave())
                .then(resolve)
                .catch(reject);

        })
    }

    /**
     * Get promise to Load object from database 'db'
     *
     * @returns {Promise<object>}
     */
    load(){

        return new Promise((resolve,reject)=>{

            if (this.events.hasOwnProperty('beforeLoad')
                && this.events.beforeLoad()){
                    resolve(true);
            }

            if (this.key===undefined) {
                this.clear()
                resolve()
            }

            this.db.getRecord(this.tableName, this.key)
                .then(
                    (data) => {
                        this.fill(data)
                        resolve(true)
                    },
                    (error)=>{
                        this.onError(0, 'Loading error: ' + error.message);
                        reject(error);
                    }
                )
                .catch((error)=>{
                    this.onError(0, 'Fill data error: ' + error.message);
                    reject(error);
                });

        })
    }

    /**
     * Get promise to Delete object from database 'db'
     *
     * @returns {Promise<boolean>}
     */
    delete(){
        
        return new Promise((resolve,reject)=>{
            
            if (this.events.hasOwnProperty('beforeDelete')
                && this.events.beforeDelete()){
                    resolve(true);
            }

            this.db.deleteRecord(this.tableName, this.key)
                .then(resolve)
                .catch(reject);
           
        })
    }

    /**
     * Fill values which present in fieldDescriptions
     *
     * @param data {{}} keys and values need to fill
     * @param clear {boolean} need to call 'clear' function before
     */
    fill(data, clear=true){

        if (clear)
            this.clear();

        if (data===undefined)
            return;

        for (const dataKey in data) {
            if(this.fieldDescriptions.hasOwnProperty(dataKey)){
                this.data[dataKey] = data[dataKey];
                if(this.fieldDescriptions[dataKey].type==='object'){
                    this.data[dataKey].db = this.db;
                }
            }
        }

    }

    /**
     * Validate object fieldDescriptions
     *
     * @returns {{result: boolean, errorFieldDescriptionKeys: string[]}}</br>
     *      [result - object is valid]</br>
     *      [errorFieldDescriptionKeys - list of field descriptions keys with not valid values]</br>
     */
    validate(){

        const result = {
            result: true,
            errorFieldDescriptionKeys: []
        };

        for (const attrKey in this.fieldDescriptions) {
            if (this.data.hasOwnProperty(attrKey)) {
                const attr = this.fieldDescriptions[attrKey];
                if (attr.validatePattern === undefined)
                    continue;
                if (attr.validatePattern.validate(this.data[attrKey], attr.type))
                    continue;
            }
            result.valid = false;
            result.errorFieldDescriptionKeys.push(attrKey);
        }

        return result;

    }

    /**
     * Get object data to save
     *
     * @returns {{}}
     */
    toSave(){
        const data = {}
        for (const attrKey in this.fieldDescriptions) {
            data[attrKey] = this.toSaveAttribute(attrKey);
        }
        return data;
    }

    /**
     * Get value to save format by attribute name
     *
     * @param attrKey {string} Attribute key
     * @returns {*}
     */
    toSaveAttribute(attrKey){
        if (this.fieldDescriptions[attrKey].type === 'object'){
            return this.data[attrKey].ref;
        }
        return this.data[attrKey];
    }

    /**
     * Get json object data presentation to save
     *
     * @returns {string}
     */
    toJSON(){
        return JSON.stringify(this.toSave());
    }

}

export class DBTableObject{
    
    /**
     * Create object DBTableObject
     *
     * @constructor
     * @param db {DbConnector} database
     * @param tableName {string} Database table name
     * @param props {{}} additional object properties
     * @param props.fieldDescriptions {{DBFieldDescription}} Database table fields description
     * @param props.settings {TableSettings}
     * @param props.events {{}} - Callbacks
     * @param props.events.beforeLoad {function} use before load object (if it returns 'true' load will not execute)
     * @param props.events.onError {function(code,message)} on different errors
     */
    constructor(db, tableName, props={}) {
        
        this.db = db;
        this.tableName = tableName;
        this.settings = new TableSettings();
        this.fieldDescriptions = {};
        this.events = {};
        this.keyName = '';
        this.data = [];
        
        if (props.hasOwnProperty('fieldDescriptions')){
            this.setFieldDescriptions(props.fieldDescriptions);
            delete props.fieldDescriptions;
        }
        this.fillProps(props);
        
    }
    
    /**
     * Set object field descriptions
     *
     * @param fieldDescriptions {{}}}
     */
    setFieldDescriptions(fieldDescriptions){
        
        for (const key in fieldDescriptions) {
            this.setFieldDescription(key, fieldDescriptions[key])
        }
        
    }
    
    /**
     * Set object field description
     *
     * @param key {string}
     * @param value {DBFieldDescription}
     */
    setFieldDescription(key, value){
        
        this.fieldDescriptions[key] = value;
        if (value.isKey === true){
            this.keyName = key;
        }
        
    }
    
    /**
     * Inform subscribers "onError" event about errors
     *
     * @param code {number} error code
     * @param message {string} - error system message
     */
    onError(code=0, message=""){
        if (this.events.hasOwnProperty('onError')){
            this.events.onError(code, message, this);
        }
    }
    
    /**
     * Fill properties
     *
     * @this {DBSelectObject}
     * @param props {{}} Additional object properties
     */
    fillProps(props){
        
        for (const propsKey in props) {
            this[propsKey] = props[propsKey];
        }
        
    }
    
    /**
     * Reset data to default
     *
     * @this {DBSelectObject}
     */
    clear(){
        this.data = [];
    }
    
    /**
     * Get promise to load table object from database 'db'
     *
     * @returns {Promise<object>}
     */
    load(){
        
        return new Promise((resolve,reject)=>{
            
            if (this.events.hasOwnProperty('beforeLoad')
                && this.events.beforeLoad()){
                    resolve(undefined);
            }
            
            const props = {
                settings: this.settings
            }

            this.db.getTable(this.tableName, props)
                .then((data) => {
                    this.fill(data);
                    resolve(this.data);
                })
                .catch(reject);
            
        })
        
    }
    
    /**
     * Fill values by getting data
     *
     * @param data {{}} keys and values need to fill
     * @param clear {boolean} need to call 'clear' function before
     */
    fill(data, clear=true){
        
        if (clear)
            this.clear();
        
        if (data===undefined)
            return;
        
        for (const rowKey in data) {
            
            const row = data[rowKey];
            this.transformFillingRow(row)
            
            const curRow = this.getEmptyRow();
            for (const columnKey in row){
                
                if(!this.fieldDescriptions.hasOwnProperty(columnKey))
                    continue;
                
                curRow[columnKey] = row[columnKey];
                
                const fieldDescription = this.fieldDescriptions[columnKey];
                if (fieldDescription.type === 'object'){
                    curRow[columnKey].db = this.db;
                }
                
            }
            
            this.data.push(curRow);
        }
        
        
    }
    
    /**
     * Get empty row with default values
     *
     * @returns {{}}
     */
    getEmptyRow(){
        const result = {};
        for (const key in this.fieldDescriptions){
            result[key] =this.fieldDescriptions[key].defaultValue;
        }
        return result;
    }
    
    /**
     * Transform row before fill to object data
     *
     * @param row {{}}
     */
    transformFillingRow(row){}
    
    /**
     * Get keys list of rows in the hierarchy (include parent item)
     *
     * @param key {string|number} key of parent
     * @param parentName {string} field with parent keys
     * @returns {string[]|number[]}
     */
    getKeysInHierarchy(key, parentName='parent'){
        const treeKeys = [];
        const parent = this.data.find(el => el[this.keyName] === key);
        if (parent!==undefined){
            treeKeys.push(key);
            const children = this.data.filter(el => el[parentName] === key);
            children.forEach(child=>{
                if (treeKeys.indexOf(child[this.keyName]) < 0){
                    treeKeys.push(child[this.keyName])
                }
            })
        }
        return treeKeys;
    }
    
}

export class DBSelectObject extends DBTableObject{
    
    /**
     * Create object for selected elements from db
     *
     * @constructor
     * @this {DBSelectObject}
     * @param db {DbConnector} database
     * @param tableName {string} Database table name
     * @param props {{}} additional object properties
     * @param props.filters {FilterRule[]}
     * @param props.sorts {{}}
     * @param props.events {{}} - Callbacks
     * @param props.events.beforeLoad {function} use before load object (if it returns 'true' load will not execute)
     * @param props.events.onError {function(code,message)} on different errors
     */
    constructor(db, tableName, props) {
        
        super(db, tableName, props)
        
        if (!props.hasOwnProperty('keyName'))
            this.keyName = "ref";
        if (!props.hasOwnProperty('presentationName'))
            this.presentationName = "presentation";
        
    }
    
    /**
     * Fill values by getting data
     *
     * @param data {{}} keys and values need to fill
     * @param clear {boolean} need to call 'clear' function before
     */
    fill(data, clear=true){
        
        if (clear)
            this.clear();
        
        if (data===undefined)
            return;
        
        for (const rowKey in data) {
            const row = data[rowKey];
            this.data.push({
                ref: row[this.keyName],
                presentation: row[this.presentationName]
            });
        }
        
        
    }
    
}

export class TableSettings{
    
    /**
     * Table settings for data array
     *
     * @constructor
     * @param settings {{}} table settings
     * @param settings.filters {FilterRule[]} filter rules
     * @param settings.sorts {SortRule[]} sort rules
     */
    constructor(settings = {}) {
        this.filters = {};
        this.sorts = {};
        this.addSettings(settings);
    }
    
    /**
     * Add settings
     *
     * @param settings {{}} table settings
     * @param settings.filters {FilterRule[]} filter rules
     * @param settings.sorts {SortRule[]} sort rules
     */
    addSettings(settings = {}){
        if (settings.hasOwnProperty('filters'))
            this.addFilters(settings.filters);
        if (settings.hasOwnProperty('sorts'))
            this.addFilters(settings.sorts);
    }
    
    /**
     * Add filter rules
     *
     * @param rules {{}|FilterRule[]} additional filter rules
     */
    addFilters(rules){
        for (const key of Object.keys(rules)) {
            this.addFilter(key, rules[key])
        }
    }
    
    /**
     * Add sort rules
     *
     * @param rules {{}|SortRule[]} additional filter rules
     */
    addSorts(rules){
        for (const key of Object.keys(rules)) {
            this.addSort(key, rules[key])
        }
    }
    
    /**
     * Add filter rule
     *
     * @param key {string} filter key
     * @param rule {FilterRule} filter rule |
     * @param rule {string} compare type
     * @param value {*=undefined} compare value (not using if 'rule' param is 'FilterRule')
     */
    addFilter(key, rule, value = undefined){

        if (typeof rule === 'string'){
            this.filters[key] = new FilterRule(key, rule, value);
            return;
        }
        if (rule instanceof FilterRule){
            this.filters[key] = rule;
        }
    }
    
    /**
     * Add sort rule
     *
     * @param key {string} filter key
     * @param rule {SortRule} sort rule |
     * @param rule {boolean} sort order is descending
     */
    addSort(key, rule= false){
        if (typeof rule === 'boolean'){
            this.sorts[key] = new SortRule(key, rule);
            return;
        }
        if (rule instanceof SortRule){
            this.sorts[key] = rule;
        }
    }
    
    /**
     * Delete filter rule
     *
     * @param key {string}
     */
    deleteFilter(key){
        delete this.filters[key]
    }
    
    /**
     * Delete sort rule
     *
     * @param key {string}
     */
    deleteSort(key){
        delete this.filters[key]
    }
    
    /**
     * Clear all settings
     */
    clear(){
        this.clearFilters();
        this.clearSorts();
    }
    
    /**
     * Clear filters list
     */
    clearFilters(){
        this.filters = {};
    }
    
    /**
     * Clear sort list
     */
    clearSorts(){
        this.sorts = {};
    }
    
    apply(data){
        if (data.length!==0){
            this.filter(data);
            this.sort(data);
        }
    }
    
    /**
     * Filter data array by filter rules
     *
     * @param data {[{}]} array with filtering data
     * @return {[]}
     */
    filter(data){
        
        for (const key in this.filters) {
            if (data.length === 0 ) break;
            this.filters[key].apply(data)
        }
        
    }
    
    /**
     * Sort data array by sort rules
     *
     * @param data {[{}]} array with sorting data
     */
    sort(data){

        if (data.length===0)
            return;
        
        for (const key in this.sorts) {
            this.sorts[key].apply(data)
        }
        
    }
    
    /**
     * Get data to save filter rules
     *
     * @returns {{filters: FilterRule[], sorts: SortRule[]}}
     */
    toSave(){
        const result = {
            filters: [],
            sorts: []
        };
        for (const key of Object.keys(this.filters)) {
            result.push(this.filters[key].toSave())
        }
        for (const key of Object.keys(this.sorts)) {
            result.push(this.sorts[key].toSave())
        }
        return result;
    }
    
    /**
     * Get filter rules like json data
     *
     * @returns {string}
     */
    toJSON(){
        return JSON.stringify(this.toSave());
    }
    
}

export class FilterRule {
    
    /**
     * Filter rule
     *
     * @constructor
     * @param field {string} field name
     * @param type {string} compare type
     * @param value {any} compare value
     */
    constructor(field='', type='', value) {
        
        this.setField(field);
        this.setType(type);
        this.setValue(value);
        
    }
    
    /**
     * Filter can be using
     *
     * @returns {boolean}
     */
    isCorrect(){
        return !(this.field==='' || this.type === '')
    }
    
    /**
     * Set field name
     *
     * @param field
     */
    setField(field){
        this.field = field
    }
    
    /**
     * Set compare type
     *
     * @param type
     */
    setType(type){
        this.type = type;
    }
    
    /**
     * Set compare value
     *
     * @param value
     */
    setValue(value){
        if (this.type === FILTER_RULE_TYPE.date.between){
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
    
    /**
     * Filter data array by filter rules
     *
     * @param data {[{}]} array with data for filtering
     */
    apply(data){
        
        if (!this.isCorrect())
            return;
        
        
        for (let i = data.length-1; i >= 0; i--){
            if (!this.check(data[i])){
                data.splice(i,1);
            }
        }

    }
    
    /**
     * Check data line
     *
     * @param line {{}} data line
     * @returns {boolean}
     */
    check(line){
        
        const value = (typeof this.value === 'function')
            ? this.value()
            : this.value;
        
        switch (this.type){
            case FILTER_RULE_TYPE.number.equally: return line[this.field] === value;
            case FILTER_RULE_TYPE.number.notEqually: return line[this.field] !== value;
            case FILTER_RULE_TYPE.number.more: return line[this.field] > value;
            case FILTER_RULE_TYPE.number.less: return line[this.field] < value;
            case FILTER_RULE_TYPE.number.moreOrEqually: return line[this.field] >= value;
            case FILTER_RULE_TYPE.number.lessOrEqually: return line[this.field] <= value;
            case FILTER_RULE_TYPE.date.between:{
                return (this.value.min === undefined || line[this.field]>=value.min)
                    && (this.value.max === undefined || line[this.field]<=value.max)
            }
            case FILTER_RULE_TYPE.number.in:{
                return value.includes(line[this.field])
            }
            default: return false;
        }
    }
    
    /**
     * Get data to save filter rule
     *
     * @returns {{field:string,type:string,value:*}}
     */
    toSave(){
        return {
            field: this.field,
            type: this.type,
            value: this.value
        }
        
    }
    
    /**
     * Get filter rule like json data
     *
     * @returns {string}
     */
    toJSON(){
        return JSON.stringify(this.toSave());
    }
    
}

export class SortRule {
    
    /**
     * Sort rule
     *
     * @constructor
     * @param field {string} field name
     * @param isDesc {boolean} sort order is descending
     */
    constructor(field, isDesc= false) {
        this.field = field;
        this.isDesc = isDesc;
    }
    
    /**
     * Sort data array by filter rules
     *
     * @param data {[{}]} array with data for sorting
     * @return {[]}
     */
    apply(data){
    
        const direction = (this.isDesc) ? -1 : 1;
        const antiDirection = (this.isDesc) ? 1 : -1;
        data.sort((a,b)=>{
            return (a[this.field]>b[this.field]) ? direction : antiDirection;
        })
    
    }
    
}

export const FILTER_RULE_TYPE = {
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


export class DBFieldDescription{
    
    /**
     * Create object DBFieldDescription
     *
     * @constructor
     * @this {DBFieldDescription}
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [type {string} Field type name],<br/>
     *      [defaultValue {*} Default value],<br/>
     *      [isKey {boolean} Is the field a key],<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other],<br/>
     *      [validatePattern {ValidatePattern}],<br/>
     *      [title {string} - column name for user],<br/>
     *      [show {boolean} - show in form],<br/>
     *   )
     */
    constructor(props={}) {
        
        this.type = (props.type) ? props.type : 'string';
        this.defaultValue = (props.defaultValue===undefined)
            ? this.getDefaultValueByType(this.type) : props.defaultValue;
        this.isKey = (props.isKey === true);
        this.definePropertyPattern = props.definePropertyPattern;
        this.validatePattern = props.validatePattern;
        this.title = (props.title) ? (props.title) : '';
        this.show = (props.show===undefined) ? true: props.show;
        if (props.hasOwnProperty('refFilters'))
            this.refFilters = props.refFilters;
        if (props.hasOwnProperty('refSorts'))
            this.refSorts = props.refSorts;
    }
    
    /**
     * Get default value by field type
     *
     * @param type {string} Field type
     * @returns {string|boolean|number|undefined}
     */
    getDefaultValueByType(type){
        switch (type){
            case 'string': return '';
            case 'number': return 0;
            case 'boolean': return false;
            default: return undefined;
        }
    }
    
}

export class DBFieldDescriptionBoolean extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionBoolean
     *
     * @constructor
     * @this DBFieldDescriptionBoolean
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {boolean} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'boolean';
        props['defaultValue'] = false;
        super(props);
    }
    
}

export class DBFieldDescriptionString extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionString
     *
     * @constructor
     * @this DBFieldDescriptionString
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {boolean} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'string';
        props['defaultValue'] = '';
        super(props);
    }
    
}

export class DBFieldDescriptionHTML extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionHTML
     *
     * @constructor
     * @this DBFieldDescriptionHTML
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {boolean} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'html';
        props['defaultValue'] = '';
        super(props);
    }
    
}

export class DBFieldDescriptionNumber extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionNumber
     *
     * @constructor
     * @this DBFieldDescriptionNumber
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {boolean} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'number';
        props['defaultValue'] = 0;
        super(props);
    }
    
}

export class DBFieldDescriptionId extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionId
     *
     * @constructor
     * @this DBFieldDescriptionId
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {string} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['isKey'] = true;
        props['type'] = 'number';
        props['defaultValue'] = -1;
        props['show'] = false;
        super(props);
    }
    
}

export class DBFieldDescriptionUID extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionUID
     *
     * @constructor
     * @this DBFieldDescriptionUID
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {boolean} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['isKey'] = true;
        props['type'] = 'string';
        props['defaultValue'] = "00000000-0000-0000-0000-000000000000";
        props['show'] = false;
        super(props);
    }
    
}

export class DBFieldDescriptionDate extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionDate
     *
     * @constructor
     * @this {DBFieldDescriptionDate}
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {boolean} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'date';
        if (!props.hasOwnProperty('defaultValue'))
            props['defaultValue'] = undefined;
        super(props);
    }
    
}

export class DBFieldDescriptionObject  extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionObject
     *
     * @constructor
     * @this {DBFieldDescriptionObject}
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {boolean} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'object';
        props['defaultValue'] = {
            ref: -1,
            refTable: props.refTable,
            presentation: '',
            db: props.db
        };
        super(props);
    }
    
}

export class DBFieldDescriptionStructure  extends DBFieldDescription{
    
    /**
     * Create object DBFieldDescriptionStructure
     *
     * @constructor
     * @this {DBFieldDescriptionStructure}
     * @param props {{}} properties<br/>
     *   (Using properties:<br/>
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {boolean} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'structure';
        props['defaultValue'] = {};
        super(props);
    }
    
}


export class ValidatePattern{
    
    /**
     * Create object ValidatePattern
     *
     * @constructor
     * @this {ValidatePattern}
     * @param check {boolean} Is need to check validate
     * @param emptyValue {*} Value witch compare which validation value
     * @param validateFunc {function} Validate function which return validate result
     *        If (validateFunc === undefined) validate compare value with emptyValue
     */
    constructor(check=false, emptyValue=undefined, validateFunc=undefined) {
        
        this.check = check;
        this.emptyValue = emptyValue;
        this.validateFunc = validateFunc;
        
    }
    
    /**
     * Validate value by current pattern
     *
     * @param value {*} Value which need to validate
     * @param type {string} Value type for definition emptyValue.
     *          Relevant only when 'validateFunc' and 'emptyValue' are undefined
     * @returns {boolean}
     */
    validate(value, type){
        
        if (!this.check)
            return true;
        
        if (this.validateFunc)
            return this.validateFunc(value, type);
        
        const emptyValue = (this.emptyValue===undefined)
            ? this.getEmptyValueByType(type)
            : this.emptyValue;
        
        return value !== emptyValue
        
    }
    
    /**
     * Get default value by field type
     *
     * @param type {string} Field type
     * @returns {string|boolean|number|undefined}
     */
    getEmptyValueByType(type){
        
        switch (type){
            case 'string': return '';
            case 'number': return 0;
            case 'boolean': return false;
            default: return undefined;
        }
        
    }
    
}

export class ValidatePatternBoolean extends ValidatePattern{
    
    /**
     * Create object ValidatePatternBoolean
     *
     * @constructor
     * @this {ValidatePatternBoolean}
     */
    constructor() {
        super(true, false);
    }
    
}

export class ValidatePatternString extends ValidatePattern{
    
    /**
     * Create object ValidatePatternString
     *
     * @constructor
     * @this {ValidatePatternString}
     */
    constructor() {
        super(true, '');
    }
    
}
