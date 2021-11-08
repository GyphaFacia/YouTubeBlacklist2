class ExtensionElement {
    constructor(nextElementSelector){
        this.nextElementSelector = nextElementSelector ? nextElementSelector : ''
        
        this.type = 'div'
        
        this.__id = ''
        this.__className = ''
        this.__innerHTML = ''
        
        this.DOM = null
        
        this.first()
        
        setTimeout(()=>{ this.waitToRender() }, 0)
    }
    
    set innerHTML(val){
        this.__innerHTML = val
        if(this.DOM){ this.DOM.innerHTML = this.innerHTML }
    }
    get innerHTML(){return this.__innerHTML}
    
    set id(val){
        this.__id = val
        if(this.DOM){ this.DOM.id = this.id }
    }
    get id(){return this.__id}
    
    set className(val){
        this.__className = val
        if(this.DOM){ this.DOM.className = this.className }
    }
    get className(){return this.__className}
    
    first(){}
    onRender(){}
    
    waitToRender(){
        if(this.isRendered()){
            return false
        }
        else{
            setTimeout(()=>{
                this.waitToRender()
            }, 100)
        }
        
        if(this.nextElementSelector){
            let nextSibling = document.querySelector(this.nextElementSelector)
            if(nextSibling && nextSibling.parentNode){
                this.parentNode = nextSibling.parentNode
                this.nextSibling = nextSibling
                this.render()
            }
        }
    }
    
    isRendered(){
        return this.DOM ? true : false
    }
    
    render(){
        this.DOM = document.createElement(this.type)
        this.parentNode.insertBefore(this.DOM, this.nextSibling)
        
        this.DOM.ext = this
        
        if(this.id){ this.DOM.id = this.id }
        if(this.className){ this.DOM.className = this.className }
        if(this.innerHTML){ this.DOM.innerHTML = this.innerHTML }
        
        this.onRender()
    }
}

class BanCounter extends ExtensionElement{
    first(){
        this.banCnt = -1
    }
    
    set banCnt(val){
        if(this.__banCnt != val){
            this.__banCnt = val
            this.innerHTML = `Removed ${this.banCnt} videos`
        }
    }
    get banCnt(){return this.__banCnt}
    
    onRender(){
        this.banCnt = 0
    }
}

class ExtensionMenu extends ExtensionElement{
    onRender(){
        let tabOptions = document.querySelectorAll('.tab-option')
        let tabs = document.querySelectorAll('.tab')
        let n = Math.min(tabOptions.length, tabs.length)
        console.log(tabOptions, tabs, n);
        
        for(let i = 0; i < n; i++) {
            let tabOption = tabOptions[i]
            let tab = tabs[i]
            
            tabOption.onclick = (e)=>{
                for(let j = 0; j < n; j++){
                    tabs[j].classList.add('hidden')
                    tabOptions[j].classList.remove('active-tab')
                }
                tabOptions[i].classList.add('active-tab')
                tabs[i].classList.remove('hidden')
            }
        }
    }
}

let banCounter = new BanCounter('#center')
banCounter.id = 'ytbl-bancounter'
banCounter.type = 'span'


let menu = new ExtensionMenu('#end')
menu.type = 'aside'
menu.id = 'ytbl-menu'
menu.className = 'ytbl'
menu.innerHTML = `
<main class="tabs-wrapper">
    <div class="tabs-options">
        <button class="tab-option active-tab" id="tab-option-1">BlackList</button>
        <button class="tab-option" id="tab-option-2">Remove Watched</button>
        <button class="tab-option" id="tab-option-3">Max Suggestions</button>
    </div>
    
    <div id="tabs-content">
        <div class="tab" id="tab-1"></div>
        <div class="tab hidden" id="tab-2"></div>
        <div class="tab hidden" id="tab-3"></div>
    </div>
</main>

`
























