export const mixin = function(targetConstructor, mix) {
    for (const i in mix) {
        if (mix.hasOwnProperty(i)) {
            targetConstructor.prototype[i] = mix[i];
        }
    }
};

const _renderHTML = function (){
    if (!this.used){
        this.clearRender();
        return;
    }
    let text = '';
    for (const key of Object.keys(this.items)) {
        text += this.items[key];
    }
    this.innerHTML = text;
    if (this.afterRender)
        this.afterRender();
}
const notRender = function (){}

export const SCMix = {

    onStart: function(props){
        this.isSketchComponent = true;
        this.used = true;
        this.rendered = false;
        this.items = [];
        this.shadowRootRef = undefined;
        this.fillProps(props);
        if(this.once)
            this.once();
    },

    fillProps: function (props){

        for (const propsKey in props) {
            switch(propsKey){
                case 'shadow':{
                    this.shadowOn(props[propsKey]);
                    break;
                }
                case 'classList':{
                    props[propsKey].forEach(
                        value => this.classList.add(value)
                    );
                    break;
                }
                case 'attributes': {
                    for (const attrKey in props[propsKey]) {
                        this.setAttribute(attrKey, props[propsKey][attrKey]);
                    }
                    break;
                }
                case 'items':{
                    this.items = props.items;
                    break;
                }
                case 'styles': {
                    for (const styleKey in props[propsKey]) {
                        this.style[styleKey] = props[propsKey][styleKey];
                    }
                    break;
                }
                case 'cssText': {
                    this.style.cssText = this.style.cssText + props[propsKey];
                    break;
                }
                case 'commonStyles': {
                    this.addCommonStyles(props[propsKey])
                    break;
                }
                case 'customStyles': {
                    this.setCustomStyles(props[propsKey]);
                    break;
                }
                case 'addEventListeners':{
                    for (const eventKey in props[propsKey]) {
                        this.addEventListener(eventKey, props[propsKey][eventKey]);
                    }
                    break;
                }
                default :{
                    this[propsKey] = props[propsKey];
                }
            }

        }
    },

    once: function(Class){
        if (Class)
            Class.prototype.once = function (){};
    },

    addCommonStyles: function(styles){
        const st = document.createElement('style');
        st.innerHTML = styles;
        document.head.appendChild(st);
    },

    setCustomStyles: function(styles){
        const st = document.createElement('style');
        st.textContent = styles;
        this.customStyle = st;
    },

    connectedCallback: function (){
        if (!this.rendered){
            this.render();
            this.rendered = true;
        }
    },

    show: function (){
        this.used = true;
        if (this.prevPrentNode){
            if ("render" in this.prevPrentNode)
                this.prevPrentNode.render()
        }
    },

    hide: function (){
        this.used = false;
        if (this.parentNode){
            this.prevPrentNode = this.parentNode;
            if ("render" in this.parentNode)
                this.parentNode.render();
        }
    },

    showOnly: function(key){
        for (const itemKey of Object.keys(this.items)) {
            if (itemKey === key){
                this.items[itemKey].show();
                continue;
            }
            this.items[itemKey].hide();
        }
        this.render();
    },

    showAll: function (){
        for (const itemKey of Object.keys(this.items)) {
            this.items[itemKey].show();
        }
        this.render();
    },

    hideAll: function (){
        for (const itemKey of Object.keys(this.items)) {
            this.items[itemKey].hide();
        }
        this.render();
    },

    addItem: function (item){
        this.items.push(item);
    },

    shadowOn(shadowRootInit){
        this.shadowRootRef = this.attachShadow(shadowRootInit)
    },

    clear: function (){
        this.items = [];
    },

    clearRender: function (){
        const objParent = (this.shadowRootRef) ? this.shadowRootRef : this;
        objParent.innerHTML = '';
    },

    render: function (){
        this._render();
        if (this.afterRender)
            this.afterRender();
    },

    _render: function (){
        this.clearRender();
        if (!this.used)
            return;

        const objParent = (this.shadowRootRef) ? this.shadowRootRef : this;
        const componentName = this.getComponentName();
        if (window[componentName])
            objParent.appendChild(window[componentName].content.cloneNode(true))
        if (this.hasOwnProperty('customStyle')){
            objParent.appendChild(this.customStyle);
        }
        for (const key of Object.keys(this.items)) {
            const item = this.items[key];
            this._renderItem(objParent, item)
        }
    },

    _renderItem: function (objParent, item){

        if (item===undefined || item===null)
            return;

        switch (typeof item){

            case 'string':
            case 'number':
            case 'boolean':{
                objParent.append(item);
                return;
            }
            case 'object': {

                if (item.isSketchComponent){
                    if (item.used){
                        objParent.appendChild(item)
                    }
                    return;
                }

                if (Object.prototype.toString.call(item) === '[object Array]'){
                    item.forEach(subItem=>{
                        this._renderItem(objParent, subItem)
                    })
                    return;
                }

                objParent.append(item.toString())
            }
        }

    },

    getComponentName: function (){
        const result = this.getAttribute('is');
        return (!result) ? this.tagName.toLowerCase() : result;
    }

}

