// ========================================================================
// DATABASE CONNECTOR (Version 1.0.1 original) (C) 2023 Mylnikov Denis
// =========================================================================

"use strict";

export class DbConnector {
    
    /**
     * Create database connector
     *
     * @constructor
     * @param events {{}} functions on different events
     * @param events.onError {function(code,message,source)} on different errors
     */
    constructor(events) {
        this.events = events
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
     * Connect to database
     *
     * @param params {{}} API connect parameters (login, password, e.t.c.)
     * @returns {Promise<boolean>} promise result - database is connected
     */
    connect(params={}){
        return Promise.resolve(true);
    }
    
    /**
     * Delete database
     *
     * @returns {Promise<boolean>} promise result - database is deleted
     */
    deleteDB(){
        return Promise.resolve(false);
    }
    
    /**
     * Create new table in database
     *
     * @param tableName {string} Name of creation table
     * @param props {{}} properties
     * @returns {Promise<boolean>} promise result - table is created
     */
    createTable(tableName, props={}){
        return Promise.resolve(false);
    }
    
    /**
     * Delete all table's rows
     *
     * @param tableName {string} Name of clearing table
     * @returns {Promise<boolean>} promise result - table was cleared
     */
    clearTable(tableName){
        return Promise.resolve(false);
    }
    
    /**
     * Get array with table's rows
     *
     * @param tableName {string} Name of table in database
     * @param props {{}} properties<br/>
     *  (Using properties:<br/>
     *      [filters {{}} ],<br/>
     *      [sorts {{}} ],<br/>
     * @returns {Promise<*[]>}
     */
    getTable(tableName, props={}){
        return Promise.resolve([]);
    }
    
    /**
     * Save records to database table
     *
     * @param tableName {string} Name of table
     * @param records {[]} database records
     * @returns {Promise<boolean>} promise result - records are saved
     */
    saveRecords(tableName, records=[]){
        return Promise.resolve(false);
    }
    
    /**
     * Get Record from database table by simple key
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<object>}
     */
    getRecord(tableName, key){
        return Promise.resolve({});
    }
    
    /**
     * Save record to database table by simple key
     *
     * @param tableName {string} Name of table
     * @param record {{}} database record
     * @param key {string|number|undefined} Key's value
     * @returns {Promise<any>} promise result - record is saved
     */
    saveRecord(tableName, record, key=undefined){
        return Promise.resolve(false)
    }
    
    /**
     * Delete record
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<boolean>}
     */
    deleteRecord(tableName, key){
        return Promise.resolve(false)
    }
    
    /**
     * Generate UUID
     *
     * @return {string}
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
}

export class ApiDBConnector extends DbConnector{
    
    /**
     * Create database connector
     *
     * @constructor
     * @param path {string} path to API
     * @param version {string|number} API version
     */
    constructor(path='', version='') {
        super({});
        this.path = path;
        this.version = version
    }
    
    /**
     * Connect to database
     *
     * @param params {{}} API connect parameters (login, password, e.t.c.)
     * @returns {Promise<boolean>} promise result - database is connected
     */
    connect(params={}){
        return new Promise((resolve)=>{
            this.connectParams = params;
            resolve(true);
        })
    }
    
    /**
     * Get array with table's rows
     *
     * @param tableName {string} Name of table in database
     * @param props {{}} properties<br/>
     *  (Using properties:<br/>
     *      [filters {{}} ],<br/>
     *      [sorts {{}} ],<br/>
     * @returns {Promise<*[]>}
     */
    getTable(tableName, props={}){
        return this.queryJson(
            this.path+"/"+tableName+"?v="+this.version,
            {method: "POST", headers: this.connectParams, body: JSON.stringify(props)}
        ).then(
            function (data){return Promise.resolve(data)},
            function (){return Promise.resolve(undefined)}
        )
    }
    
    /**
     * Get Record from database table by simple key
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<object>}
     */
    getRecord(tableName, key){
        return this.queryJson(
            this.path+"/"+tableName+"?v="+this.version+"&ref="+key,
            {method: "GET", headers: this.connectParams}
        ).then(
            function (data){
                return Promise.resolve(data)
            },
            function (){
                return Promise.resolve(undefined)
            }
        )
        
    }

    /**
     * Get Record from database table by simple key
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<object>}
     */
    getRecordPresentation(tableName, key){
        return this.queryJson(
            this.path+"/"+tableName+"?v="+this.version+"&ref="+key+"&main",
            {method: "GET", headers: this.connectParams}
        ).then(
            function (data){
                return Promise.resolve(data.presentation)
            },
            function (){
                return Promise.resolve(undefined)
            }
        )

    }
    
    /**
     * Save record to database table by simple key
     *
     * @param tableName {string} Name of table
     * @param record {{}} database record
     * @param key {string|number|undefined} Key's value
     * @returns {Promise<any>} promise result - record is saved
     */
    saveRecord(tableName, record, key=undefined){
        let path = this.path+"/"+tableName+"?v="+this.version;
        if (key!==undefined){ path += "&ref="+key }
        return this.queryJson(
            path,
            {
                method: "PUT",
                headers: this.connectParams,
                body: JSON.stringify(record)
            }
        ).then(
            function (data){
                return Promise.resolve(data)
            },
            function (){return Promise.resolve(false)}
        )
        
    }
    
    /**
     * Delete record
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<boolean>}
     */
    deleteRecord(tableName, key){
        return this.queryJson(
            this.path+"/"+tableName+"?v="+this.version+"&ref="+key,
            {method: "DELETE", headers: this.connectParams}
        )
            .then(
                function (){return Promise.resolve(true)},
                function (){return Promise.resolve(false)}
            )
    }
    
    /**
     * Send request to API
     *
     * @param path {string} path to API
     * @param options {{}} API options</br>
     *  (Using options: </br>
     *      [method {string} request method, "GET" by default],</br>
     *      [header {{}} request headers],</br>
     *      [body {string} request body],</br>
     * @returns {Promise<unknown>}
     */
    queryJson(path, options){
        
        return new Promise((resolve, reject)=>{
            
            const method = (options.hasOwnProperty("method")) ? options.method : "GET";
            const body = (options.hasOwnProperty("body") ? options.body : null);
            
            const xhr = new XMLHttpRequest();
            
            xhr.open(method, path);
            xhr.responseType = "text";
            if (options.hasOwnProperty("headers")){
                for (const key in options.headers) {
                    xhr.setRequestHeader(key, options.headers[key])
                }
            }
            xhr.send(body);
            xhr.onload = ()=>{
                let result = undefined
                try{
                    result = JSON.parse(xhr.response)
                }catch{
                    this.onError(0, "Answer is not JSON: "+xhr.response)
                    reject(undefined)
                    return;
                }
                if (!result.hasOwnProperty("hasErrors") || !result.hasOwnProperty("data")){
                    this.onError(0, "Answer is not valid: "+xhr.response)
                    reject(undefined)
                    return;
                }
                if (result.hasErrors){
                    this.onError(0, "Server answer with error result: "+xhr.response)
                    reject(undefined)
                    return;
                }
                resolve(result.data);
            };
            xhr.onerror = (error)=>{
                this.onError(0, "Server error: "+error.message)
                reject(undefined)
            };
            
        })
        
    }
    
    
}

export class IndexedDBConnector extends DbConnector{
    
