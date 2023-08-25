import {SCButton, SCGroup, SCInputText} from "../../external/sk-cmp/sk-cmp.js";
import {SCUListDB} from "../../external/sk-cmp/sk-cmp-db.js";
import {FILTER_RULE_TYPE} from "../../external/sk-cmp/sk-cmp-db-objects.js";
import {WindowItem} from "./WindowItem.js";


export class InputObject extends SCGroup{

    constructor(object, value, name, id, props) {

        super(props);

        this.prevValue = "";
        if (value === null){
            value = {
                ref: "",
                presentation: "",
                refTable: object.tableName,
                db: object.db
            }
        }
        this.value = value;

        this.selectBox = new InputObjectSelect(object, this);
        this.selectItem = this.selectBox.items.select;
        this.selectBox.close();

        this.inputItem = new SCInputText(value.presentation, name, name, {
            attributes: {autocomplete: 'off'},
        })
        this.btnSelect = new SCButton({
            items: ['▼'],
            tabIndex: -1,
            onclick: ()=>{
                this.selectBox.changeOpenClose();
                this.selectBox.notOpenOnce = true;
                this.inputItem.focus()
            }

        })
        this.btnOpen = new SCButton({
            items: ['●']
        })
        this.inputBox = new SCGroup({
            classList: ['input-object-input-box'],
            items: {
                input: this.inputItem,
                btnSelect: this.btnSelect,
                btnOpen: this.btnOpen
            }
        })

        this.fillProps({
            items: {
                input_box: this.inputBox,
                select_box: this.selectBox
            }
        })

        this.inputItem.onfocus = this.action_input_onfocus.bind(this);
        this.inputItem.onblur = this.action_input_onblur.bind(this);
        this.inputItem.onkeyup = this.action_onkeyup.bind(this)

        this.onkeydown = this.action_onkeydown.bind(this);

        this.btnOpen.onclick = this.action_btnOpen.bind(this)
        this.btnSelect.onclick = this.action_btnSelect.bind(this)


    }

    setValue(value){
      this.value = value;
    }

    getValue(){
        return this.value;
    }

    value_change(){
        const event = new CustomEvent('change');
        this.dispatchEvent(event);
    }

    /**
     * Activity on Focus input item
     *
     * @this InputObject
     * @param event {FocusEvent}
     */
    action_input_onfocus(event){
        this.selectBox.open();
    }

    /**
     * Activity on Blur input item
     *
     * @this InputObject
     * @param event {FocusEvent}
     */
    action_input_onblur(event){
        setTimeout(()=>{
            if (this.contains(event.relatedTarget)){
                this.inputItem.focus();
                return;
            }
            this.selectBox.close();
        }, 0)
    }

    /**
     * Activity on keydown
     *
     * @param event {KeyboardEvent}
     * @returns {boolean}
     */
    action_onkeydown(event){

        switch (event.code){
            case "ArrowDown":
                this.selectBox.selectActivateItem(this.selectItem.valueIndex+1);
                event.preventDefault();
                return false;
            case "ArrowUp":
                this.selectBox.selectActivateItem(this.selectItem.valueIndex-1);
                event.preventDefault();
                return false;
            case "Enter":
                const data = this.selectBox.getValue();
                this.action_onselect(data);
                return false;
        }
        return true;

    }

    action_onkeyup(event){
        if (this.prevValue === this.inputItem.value)
            return;
        this.prevValue = this.inputItem.value;
        this.selectItem.object.settings.addFilter(
            'presentation',
            FILTER_RULE_TYPE.string.ilike,
            this.inputItem.value
        )
        this.selectItem.render();
        this.selectItem.valueIndex = -1;

    }

    action_btnSelect(){
        this.selectBox.changeOpenClose();
        this.selectBox.notOpenOnce = true;
        this.inputItem.focus()
    }

    action_btnOpen(){
        if (this.value.ref === null)
            return;

        let container = this.getWindowsContainer();
        if (container===undefined)
            return;

        const OpenWindow = new WindowItem(this.value.db, this.value.refTable, this.value.ref, this)
        OpenWindow.addEventListener('close', (event)=>{

        })
        container.addWindow(OpenWindow);

    }

    action_onselect(data){
        if (data === undefined)
            return;
        this.inputItem.value = data.presentation;
        this.value.presentation = data.presentation;
        this.value.ref = data.ref;
        this.value_change();
        this.selectBox.close();
    }