export class SCGroup extends HTMLElement{
    constructor(props={}) {
        super();
        this.onStart(props)
    }
    onStart(props){}
}
mixin(SCGroup, SCMix);
customElements.define('sc-group', SCGroup)

export class SCDiv extends HTMLDivElement{
    constructor(props={}) {
        super();
        this.setAttribute("is", "sc-div")
        this.onStart(props)
    }
    onStart(props){}
}
mixin(SCDiv, SCMix);
customElements.define('sc-div', SCDiv, {extends: 'div'})

export class SCForm extends HTMLFormElement{
    constructor(props={}) {
        super();
        this.setAttribute("is", "sc-form")
        this.onStart(props)
    }
    onStart(props){}
}
mixin(SCForm, SCMix);
customElements.define('sc-form', SCForm, {extends: 'form'})

export class SCA extends HTMLAnchorElement{
    constructor(href, props={}) {
        super();
        this.setAttribute('href', href);
        this.setAttribute("is", "sc-a")
        this.onStart(props)
    }
    onStart(props){}
}
mixin(SCA, SCMix);
customElements.define('sc-a', SCA, {extends: 'a'})

export class SCHTML extends SCDiv{
    constructor(props={}) {
        super(props);
        this.setAttribute("is", "sc-html");
    }
    
}
SCHTML.prototype._render = _renderHTML;
customElements.define('sc-html', SCHTML, {extends: 'div'})

export class SCSVGBox extends SCHTML{
    constructor(svgHtml, props, propsSVG) {
        super({
            items:[svgHtml]
        });
        this.setAttribute("is", "sc-svg");
        this.propsSVG = propsSVG;
        if (props)
            this.fillProps(props);
    }
    render(){
        super.render();
        if (this.childNodes[0]){
            this.fillProps.bind(this.childNodes[0])(this.propsSVG);
        }
    }
}
customElements.define('sc-svg', SCSVGBox, {extends: 'div'})

export class SCSpan extends HTMLSpanElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-span")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCSpan, SCMix);
customElements.define('sc-span', SCSpan, {extends: 'span'})

export class SCImage extends HTMLImageElement{
    constructor(src, props) {
        super();
        this.setAttribute("is", "sc-image")
        this.src = src;
        this.onStart(props);
    }
    onStart(props){}
    render(){}
}
mixin(SCImage, SCMix);
customElements.define('sc-image', SCImage, {extends: 'img'})


export class SCButton extends HTMLButtonElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-button")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCButton, SCMix);
customElements.define('sc-button', SCButton, {extends: 'button'})

export class SCInput extends HTMLInputElement{
    constructor(value, type, name, id, props) {
        super();
        this.setAttribute("is", "sc-input");
        this.value = value;
        this.type = type;
        this.name = name;
        this.id = id;
        this.onStart(props);
    }
    
    /**
     *
     * @returns {string|number|boolean|Date}
     */
    getValue(){
        return this.value;
    }
    setValue(value){
        this.value = value;
    }
    onStart(props){}
    render(){}
}
mixin(SCInput, SCMix);
customElements.define('sc-input', SCInput, {extends: 'input'})

export class SCInputText extends SCInput{
    constructor(value, name, id, props) {
        super(value, 'text', name, id, props);
        this.setAttribute("is", "sc-input-text");
    }
}
customElements.define('sc-input-text', SCInputText, {extends: 'input'})

