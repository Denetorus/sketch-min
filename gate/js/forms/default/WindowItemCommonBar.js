import {SCGroup} from "../../external/sk-cmp/sk-cmp.js";
import {WindowCommandBarButton} from "./WindowCommandBarButton.js";

const ENUM_WindowItemCommandBarButtonNames = {
    save: ['Зберігти'],
    delete: ['Вилучити'],
}
export class WindowItemCommonBar extends SCGroup {
    constructor(owner) {
        super();
        this.classList.add('window-item-combar');
        this.owner = owner;
        this.setItems();
    }

    setItems(){
        this.items = {}
        let btn = this.getSaveButton();
        if (btn !== undefined){
            this.items.save = btn;
        }
        btn = this.getDeleteButton();
        if (btn !== undefined){
            this.items.delete = btn;
        }
    }

    getSaveButton(){
        const btn = new WindowCommandBarButton;
        btn.items = ENUM_WindowItemCommandBarButtonNames.save;
        btn.onclick = this.event_save.bind(this)
        return btn;
    }

    getDeleteButton(){
        const btn = new WindowCommandBarButton;
        btn.items = ENUM_WindowItemCommandBarButtonNames.delete;
        btn.onclick = this.event_delete.bind(this)
        return btn;
    }

    event_save(){
        this.owner.object.save()
            .then((data)=>{
                    if (data.hasOwnProperty('ref')){
                        this.owner.close(data.ref.uid);
                        return
                    }
                    this.owner.close(undefined)
                },
                (error)=>{
                    console.error(error)
                }
            )

    }

    event_delete(){
        this.owner.object.delete()
            .then(()=>{
                    this.owner.close(undefined)
                },
                (error)=>{
                    console.error(error)
                }
            )
    }

}
customElements.define("window-item-common-bar", WindowItemCommonBar);