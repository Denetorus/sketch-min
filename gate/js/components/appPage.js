import {SCGroup} from "../external/sk-cmp/sk-cmp.js";
import {ApiDBConnector} from "../external/sk-cmp/sk-cmp-db-connector.js";
import {WindowList} from "../forms/default/WindowList.js";
import {WindowsContainer} from "../forms/default/WindowsContainer.js";

export class AppPage extends SCGroup{

    constructor(pageName) {
        const db = new ApiDBConnector('/rest','1.0');
        super();
        this.setAttribute("page_name", pageName);
        this.fillProps({
            items: {
                windows: new WindowsContainer()
            }
        })
        this.classList.add('app-page');
        this.items.windows.addWindow(new WindowList(db, pageName))
    }

    once(){
        this.addCommonStyles(`
:root{
    --color-primary: #0B0C10;
    --color-back: #96a1af;
    --color-title: #C5C6C7;
    --color-list: #5b706f;
    --color-border: #70f9f3;
}

body{
    width: auto;
    height: calc(100vh - 16px);
}

.app-page{
    display: flex; 
    flex-direction: column; 
    position: relative;
    height:  calc(100% - 20px);
    width: calc(100% - 20px);
}

.app-page table{
    border: 1px solid var(--color-border);
} 
.app-page tr:hover{
    border: 1px solid blue;
    border: 2px solid var(--color-border);
    border-radius: 5px 5px ; 
    background: var(--color-list); 
    color: var(--color-border);
}
.app-page td{}       
.app-page th{
    font-weight: bold;
    padding: 7px;
    background: #ffd300;
    border: none;
} 

        `)
        AppPage.prototype.once = undefined;
    }
}
customElements.define('app-page', AppPage)

