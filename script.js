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
        
        for(let i = 0; i < tabOptions.length; i++) {
            let tabOption = tabOptions[i]
            let tab = tabs[i]
            
            tabOption.onclick = (e)=>{
                for(let j = 0; j < tabs.length; j++){
                    tab[j].classList.add('hidden')
                }
                tab[i].classList.remove('hidden')
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
        <button class="tab-option" id="tab-option-1">blacklist</button>
        <button class="tab-option" id="tab-option-2">watched</button>
    </div>
    
    <div id="tabs-content">
        <div class="tab" id="tab-1"></div>
        <div class="tab" id="tab-2"></div>
    </div>
</main>

`
























