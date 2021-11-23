// 8888888888          888    8888888888 888 888    
// 888                 888    888        888 888    
// 888                 888    888        888 888    
// 8888888    888  888 888888 8888888    888 888888 
// 888        `Y8bd8P' 888    888        888 888    
// 888          X88K   888    888        888 888    
// 888        .d8""8b. Y88b.  888        888 Y88b.  
// 8888888888 888  888  "Y888 8888888888 888  "Y888 
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





// 888888b.                      .d8888b.           888    
// 888  "88b                    d88P  Y88b          888    
// 888  .88P                    888    888          888    
// 8888888K.   8888b.  88888b.  888        88888b.  888888 
// 888  "Y88b     "88b 888 "88b 888        888 "88b 888    
// 888    888 .d888888 888  888 888    888 888  888 888    
// 888   d88P 888  888 888  888 Y88b  d88P 888  888 Y88b.  
// 8888888P"  "Y888888 888  888  "Y8888P"  888  888  "Y888 
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
}





// 888                                
// 888                                
// 888                                
// 888      .d88b.   .d88b.   .d88b.  
// 888     d88""88b d88P"88b d88""88b 
// 888     888  888 888  888 888  888 
// 888     Y88..88P Y88b 888 Y88..88P 
// 88888888 "Y88P"   "Y88888  "Y88P"  
//                       888          
//                  Y8b d88P          
//                   "Y88P"           

class ExtensionLogo extends ExtensionElement{
	getNextSiblingSelector(){return '#container #buttons > ytd-button-renderer'}
	first(){
		this.tag = 'img'
		this.className = 'ytbl-extension-logo inverted'
	}
	
	handleLightTheme(){
		let style = document.querySelector("body > ytd-app")
		if(style){
			style = window.getComputedStyle(style).getPropertyValue("background-color")
			style = parseFloat(style.split(',')[1])
			console.log(style);
			if(style > 50){
				this.DOM.classList.remove('inverted')
			}
		}
	}
	
	onRender(){
		this.DOM.src = chrome.extension.getURL("icons/ChortOutline.svg")
		this.DOM.onclick = ()=>{
			if(menu && menu.isRendered()){
				menu.DOM.classList.toggle('hidden')
			}
		}
		
		this.DOM.onmouseenter = ()=>{
			if(menu && menu.isRendered() && menu.DOM.classList.contains('hidden')){
				menu.DOM.classList.toggle('hidden')
			}
		}
		
		this.handleLightTheme()
	}
	
}





// 888888b.                     888888b.   888             
// 888  "88b                    888  "88b  888             
// 888  .88P                    888  .88P  888             
// 8888888K.   8888b.  88888b.  8888888K.  888888 88888b.  
// 888  "Y88b     "88b 888 "88b 888  "Y88b 888    888 "88b 
// 888    888 .d888888 888  888 888    888 888    888  888 
// 888   d88P 888  888 888  888 888   d88P Y88b.  888  888 
// 8888888P"  "Y888888 888  888 8888888P"   "Y888 888  888 
class BanButton extends ExtensionElement {
    getNextSiblingSelector(){
        return '#top-row #subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button'
    }
    first(){
        this.tag = 'button'
        this.className = 'ytbl-extension-banbutton'
        this.innerHTML = 'BANBUTTON'
    }
	
	getChannelInfoSelector(){
		return '#top-row #channel-name #container #text > a'
	}
    
    getCurrentChannel(){
        let channelElt = document.querySelector(this.getChannelInfoSelector())
        if(!channelElt){return ''}
        
        let channelName = channelElt.innerText
        return channelName ? channelName : ''
    }
	
	getCurrentChannelLink(){
		let channelElt = document.querySelector(this.getChannelInfoSelector())
        if(!channelElt){return ''}
        
        let channelLink = channelElt.href
        return channelLink ? channelLink : ''
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
			let channelLink = this.getCurrentChannelLink()
            
            if(!channelName || !channelLink){return null}
            
            if(banlist.has(channelName)){
                banlist.removeFromList(channelName)
            }
            else {
                banlist.addToList(channelName, channelLink)
            }
        }
    }
}