export class SCInputNumber extends SCInput{
    constructor(value, name, id, props) {
        super(value, 'number', name, id, props);
        this.setAttribute("is", "sc-input-number");
    }
}
customElements.define('sc-input-number', SCInputNumber, {extends: 'input'})

export class SCInputDate extends SCInput{
    constructor(value, name, id, props) {
        super(value, 'date', name, id, props);
        if (typeof value === "object"){
            this.valueAsDate = value;
        }
        this.setAttribute("is", "sc-input-date");
    }
    getValue(){
        return this.valueAsDate;
    }
    setValue(value){
        if (typeof value === "object"){
            this.valueAsDate = value;
            return;
        }
        this.value = value;
    }
    
}
customElements.define('sc-input-date', SCInputDate, {extends: 'input'})

export class SCInputCheckbox extends SCInput{
    constructor(value, name, id, props) {
        super(value, 'checkbox', name, id, props);
        this.setAttribute("is", "sc-input-checkbox");
    }
}
customElements.define('sc-input-checkbox', SCInputCheckbox, {extends: 'input'})

export class SCInputFile extends SCInput{
    constructor(value, name, id, props) {
        super(value, 'file', name, id, props);
        this.setAttribute("is", "sc-input-file");
    }
}
customElements.define('sc-input-file', SCInputFile, {extends: 'input'})

export class SCTextArea extends HTMLTextAreaElement{
    constructor(value, name, props) {
        super();
        this.setAttribute("is", "sc-textarea");
        this.value = value;
        this.name = name;
        this.onStart(props);
    }
    onStart(props){}
    render(){}
}
mixin(SCTextArea, SCMix);
customElements.define('sc-textarea', SCTextArea, {extends: 'textarea'})

export class SCLabel extends HTMLLabelElement{
    constructor(forAttr, text, props) {
        super();
        this.text = text;
        this.setAttribute("for", forAttr);
        this.setAttribute("is", "sc-label");
        this.onStart(props);
        if (text!==undefined){
            this.fillProps({
                items: {
                    text: text
                }
            })
        }
    }
    onStart(props){}
}
mixin(SCLabel, SCMix);
customElements.define('sc-label', SCLabel, {extends: 'label'})

export class SCOption extends HTMLOptionElement{
    constructor(value, props) {
        super();
        this.setAttribute('is', 'sc-option')
        this.value = value;
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCOption, SCMix);
customElements.define('sc-option', SCOption, {extends: 'option'})

export class SCSelect extends HTMLSelectElement{
    constructor(value, name, id, props) {
        super();
        this.setAttribute('is', 'sc-select');
        this.id = id;
        this.startValue = value;
        this.name = name;
        this.onStart(props);
    }
    onStart(props){}
    /**
     *
     * @returns {string|number|boolean|Date}
     */
    getValue(){
        return this.value;
    }
    setValue(value){
        this.value = value;
    }
    afterRender(){
        this.value = this.startValue;
    }
}
mixin(SCSelect, SCMix);
customElements.define('sc-select', SCSelect, {extends: 'select'})

export class SCDataList extends HTMLDataListElement{
    constructor(id, props) {
        super();
        this.id = id;
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCDataList, SCMix);
customElements.define('sc-datalist', SCDataList, {extends: 'datalist'})

export class SCInputDataList extends SCGroup{

    constructor(value, name, id, props) {
        super(props);
        if (!this.hasOwnProperty('datalistProps')) this.datalistProps = [];
        if (!this.hasOwnProperty('inputProps')) this.inputProps = [];
        if (!this.hasOwnProperty('idList')) this.idList = id + "_list";
        this.fillProps({
            items: {
                input: new SCInputText(value, name, id, this.inputProps),
                datalist: new SCDataList(this.idList, this.datalistProps)
            }
        })
        this.items.input.setAttribute('list', this.idList);
    }

}
mixin(SCInputDataList, SCMix);
customElements.define('sc-input-datalist', SCInputDataList)

export class SCInputBox extends SCGroup{

