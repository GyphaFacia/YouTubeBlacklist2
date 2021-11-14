class ExtensionElement{
	constructor(){
		this.DOM = null
		this.tag = 'div'
		this.className = this.id = this.innerHTML = ''
		this.alive = false
		this.thinkDelay = 200
		
		this.first()
		this.think()
		this.second()
	}
	
	// updates
	first(){}
	second(){}
	onRender(){}
	onRemove(){}
	onUpdate(){}
	onThink(){}
	
	// getters setters
	get className(){return this.__className}
	set className(val){
		this.__className = val
		this.updateDOM()
	}
	
	get id(){return this.__id}
	set id(val){
	    this.__id = val
		this.updateDOM()
	}
	
	get innerHTML(){return this.__innerHTML}
	set innerHTML(val){
	    this.__innerHTML = val
		this.updateDOM()
	}
	
	// keys causing update
	updKeys(){
		return 'id className innerHTML'.split(' ')
	}
	
	// 
	updateDOM(){
		if(!this.isRendered()){return null}
		
		let domUpdated = false
		
		for(let key of this.updKeys()){
			if(this[key] != this.DOM[key]){
				this.DOM[key] = this[key]
				domUpdated = true
			}
		}
		
		if(domUpdated){
			this.onUpdate()
		}
	}
	
	// 
	think(){
		if(this.isRendered() != this.alive){
			this.alive = this.isRendered()
			
			if(this.alive){
				this.onRender()
			}
			else{
				this.onRemove()
			}
		}
		else if (!this.isRendered()) {
			this.render()
		}
		
		this.onThink()
		setTimeout(()=>{
			this.think()
		}, this.thinkDelay);
	}
	
	getNextSiblingSelector(){return '#center'}
	
	render(){
		this.next = document.querySelector(this.getNextSiblingSelector())
		if(!this.next){return false}
		this.root = this.next.parentNode
		if(!this.root){return false}
		
		this.DOM = document.createElement(this.tag)
		this.DOM.ext = this
		this.root.insertBefore(this.DOM, this.next)
		this.updateDOM()
		return true
	}
	
	isRendered(){
		if(!this.DOM){return false}
		if(!this.root){return false}
		if(!this.next){return false}
		if(!document.body.contains(this.DOM)){return false}
		if(!document.body.contains(this.root)){return false}
		if(!document.body.contains(this.next)){return false}
		return true	
	}
}

class BanCounter extends ExtensionElement{
	getNextSiblingSelector(){return '#center'}
	get cnt(){return this.__cnt}
	set cnt(val){
		this.__cnt = val
		this.innerHTML = `Removed ${this.cnt} videos`
	}
	
	first(){
		this.cnt = 0
		this.className = 'ytbl-extension-bancounter'
	}
	
	onRender(){
		this.DOM.onclick = (e)=>{
			this.cnt++
		}
	}
	
}

class ExtensionLogo extends ExtensionElement{
	getNextSiblingSelector(){return '#container #buttons > ytd-button-renderer'}
	first(){
		this.tag = 'img'
		this.className = 'ytbl-extension-logo'
	}
	
	onRender(){
		this.DOM.src = chrome.extension.getURL("icons/ChortOutline.svg")
		this.DOM.onclick = ()=>{
			console.log(menu);
			if(menu && menu.isRendered()){
				menu.DOM.classList.toggle('hidden')
			}
		}
	}
	
}

class ExtensionMenu extends ExtensionElement{
	getNextSiblingSelector(){return '#container #buttons > ytd-button-renderer'}
	first(){
		this.tag = 'aside'
		this.className = 'ytbl-extension-menu hidden'
	}
	
	onRender(){
		if(window.location.href.includes('/watch')){
			// page with video player has no header border for some reason
			this.DOM.style.top = '56px' 
		}
	}
}

class BanButton extends ExtensionElement {
    getNextSiblingSelector(){
        return '#top-row #subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button'
    }
    first(){
        this.tag = 'button'
        this.className = 'ytbl-extension-banbutton'
        this.innerHTML = 'BANBUTTON'
    }
    
    getCurrentChannel(){
        let channelElt = document.querySelector('#channel-name #container #text > a')
        if(!channelElt){return ''}
        
        let channelName = channelElt.innerText
        return channelName ? channelName : ''
    }
    
    onThink(){
        let buttonText = banlist.has(this.getCurrentChannel()) ? 'UnHide Channel' : 'Hide Channel'
        if(this.innerHTML != buttonText){
            this.innerHTML = buttonText
        }
    }
    
    onRender(){
        this.DOM.onclick = ()=>{
            let channelName = this.getCurrentChannel()
            console.log(banlist.has(channelName));
            
            if(!channelName){return null}
            
            if(banlist.has(channelName)){
                banlist.unbanChannel(channelName)
            }
            else {
                banlist.banChannel(channelName)
            }
        }
    }
}













