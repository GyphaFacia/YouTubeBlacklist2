class ExtensionElement {
    constructor(nextElementSelector){
        this.nextElementSelector = nextElementSelector ? nextElementSelector : ''
        
        this.type = 'div'
        
        this.__id = ''
        this.__className = ''
        this.__innerHTML = ''
        this.__onclick = null
        
        this.DOM = null
        
        this.first()
        
        setTimeout(()=>{ this.waitToRender() }, 0)
    }
    
    set onclick(val){
        this.__onclick = val
        if(this.DOM){
            this.DOM.onclick = this.onclick
        }
    }
    get onclick(){return this.__onclick}
    
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
        if(this.onclick){this.DOM.onclick = this.onclick.bind(this)}
        
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

let test = new BanCounter('#center')
test.onclick = function(e){
    this.banCnt++
}

