    constructor(value, type, name, inputId, title, props={}) {
        super(props);
        this.value = value;
        this.type = type;
        this.name = name;
        this.inputId = inputId;
        this.titleText = title;
        if (!this.hasOwnProperty('inputProps')) this.inputProps = {};
        if (!this.hasOwnProperty('labelProps')) this.labelProps = {};
    }

    fillContent(){
        this.items = {
            label: this.getLabel(),
            input: this.getInputItem()
        }
    }

    getInputItem(){
        const result = this.getInputItemByType();
        result.classList.add(this.getComponentName()+'__input')
        return result;
    }

    getInputItemByType(){
        switch (this.type){
            case 'string': return new SCInputText(this.value, this.name, this.inputId, this.inputProps);
            case 'number': return new SCInputNumber(this.value, this.name, this.inputId, this.inputProps);
            case 'date': return new SCInputDate(this.value, this.name, this.inputId, this.inputProps);
            case 'boolean': return new SCInputCheckbox(this.value, this.name, this.inputId, this.inputProps);
            case 'file': return new SCInputFile(this.value, this.name, this.inputId, this.inputProps);
            case 'enum': return new SCSelect(this.value, this.name, this.inputId, this.inputProps);
            case 'text': return new SCTextArea(this.value, this.name, this.inputId, this.inputProps)
        }
        return new SCInput(this.value, this.type, this.name, this.inputId, this.inputProps);
    }

    getLabel(){
        const result = new SCLabel(
            this.inputId,
            this.titleText,
            this.labelProps
        )
        result.classList.add(this.getComponentName()+'__label')
        return result;
    }

    render(){
        this.fillContent();
        super.render();
    }

}
customElements.define('sc-input-box', SCInputBox)

export class SCLi extends HTMLLIElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-li")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCLi, SCMix);
customElements.define('sc-li', SCLi, {extends: 'li'})

export class SCUList extends HTMLUListElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-ulist")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCUList, SCMix);
customElements.define('sc-ulist', SCUList, {extends: 'ul'})

export class SCTableRow extends HTMLTableRowElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-tr")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCTableRow, SCMix);
customElements.define('sc-tr', SCTableRow, {extends: 'tr'})

export class SCTableHead extends HTMLTableSectionElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-thead")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCTableHead, SCMix);
customElements.define('sc-thead', SCTableHead, {extends: 'thead'})

export class SCTableBody extends HTMLTableSectionElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-tbody")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCTableBody, SCMix);
customElements.define('sc-tbody', SCTableBody, {extends: 'tbody'})

export class SCTableFoot extends HTMLTableSectionElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-tfoot")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCTableFoot, SCMix);
customElements.define('sc-tfoot', SCTableFoot, {extends: 'tfoot'})

export class SCTableCell extends HTMLTableCellElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-td")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCTableCell, SCMix);
customElements.define('sc-td', SCTableCell, {extends: 'td'})

export class SCTableHeadCell extends HTMLTableCellElement{
    constructor(props) {
        super();
        this.setAttribute("is", "sc-th")
        this.onStart(props);
    }
    onStart(props){}
}
mixin(SCTableHeadCell, SCMix);
customElements.define('sc-th', SCTableHeadCell, {extends: 'th'})

export class SCTable extends HTMLTableElement{

    constructor(props) {
        super();
        this.setAttribute("is", "sc-table")
        this.onStart(props);
    }

    onStart(props){}

}
mixin(SCTable, SCMix);
customElements.define('sc-table', SCTable, {extends: 'table'})

export class SCWindow extends SCGroup{

    constructor(props={}) {
        super({
            styles: {
                display: 'flex',
                flexDirection: 'column'
            }
        })
        this.contentProps = {};
        this.fillProps(props)
    }

    fillContent(){
        this.items = {
            close_box: this.getCloseBox(),
            content_box: this.getContentBox()
        }
    }

    getCloseBox(){
        return new SCGroup({
            cssText: `
                display: flex; 
                flex-direction: row; 
                justify-content: right
            `,
            items: {
                close: new SCButton({
                    items: ['X'],
                    onclick: function (){
                        this.remove()
                    }.bind(this)
                })
            }
        })
    }

    getContentBox(){
        return new SCGroup(this.contentProps)
    }

    render(){
        this.fillContent();
        super.render();
    }

}
customElements.define("sc-window", SCWindow)

