// ========================================================================
// INDEXED DATABASE (Version 1.0.0 original) (C) 2023 Mylnikov Denis
// =========================================================================

"use strict";

IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

export class IndexedDBTableScheme{
    
    /**
     * Table (store) Scheme for indexed DB
     * @param tableName {string} table (store) name
     * @param keyPath {string|undefined} name of field with key
     * @param autoIncrement {boolean}
     */
    constructor(tableName, keyPath = undefined, autoIncrement= false) {
        
        this.name = tableName;
        this.keyPath = keyPath;
        this.autoIncrement = autoIncrement;
        
        Object.defineProperty(this, 'keyOptions', {
            get(){
                const result = {};
                if (this.keyPath!==undefined)
                    result.keyPath = this.keyPath;
                if (!this.autoIncrement)
                    result.autoIncrement = this.autoIncrement;
                return result;
            }
        })
        
    }
    
}

export class IndexedDB{
    
    /**
     * Database connector to "IndexedDB" database
     *
     * @constructor
     * @param key {string} database key
     * @param version {number} database version
     * @param tables {IndexedDBTableScheme[]} database tables schemes
     * @param events {{}} functions on different events<br/>
     * @param events.onUpgradeneeded {function(code,message,source)} on create db or change database version<br/>
     *      (by default - execute update by 'tables' parameters)<br/>
     * @param events.onError {function(code,message,source)} on different errors:
     *      code = 1 - DB connect error;<br/>
     *      code = 2 - DB delete error;<br/>
     *      code = 3 - DB version is old;<br/>
     *      code = 4 - DB blocked;<br/>
     *      code = 5 - DB disconnected;<br/>
     *      code = 10 - Create new table error;<br/>
     *      code = 11 - Clear table error;<br/>
     *      code = 12 - Save table error;<br/>
     *      code = 13 - Get records error;<br/>
     *      code = 14 - Delete records error;<br/>
     *  )
     */
    constructor(key, version, tables, events={}) {
        this.key = key;
        this.version = version;
        this.tables = tables;
        this.db = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.dbConnect = undefined;
        this.events = events;
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
     * Actions on upgrade Indexed Database
     */
    onUpgradeneeded(){
    
        if (this.events.hasOwnProperty('onUpgradeneeded')){
            const cancel = this.events.onUpgradeneeded(this.dbConnect);
            if (cancel) return
        }
        
        const tablesInDB = this.dbConnect.objectStoreNames.length;
        for(let i=0; i<tablesInDB; i++){
            const tableInDB = this.dbConnect.objectStoreNames[i];
            if (!this.tables.some(el=>el.name===tableInDB)){
                this.dbConnect.deleteObjectStore(tableInDB)
            }
        }
        
        this.tables.forEach(table=>{
            if (!this.dbConnect.objectStoreNames.contains(table.name)){
                this.dbConnect.createObjectStore(table.name, table.keyOptions);
            }
        })
        
    }
    
    /**
     * Connect to database
     *
     * @this {IndexedDB}
     * @returns {Promise<boolean>} promise result - database is connected
     *  if return = false then execute "onError" event with code 1
     */
    connect(){

        return new Promise((resolve, reject)=> {
    
            const DBRequest = this.db.open(this.key, this.version);
    
            DBRequest.onupgradeneeded = () => {
                this.dbConnect = DBRequest.result;
                this.onUpgradeneeded()
            };
    
            DBRequest.onerror = (error) => {
                this.dbConnect = undefined;
                this.onError(1, "DB '" + this.key + "' connect error: " + error.message);
                reject(false);
            };
    
            DBRequest.onsuccess = () => {
                this.dbConnect = DBRequest.result;
                this.dbConnect.onversionchange = () => {
                    this.onError(3, "DB version is old. Restart page");
                    this.dbConnect.close();
                };
                this.dbConnect.onblocked = () => {
                    this.onError(4, "DB is blocked. Close other pages with application");
                };
                resolve(true)
            }

        })
        
    }

    /**
     * Delete database
     *
     * @this {IndexedDB}
     * @returns {Promise<boolean>} promise result - database is deleted
     */
    deleteDB(){
        
        return new Promise((resolve,reject)=>{
    
            const DBRequest = this.db.deleteDatabase(this.key);
    
            DBRequest.onerror = (error) => {
                this.onError(2, "DB '" + this.key + "' delete error: " + error.message);
                reject(false);
            };
    
            DBRequest.onsuccess = () => {
                this.dbConnect = undefined;
                resolve(true)
            }
            
        })
    }
    
    /**
     * Create new table in database
     *
     * @this {IndexedDB}
     * @param tableName {string} Name of creation table
     * @param props {{}} properties</br>
     *  (Using properties
     *      [keyPath {string} - name of primary key in row data],</br>
     *      [autoIncrement {boolean} - do key autoincrement],</br>
     *  )
     * @returns {Promise<boolean>} promise result - table is created
     */
    createTable(tableName, props={}){
        return new Promise((resolve,reject)=>{
            try{
                this.dbConnect.createObjectStore(tableName, props);
                resolve(true);
            }catch(error){
                this.onError(10, "Create new table '" + tableName + "' error: " + error.message)
                reject(false)
            }
        })
        
    }
    
    /**
     * Delete all table's rows
     *
     * @param tableName {string} Name of clearing table
     * @returns {Promise<boolean>} promise result - table was cleared
     */
    clearTable(tableName){
        return new Promise((resolve, reject)=>{
            
            if (this.dbConnect === undefined){
                this.onError(5, "DB disconnected");
                reject(false);
            }
            
            const transaction = this.dbConnect.transaction([tableName], "readwrite");
            const Store = transaction.objectStore(tableName);
            const request = Store.clear();
            request.onsuccess = function (){
                resolve(true)
            }
            request.onerror = (error) => {
                this.onError(11, "Clear table '" + tableName + "' error: " + error.message);
                reject(false);
            }
        })
    }
    
    /**
     * Get array with table's rows
     *
     * @param tableName {string} Name of table in database
     * @returns {Promise<*[]>}
     */
    getTable(tableName){

        return new Promise((resolve, reject)=> {

            if (this.dbConnect === undefined) {
                this.onError(5, "DB disconnected");
                reject(false);
            }

            const transaction = this.dbConnect.transaction([tableName], "readonly");
            const Store = transaction.objectStore(tableName);
            const request = Store.getAll();
            request.onsuccess = () => {
                resolve(request.result);
            }
            request.onerror = (error) => {
                this.onError(13, "Get DB table '" + tableName + "' error: " + error.message);
                reject(undefined);
            }

        })
    }
    
    /**
     * Save records to database table
     *
     * @param tableName {string} Name of table
     * @param records {[]} database records
     * @returns {Promise<boolean>} promise result - records are saved
     */
    saveRecords(tableName, records){

        return new Promise((resolve, reject)=> {

            if (this.dbConnect === undefined){
                this.onError(5, "DB disconnected");
                reject(false);
            }

            const transaction = this.dbConnect.transaction([tableName], "readwrite");
            const Store = transaction.objectStore(tableName);
            Store.clear();
            for (const key in records){
                Store.put(records[key], key);
            }
    
            transaction.oncomplete = function (){
                resolve(true);
            }
            transaction.onabort = (error) => {
                this.onError(12, "Save table '" + tableName + "' error: " + error.message);
                reject(false);
            }
            
        })
    };
    
    /**
     * Get Record from database table by simple key
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<object>}
     */
    getRecord(tableName, key){
        return new Promise((resolve, reject)=>{

            if (this.dbConnect === undefined){
                this.onError(5, "DB disconnected");
                reject(undefined);
            }
            const transaction = this.dbConnect.transaction([tableName], "readonly");
            const Store = transaction.objectStore(tableName);
            const request = Store.get(key);
            request.onsuccess = function (){
                resolve(request.result)
            }
            request.onerror = (error) => {
                this.onError(13, "Get row from table '" + tableName + "' error: " + error.message);
                reject(undefined);
            }
        })
    }
    
    /**
     * Save record to database table by simple key
     *
     * @param tableName {string} Name of table
     * @param record {{}} database record
     * @param key {string|number|undefined} Key's value
     * @returns {Promise<boolean>} promise result - record is saved
     */
    saveRecord(tableName, record, key){

        return new Promise((resolve, reject)=>{

            if (this.dbConnect === undefined){
                this.onError(5, "DB disconnected");
                reject(false);
            }

            const transaction = this.dbConnect.transaction([tableName], "readwrite");
            const Store = transaction.objectStore(tableName);
            const request = Store.put(record, key);
            request.onsuccess = () => {
                resolve(true)
            }
            request.onerror = (error) => {
                this.onError(12, "Save table '"+tableName+"' row '"+key+"' error: " + error.message);
                reject(false);
            }

        })

    }
    
    /**
     * Delete record
     *
     * @param tableName {string} Name of table
     * @param key {string|number} Key's value
     * @returns {Promise<boolean>}
     */
    deleteRecord(tableName, key){

        return new Promise((resolve, reject)=>{

            if (this.dbConnect === undefined){
                this.onError(5, "DB disconnected");
                reject(false);
            }

            const transaction = this.dbConnect.transaction([tableName], "readwrite");
            const Store = transaction.objectStore(tableName);
            const request = Store.delete(key);

            request.onsuccess = () => {
                resolve(true)
            }
            request.onerror = (error) => {
                this.onError(14, "Delete table '"+tableName+"' row '"+key+"' error: " + error.message);
                reject(false);
            }

        })

    }

}