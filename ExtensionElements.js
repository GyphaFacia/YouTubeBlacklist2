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
                banlist.unbanChannel(channelName)
            }
            else {
                banlist.banChannel(channelName, channelLink)
            }
        }
    }
}





// 888b     d888                            
// 8888b   d8888                            
// 88888b.d88888                            
// 888Y88888P888  .d88b.  88888b.  888  888 
// 888 Y888P 888 d8P  Y8b 888 "88b 888  888 
// 888  Y8P  888 88888888 888  888 888  888 
// 888   "   888 Y8b.     888  888 Y88b 888 
// 888       888  "Y8888  888  888  "Y88888 
class ExtensionMenu extends ExtensionElement{
	getNextSiblingSelector(){return '#container #buttons > ytd-button-renderer'}
	first(){
		this.tag = 'aside'
		this.className = 'ytbl-extension-menu hidden'
		this.activeTab = 0
		this.loadOptions()
	}
	
	onRender(){
		if(window.location.href.includes('/watch')){
			// page with video player has no header border for some reason
			this.DOM.style.top = '56px' 
		}
		
		this.updateMenu(true)
	}
	
	deactivateTabs(){
		for(let tab of document.querySelectorAll('.menu-tabs__tab')){
			tab.classList.add('hidden')
		}
		for(let switcher of document.querySelectorAll('.menu-switchers__switcher')){
			switcher.classList.remove('active')
		}
	}
	
	restoreActiveTab(){
		this.deactivateTabs()
		let switchers = document.querySelectorAll('.menu-switchers__switcher')
		let tabs = document.querySelectorAll('.menu-tabs__tab')
		switchers[this.activeTab].classList.add('active')
		tabs[this.activeTab].classList.remove('hidden')
	}
	
	hookTabSwitchers(){
		let switchers = document.querySelectorAll('.menu-switchers__switcher')
		let tabs = document.querySelectorAll('.menu-tabs__tab')
		for (let i = 0; i < switchers.length; i++) {
			switchers[i].onclick = ()=>{
				this.deactivateTabs()
				switchers[i].classList.add('active')
				tabs[i].classList.remove('hidden')
				this.activeTab = i
			}
		}
	}
	
	getTabBlacklistCode(){
		let code = ''
		for(let channel in banlist.content){
			code += `
			<span class="banned-channel">
		        <a class="banned-channel__name" href="${banlist.content[channel]}">${channel}</a>
		        <div class="banned-channel__button">UnHide Channel</div>
		    </span>
			`
		}
		return code
	}
	
	hookTabBlacklist(){
		for(let button of document.querySelectorAll('.banned-channel__button')){
			button.onclick = ()=>{
				banlist.unbanChannel(button.parentNode.children[0].innerText)
				this.updateMenu()
			}
		}
	}
	
	getTabSuggestionsCode(){
		let code = ''
		for(let link in suggestions.content){
			let title = suggestions.content[link]
			title = title.length < 30 ? title : (title.substr(0, 27) + '...')
			code += `
			<span class="banned-video">
		        <a class="banned-video__name" href="${link}">${title}</a>
		        <div class="banned-video__button ">UnHide Video</div>
		    </span>
			`
		}
		return code
	}
	
	hookTabSuggestions(){
		for(let button of document.querySelectorAll('.banned-video__button')){
			button.onclick = ()=>{
				let link = button.parentNode.children[0].href
				suggestions.removeVideo(link)
				this.updateMenu()
			}
		}
	}
	
	loadOptions(){
		this.options = JSON.parse(localStorage.getItem('options'))
		if(!this.options){
			this.options = {
				'HideBanned': true,
				'HideWatched' : true,
				'HideSuggested': true,
			}
		}
		this.saveOptions()
	}
	
	saveOptions(){
		localStorage.setItem('options', JSON.stringify(this.options))
	}
	
	getOptionsDescriptions(){
		return {
			'HideBanned': 'Hide videos from blacklisted channels',
			'HideWatched': 'Hide watched videos',
			'HideSuggested': 'Hide videos you blacklisted from suggestions',
		}
	}
	
	getOptionByDescription(description){
		let kv = this.getOptionsDescriptions()
		for(let k in kv){
			if(kv[k] == description){
				return k
			}
		}
		return ''
	}
	
	getTabSettingsCode(){
		let kv = this.getOptionsDescriptions()
		
		let code = ''
		for(let k in kv){
			let mark = this.options[k] ? '✔' : ' '
			let v = kv[k]
			code += `
			<div class="extension-settings-item">
	            <span class="extension-settings-item__name">${v}</span>
				<button class="extension-settings-item__checkbox">${mark}</button>
	        </div>  
			` 
		}
		
		code = `<div class="extension-settings"> ${code} </div>`
		
		return code
	}
	
	hookTabSettings(){
		for(let button of document.querySelectorAll('.extension-settings-item__checkbox')){
			button.onclick = ()=>{
				let optionsDescr = button.parentNode.children[0].innerText
				let option = this.getOptionByDescription(optionsDescr)
				this.options[option] = !this.options[option]
				this.saveOptions()
				this.updateMenu()
			}
		}
	}
	
	getTabAboutCode(){
		return `
		<div class="about-links">
	        <a href="https://github.com/GyphaFacia" class="about-links__link">My Git Hub</a>
	    </div>
		`
	}
	
	hookTabAbout(){}
	
	updateMenu(startHidden = false){
		this.innerHTML = `
		<div class="menu-switchers">
			<div class="menu-switchers__switcher active">Black List</div>
			<div class="menu-switchers__switcher">Suggestions</div>
			<div class="menu-switchers__switcher">Settings</div>
			<div class="menu-switchers__switcher">About</div>
		</div>
		
		<div class="menu-tabs">
            <div class="menu-tabs__tab">${this.getTabBlacklistCode()}</div>
			<div class="menu-tabs__tab hidden">${this.getTabSuggestionsCode()}</div>
            <div class="menu-tabs__tab hidden">${this.getTabSettingsCode()}</div>
            <div class="menu-tabs__tab hidden">${this.getTabAboutCode()}</div>
        </div>
		`
		
		this.hookTabSwitchers()		
		this.hookTabBlacklist()
		this.hookTabSuggestions()
		this.hookTabSettings()
		
		this.restoreActiveTab()
		
		if(startHidden){
			this.DOM.classList.add('hidden')
		}
		else{
			this.DOM.classList.remove('hidden')
		}
	}
}











