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
     *      [isKey {boolean} Is the field a key]<br/>
     *      [definePropertyPattern {{}} Define properties: getter, setter, other]<br/>
     *      [validatePattern {ValidatePattern}]<br/>
     *      [title {string} - column name for user]<br/>
     *      [show {string} - show in form]<br/>
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
     *      [show {string} - show in form]<br/>
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
     *      [show {string} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'string';
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
     *      [show {string} - show in form]<br/>
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
     *      [show {string} - show in form]<br/>
     *   )
     */
    constructor(props={}) {
        props['type'] = 'date';
        props['defaultValue'] = undefined;
        super(props);
    }
}

export class DBFieldDescriptionObject  extends DBFieldDescription{

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
     *      [show {string} - show in form]<br/>
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


export class DBObject {

    /**
     * Create object DBObject
     *
     * @constructor
     * @this {DBObject}
     * @param db {Database}
     * @param tableName {string} Database table name
     * @param key {string|number} Database key record value
     * @param attributes {{key:DBFieldDescription}} Database record fields description
     * @param events {{key:function}} Callbacks <br/>
     *   (Using events:<br/>
     *      ['beforeSave' - use before save object (if it returns 'true' save will not execute)],<br/>
     *      ['beforeLoad' - use before load object (if it returns 'true' load will not execute)],<br/>
     *      ['beforeDelete' - use before delete object (if it returns 'true' delete don't execute)]<br/>
     *   )
     */
    constructor(db, tableName, key, attributes={}, events={}) {
        this.db = db;
        this._tableName = tableName;
        this._attributes = attributes;
        this._validates = {};
        this._errors = {};
        this._events = events;
        this.data = {};
        for (const attrKey in this._attributes) {
            const attr = this._attributes[attrKey];
            this.data[attrKey] = attr.defaultValue;
            if (attr.isKey === true){
                this._keyName = attrKey;
                if (key!==undefined)
                    this.data[attrKey] = key;
            }
            if (attr.definePropertyPattern){
                Object.defineProperty(this, attrKey, attr.definePropertyPattern);
            }
            if (attr.type==='object'){
                this.data[attrKey].db = db;
            }

        }

        this[this._keyName] = this.data[this._keyName];

    }

    /**
     * Reset errors and data to default values
     *
     * @this {DBObject}
     */
    clear(){
        this._errors = {};
        this.data = {};
        for (const attrKey in this._attributes) {
            if (attrKey === this._keyName)
                continue;
            this.data[attrKey] = this._attributes[attrKey].defaultValue;
        }
    }

    /**
     * Get promise to Save object to database 'db'
     *
     * @this {DBObject}
     * @returns {Promise<undefined>}
     */
    save(){
        return new Promise((resolve,reject)=> {

            if (this._events.hasOwnProperty('beforeSave')
                && this._events.beforeSave()){
                    resolve();
            }

            if (this[this._keyName]!==undefined && !this.validate()){
                reject(new Error('Object validate has errors'));
            }
            this.db.saveRecord(this._tableName, this[this._keyName], this.toSave())
                .then(resolve, reject);

        })
    }

    /**
     * Get promise to Load object from database 'db'
     *
     * @this {DBObject}
     * @returns {Promise<object|undefined>}
     */
    load(){

        return new Promise((resolve,reject)=>{

            if (this._events.hasOwnProperty('beforeLoad')
                && this._events.beforeLoad()){
                resolve(undefined);
            }

            if (this[this._keyName]===undefined) {
                this.clear()
                resolve()
            }

            this.db.getRecord(this._tableName, this._keyName, this[this._keyName])
                .then((data) => {
                    this.fill(data)
                    resolve(data)
                })
                .catch(reject);

        })
    }

    /**
     * Get promise to Delete object from database 'db'
     *
     * @this {DBObject}
     * @returns {Promise<undefined>}
     */
    delete(){
        return new Promise((resolve,reject)=>{
            if (this._events.hasOwnProperty('beforeDelete')
                && this._events.beforeDelete()){
                resolve(undefined);
            }

            this.db.deleteRecord(this._tableName, this._keyName, this[this._keyName])
                .then(resolve)
                .catch(reject);
        })
    }

