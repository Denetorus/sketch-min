import {SCGroup} from "../../external/sk-cmp/sk-cmp.js";
import {WindowHeaderPanelButton} from "./WindowHeaderPanelButton.js";

const ENUM_WindowHeaderPanelButtonNames = {
    close: ['Х'],
}
export class WindowHeaderPanel extends SCGroup {
    constructor(owner, title) {
        super();
        this.owner = owner;
        this.title = title;
        this.setItems();
    }

    setItems(){
        this.items = {
            title: this.title,
            comButtons: this.getCommandButtons()
        }
    }

    getCommandButtons(){
        return new SCGroup({
            items: {
                close: this.getCloseButton()
            }
        })
    }

    getCloseButton(){
        return new WindowHeaderPanelButton({
            items: ENUM_WindowHeaderPanelButtonNames.close,
            onclick: function (){
                this.close(undefined);
            }.bind(this.owner)
        });
    }

    once(){
        this.addCommonStyles(`
window-header-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-family: cursive;
    font-size: x-large;
}         
        `)
        WindowHeaderPanel.prototype.once = undefined;
    }
}
customElements.define('window-header-panel', WindowHeaderPanel);