    action_add(){

        let container = this.getWindowsContainer();
        if (container===undefined)
            return;


        const ChoiceWindow = new WindowItem(this.selectItem.object.db, this.selectItem.object.tableName, undefined, this)
        ChoiceWindow.addEventListener('close', (event)=>{
            if (event.detail === undefined)
                return;
            this.value.ref = event.detail;
            this.value_change();
            this.value.db.getRecordPresentation(this.value.refTable, this.value.ref)
                .then((data)=>{
                    this.value.presentation = data;
                    this.inputItem.value = this.value.presentation;
                })
        })
        container.addWindow(ChoiceWindow);
        this.selectBox.close();

    }

    getWindowsContainer(){

        let curElement = this;
        while(curElement !== document.body ){
            if (curElement.classList.contains('windows-container'))
                return curElement;
            curElement = curElement.parentElement;
        }
        return undefined;
    }

    once(){
        this.addCommonStyles(`
input-object{
    display: flex;
    flex-direction: column;
    position: relative;
    width: 300px;
}
        `)
    }
}
customElements.define('input-object', InputObject)

export class InputObjectSelect extends SCGroup{

    constructor(object, owner, props) {

        super(props);

        this.owner = owner;

        this.notOpenOnce = false;
        this.selectItem = new SCUListDB(object, {
            tabIndex: -1,
            items: [],
            cssText: 'width: 100%;',
            valueIndex: -1,
        })

        this.fillProps({
            items: {
                select: this.selectItem,
                btnSelect: new SCGroup({
                    tabIndex: -1,
                    items: {
                        btnAdd: new SCButton({
                            items: '+',
                            onclick: owner.action_add.bind(owner)
                        })
                    }
                })
            },
        })

        this.selectItem.onclick = this.action_onclick.bind(this);
        this.selectItem.onmousemove = this.action_onmousemove.bind(this);

    }

    isOpen(){
        return this.style.display !== "none";
    }

    close(){
        if ( this.isOpen() )
            this.style.display = 'none'
    }

    open(){
        if (this.notOpenOnce){
            this.notOpenOnce = false;
            return;
        }
        if ( !this.isOpen() ){
            this.style.removeProperty('display');
        }

    }

    changeOpenClose(){
        if ( this.isOpen() ){
            this.close();
        }else{
            this.open();
        }
    }

    selectActivateItem(itemIndex= 0){

        if (!this.isOpen())
            return;

        const selectItem = this.selectItem;
        const data = selectItem.object.data;

        const itemsCount = data.length;
        if (itemsCount===0) {
            selectItem.valueIndex = -1;
            return;
        }
        if (itemIndex+1>itemsCount){
            itemIndex = itemsCount-1;
        }else if (itemIndex<0){
            itemIndex = 0;
        }
        if (itemIndex === selectItem.valueIndex)
            return;

        if (selectItem.valueIndex !== -1)
            selectItem.items[selectItem.valueIndex].removeAttribute('selected')

        selectItem.valueIndex = itemIndex;
        selectItem.items[selectItem.valueIndex].setAttribute('selected', '')

    }

    getValue(){
        const valueIndex = this.items.select.valueIndex;
        if (valueIndex < 0 )
            return undefined;
        return this.items.select.object.data[valueIndex];
    }

    getPresentation(){
        const value = this.getValue();
        return (value === undefined ) ? "" : value.presentation;
    }


    /**
     * Action on click
     *
     * @this InputObjectSelect
     * @param event {MouseEvent}
     */
    action_onclick(event){

        if (event.target.tagName === "LI"){
            const ref = event.target.getAttribute('ref');
            const data = this.selectItem.object.data.find(item => item.ref === ref) ;
            this.owner.action_onselect(data);
            this.close();
        }

    }

    /**
     * Action on mouse move
     *
     * @this InputObjectSelect
     * @param event {MouseEvent}
     */
    action_onmousemove(event){
        if (event.target.tagName === 'LI'){
            const count = this.selectItem.parentElement.childElementCount;
            for(let i=0; i<count; i++){
                if (this.selectItem.children[i] === event.target){
                    this.selectActivateItem(i);
                    return;
                }
            }
        }
    }

    once(){

        this.addCommonStyles(`

input-object-select{
    display: flex;
    flex-direction: column;
    width: 100%;
    border: black 1px solid;
    padding: 5px;
    position: absolute;
    margin-top: 22px;
    cursor: pointer;
    background: white;
    z-index: 100;
}   

input-object-select ul{
    width: 100%;
    margin: 0;
    padding: 0;
   
}    

input-object-select sc-group{
    display: block;
    margin-top: 10px;
}

input-object-select li{
    list-style-type: none;
    padding: 5px;
}  
input-object-select li[selected]{
    background-color: red
} 

        `)

        InputObjectSelect.prototype.once = undefined;

    }

}
customElements.define('input-object-select', InputObjectSelect)
