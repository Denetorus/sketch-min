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
        this.items.forEach(item=>{
            item.classList.add('hidden');
        })
        this.items.push(window);
        this.render();
    }

    closeWindow(window){
        const index = this.items.indexOf(window);
        if (index<0) return;
        this.items.splice(index,1);
        if(this.items.length === 0){
        }else if(this.items.length === 1) {
            this.items[0].classList.remove('hidden');
        }else if(index>0){
            this.items[index-1].classList.remove('hidden');
        }else if(index < this.items.length){
            this.items[index].classList.remove('hidden');
        }
        this.render();
    }

}
customElements.define('windows-container', WindowsContainer)