    /**
     * Fill values which present in attributes
     *
     * @this {DBObject}
     * @param data {{}} keys and values need to fill
     * @param clear {boolean} need to call 'clear' function before
     */
    fill(data, clear=true){

        if (clear)
            this.clear();

        if (data===undefined)
            return;

        for (const dataKey in data) {
            if(this._attributes.hasOwnProperty(dataKey)){
                this.data[dataKey] = data[dataKey];
                if(this._attributes[dataKey].type==='object'){
                    this.data[dataKey].db = this.db;
                }
            }
        }

    }

    /**
     * Validate object attributes
     *
     * @returns {boolean} true = valid; false = not valid
     */
    validate(){

        this._errors = {
            result: true,
            attributes: []
        };

        for (const attrKey in this._attributes) {
            if (this.data.hasOwnProperty(attrKey)) {
                const attr = this._attributes[attrKey];
                if (attr.validatePattern === undefined)
                    continue;
                if (attr.validatePattern.validate(this.data[attrKey], attr.type))
                    continue;
            }
            this._errors.attributes.push(attrKey);
            this._errors.result = false;
        }

        if (this._errors.result){
            this._errors = {};
            return true;
        }

        return false;

    }


    /**
     * Get object data to save
     *
     * @returns {{}}
     */
    toSave(){
        const data = {}
        for (const attrKey in this._attributes) {
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
        if (this._attributes[attrKey].type === 'object'){
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

export class DBObjectUID extends DBObject{

    constructor(db, tableName, uid, attributes, events) {
        attributes.uid = new DBFieldDescriptionString({
            isKey: true,
            validatePattern: new ValidatePattern(true, '', undefined)
        })
        super(db, tableName, uid, attributes, events);
    }

}

export class DBObjectID extends DBObject{

    constructor(db, tableName, key, attributes, events) {
        attributes.id = new DBFieldDescriptionNumber({
            isKey: true,
            validatePattern: new ValidatePattern(true, '', undefined)
        })
        super(db, tableName, key, attributes, events);
    }

}

export class DBTableObject{

    constructor(db, tableName, attributes = {}, events={}) {

        this.db = db;
        this._tableName = tableName;
        this._attributes = attributes;
        this._errors = {};
        this._events = events;
        for (const attrKey in this._attributes) {
            const attr = this._attributes[attrKey];
            if (attr.isKey === true){
                this._keyName = attrKey;
            }
        }
        this.data = [];
    }

    clear(){
        this.data = [];
        this._errors = {};
    }

    load(){

        return new Promise((resolve,reject)=>{

            if (this._events.hasOwnProperty('beforeLoad')
                && this._events.beforeLoad()){
                resolve(undefined);
            }

            this.db.getTable(this._tableName)
                .then((data) => {
                    this.fill(data);
                    resolve(data);
                })
                .catch(reject);

        })

    }

    getEmptyRow(){
        const result = {};
        for (const attr in this._attributes){
            result[attr] =this._attributes[attr].defaultValue;
        }
        return result;
    }

    fill(data, clear=true){

        if (clear)
            this.clear();

        if (data===undefined)
            return;

        for (const rowKey in data) {
            const row = data[rowKey];
            const curRow = this.getEmptyRow();
            for (const columnKey in row){
                if(this._attributes.hasOwnProperty(columnKey)){
                    curRow[columnKey] = row[columnKey];
                    const attr = this._attributes[columnKey];
                    if (attr.type === 'object'){
                        curRow[columnKey].db = this.db;
                    }
                }
            }
            this.data.push(curRow);
        }


    }


}

export class DBSelectObject{

    constructor(db, tableName, keyName="ref", presentationName="presentation", events={}) {

        this.db = db;
        this._tableName = tableName;
        this._keyName = keyName;
        this._presentationName = presentationName;
        this._events = events;
        this.data = [];
        this._errors = {};
    }

    clear(){
        this.data = [];
        this._errors = {};
    }

    load(){

        return new Promise((resolve,reject)=>{

            if (this._events.hasOwnProperty('beforeLoad')
                && this._events.beforeLoad()){
                resolve(undefined);
            }

            this.db.getTableForSelect(this._tableName)
                .then((data) => {
                    this.fill(data);
                    resolve(data);
                })
                .catch(reject);

        })

    }

    fill(data, clear=true){

        if (clear)
            this.clear();

        if (data===undefined)
            return;

        for (const rowKey in data) {
            this.data.push({
                ref: data[rowKey][this._keyName],
                presentation: data[rowKey][this._presentationName]
            });
        }


    }

}