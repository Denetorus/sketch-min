
export class SketchApiDB{

    constructor(path='', version='') {
        this.path = path;
        this.version = version
    }

    connect(params){
        this.connectParams = params;
        return true;
    }

    deleteDB(){
        return false;
    }

    createTable(){
        return false;
    }

    getTable(table){
        return this.queryJson(
            this.path+"/"+table+"?v="+this.version,
            {method: "GET", headers: this.connectParams}
        );
    }

    getTableForSelect(table){
        return this.queryJson(
            this.path+"/"+table+"?v="+this.version+"&for_select",
            {method: "GET", headers: this.connectParams}
        );
    }

    saveTable(){
        return false;
    }

    getRecord(table, keyName, key){
        return this.queryJson(
            this.path+"/"+table+"?v="+this.version+"&"+keyName+"="+key,
            {method: "GET", headers: this.connectParams}
        );
    }

    saveRecord(table, key, data){
        let path = this.path+"/"+table+"?v="+this.version;
        if (key!==undefined){
            path += "&id="+key
        }
        return this.queryJson(
            path,
            {
                method: "PUT",
                headers: this.connectParams,
                body: JSON.stringify(data)
            }
        );
    }

    deleteRecord(table, keyName, key){
        return this.queryJson(
            this.path+"/"+table+"?v="+this.version+"&"+keyName+"="+key,
            {method: "DELETE", headers: this.connectParams}
        );
    }

    queryJson(path, options){
        return new Promise((resolve, reject)=>{
            fetch(path, options)
                .then(response => response.json(), reject)
                .then(data => resolve(data.data), reject)
        })
    }


}