    /**
     * Generate Sketch IndexDB connector
     *
     * @param db {IndexedDB} database Indexed DB
     * @param props {{}}
     * @param props.events {{}} functions on different events
     * @param props.events.onError {function(code,message,source)} on different errors
     * @param props.events.onUpgradeneeded {function(code,message,source)} on create db or change database version<br/>
     *      (by default - execute update by 'tables' parameters)
     */
    constructor(db, props={}) {
        
        super(props.hasOwnProperty('events') ? props.events : {});
        this.db = db;
        this.db.events = {
            onError: this.onError.bind(this),
            onUpgradeneeded: this.onUpgradeneeded.bind(this)
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
     * Action on create or change database version
     *
     * @param dbConnect {IDBDatabase} database
     * @returns {boolean}
     */
    onUpgradeneeded(dbConnect){
        if (this.events.hasOwnProperty('onUpgradeneeded')){
            return this.events.onUpgradeneeded(dbConnect);
        }
        return false
    }
    
    /**
     * Connect to database
     *
     * @param params {{}} not using
     * @returns {Promise<boolean>} promise result - database is connected
     *  if return = false then execute "onError" event with code 1
     */
    connect(params={}){
        return this.db.connect();
    }
    
    /**
     * Delete database
     *
     * @returns {Promise<boolean>} promise result - database is deleted
     */
    deleteDB(){
        return this.db.deleteDB();
    }
    
    /**
     * Get array with table's rows
     *
     * @param tableName {string} Name of table in database
     * @param props {{}} properties
     * @param props.settings {TableSettings|undefined} setting for getting data
     * @returns {Promise<*[]>}
     */
    getTable(tableName, props={}){
        
        return this.db.getTable(tableName)
            .then(data=> {
                if (props.hasOwnProperty('settings'))
                    props.settings.apply(data)
                this.transformGottenTable(data, tableName, props);
                return Promise.resolve(data)
            })
        
    }
    
    /**
     * Transformation getting from database table data after loading, filter and sorting
     *
     * @param data {*[]} loaded data
     * @param tableName {string} Name of table
     * @param props {{}} properties
     */
    transformGottenTable(data, tableName, props){}
    
    /**
     * Get Record from database table by simple key
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<object>}
     */
    getRecord(tableName, key){
        
        return this.db.getRecord(tableName, key).then(data=>{
            const result = this.transformGottenRecord(data, tableName, key)
            return Promise.resolve(  result );
        })
        
    }
    
    /**
     * Transformation getting from database record data after loading
     *
     * @param data {{}} loaded data
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {{}}
     */
    transformGottenRecord(data, tableName, key){return data}
    
    /**
     * Save record to database table by simple key
     *
     * @param tableName {string} Name of table
     * @param record {{}} database record
     * @param key {string|number|undefined} Key's value
     * @returns {Promise<boolean>} promise result - record is saved
     */
    saveRecord(tableName, record, key= undefined){
        return this.db.saveRecord(tableName, record, key);
    }
    
    /**
     * Delete record
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<boolean>}
     */
    deleteRecord(tableName, key){
        return this.db.deleteRecord(tableName, key)
    }
    
    
}