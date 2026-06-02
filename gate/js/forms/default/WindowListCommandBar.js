import {SCGroup} from "../../external/sk-cmp/sk-cmp.js";
import {WindowCommandBarButton} from "./WindowCommandBarButton.js";

const ENUM_WindowListCommandBarButtonNames = {
    create: ['Створити'],
    copy: ['Копіювати'],
    delete: ['Вилучити'],
}

export class WindowListCommandBar extends SCGroup {
    constructor(owner) {
        super();
        this.classList.add('window-list-combar');
        this.owner = owner;
        this.setItems();
    }

    setItems(){
        this.items = {}
        let btn = this.getCreateButton();
        if (btn !== undefined){
            this.items.create = btn;
        }
    }

    getCreateButton(){
        const btn = new WindowCommandBarButton;
        btn.items = ENUM_WindowListCommandBarButtonNames.create;
        btn.onclick = this.event_create.bind(this)
        return btn;
    }

    event_create(){
        const newWindowItem = this.owner.getWindowItem(undefined);
        this.owner.parentElement.items.push(newWindowItem)
        this.owner.parentElement.appendChild(newWindowItem)
    }
}
customElements.define("window-list-combar", WindowListCommandBar);

