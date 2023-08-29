import {SCGroup} from "../../external/sk-cmp/sk-cmp.js";

export class WindowsContainer extends SCGroup{

    constructor(props) {
        super(props);
        this.classList.add('windows-container');
        if (this.hasOwnProperty('items')){
            this.items = [];
        }
    }

    addWindow(window){
        this.items.push(window);
        this.render();
    }

    closeWindow(window){
        const index = this.items.indexOf(window);
        if (index<0) return;
        this.items.splice(index,1);
        this.render();
    }

}
customElements.define('windows-container', WindowsContainer)