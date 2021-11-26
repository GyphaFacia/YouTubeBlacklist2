// 888b     d888                            
// 8888b   d8888                            
// 88888b.d88888                            
// 888Y88888P888  .d88b.  88888b.  888  888 
// 888 Y888P 888 d8P  Y8b 888 "88b 888  888 
// 888  Y8P  888 88888888 888  888 888  888 
// 888   "   888 Y8b.     888  888 Y88b 888 
// 888       888  "Y8888  888  888  "Y88888 
class ExtensionMenu extends ExtensionElement{
	getNextSiblingSelector(){return '#container #buttons'}
	first(){
		this.tag = 'aside'
		this.className = 'ytbl-extension-menu hidden fade'
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
			switchers[i].onclick = switchers[i].onmouseenter = ()=>{
				this.deactivateTabs()
				switchers[i].classList.add('active')
				tabs[i].classList.remove('hidden')
				this.activeTab = i
			}
		}
	}
	
	hookMenuBlur(){
		let menu = document.querySelector('.ytbl-extension-menu')
		menu.onmouseleave = ()=>{
			this.hideMenu()
		}
		menu.onmouseenter = ()=>{
			clearTimeout(this.hideTimeout)
		}
	}
	
	handleLightTheme(){
		let style = document.querySelector("body > ytd-app")
		if(style){
			style = window.getComputedStyle(style).getPropertyValue("background-color")
			style = parseFloat(style.split(',')[1])
			if(style > 50){
				this.DOM.classList.add('inverted')
			}
		}
	}
	
	hideMenu(){
		let transitionDuration = parseFloat(getComputedStyle(this.DOM).transitionDuration)*1000
		
		this.DOM.classList.add('fade')
	    setTimeout(()=>{
	        this.DOM.classList.add('hidden')
	    }, transitionDuration)
	}
	
	showMenu(){
		menu.DOM.classList.remove('hidden')
		setTimeout(()=>{
			menu.DOM.classList.remove('fade')
		}, 0)
		
		this.hideTimeout = setTimeout(()=>{
			this.hideMenu()
		}, 2000)
	}
	
	////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////Blacklist//////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	getTabHiddenChannelsCode(){
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
	
	hookTabHiddenChannels(){
		for(let button of document.querySelectorAll('.banned-channel__button')){
			button.onclick = ()=>{
				banlist.removeFromList(button.parentNode.children[0].innerText)
			}
		}
	}
	
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////Suggestions///////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	getTabHiddenVideosCode(){
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
	
	hookTabHiddenVideos(){
		for(let button of document.querySelectorAll('.banned-video__button')){
			button.onclick = ()=>{
				let link = button.parentNode.children[0].href
				suggestions.removeFromList(link)
			}
		}
	}
	
	////////////////////////////////////////////////////////////////////////////
	///////////////////////////////Options//////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
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
	
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////Settings//////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
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
	
	////////////////////////////////////////////////////////////////////////////
	////////////////////////////////About///////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	getTabAboutCode(){
		return `
		<div class="about-links">
			<button class="about-links__clearbtn">Clear Blacklists</button>
			
			<a class="about-links__exportbtn">Export Blacklists</a>
			
			<span class="about-links-import-wrapper">
				<input class="about-links__importbtn" type="file">
				Import Blacklists
			</span>
			
			<a href="https://github.com/GyphaFacia" class="about-links__link">Visit my GitHub</a>
	    </div>
		`
	}
	
	hookTabAbout(){
		let data = {}
		data.blacklist = JSON.parse(localStorage.getItem('blacklist'))
		data.suggestions = JSON.parse(localStorage.getItem('suggestions'))
		data = JSON.stringify(data);
		data = "data:text/json;charset=utf-8," + encodeURIComponent(data)
		
		// clear
		let clearBtn = document.querySelector('.about-links__clearbtn')
		clearBtn.onclick = ()=>{
			if(confirm('Do you actually want to reset your blacklists for this extension ?')){
				localStorage.setItem('blacklist', '{}')
				localStorage.setItem('suggestions', '{}')
				
				banlist.update()
				suggestions.update()
				setStoreIsUpdated(true)
			}
		}
		
		// export
		let exportBtn = document.querySelector('.about-links__exportbtn')
		exportBtn.setAttribute("href", data)
		exportBtn.setAttribute("download", "YoutubeBlacklists.json")
		
		// import
		let importBtn = document.querySelector('.about-links-import-wrapper')
		importBtn.onclick = ()=>{
			importBtn.children[0].click()
		}
		importBtn.children[0].onchange = (e)=>{
			let reader = new FileReader();
			reader.readAsText(e.target.files[0])
			reader.onload = ()=>{
				let data = reader.result
				data = JSON.parse(data);
				
				if('blacklist' in data && 'suggestions' in data){
					localStorage.setItem('blacklist', JSON.stringify(data.blacklist))
					localStorage.setItem('suggestions', JSON.stringify(data.suggestions))
					
					banlist.update()
					suggestions.update()
					setStoreIsUpdated(true)
					alert('Blacklists successfully imported')
				}
				else{
					alert('Error occurred reading imported file')
				}
			}
			
			reader.onerror = ()=>{
				alert('Error occurred reading imported file')
			}
		}
	}
	
	////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	updateMenu(startHidden = false){
		this.innerHTML = `
		<div class="menu-switchers">
			<div class="menu-switchers__switcher active">HiddenChannels</div>
			<div class="menu-switchers__switcher">HiddenVideos</div>
			<div class="menu-switchers__switcher">Settings</div>
			<div class="menu-switchers__switcher">Extra</div>
		</div>
		
		<div class="menu-tabs">
            <div class="menu-tabs__tab">${this.getTabHiddenChannelsCode()}</div>
			<div class="menu-tabs__tab hidden">${this.getTabHiddenVideosCode()}</div>
            <div class="menu-tabs__tab hidden">${this.getTabSettingsCode()}</div>
            <div class="menu-tabs__tab hidden">${this.getTabAboutCode()}</div>
        </div>
		`
		
		this.handleLightTheme()
		this.hookTabSwitchers()
		this.hookMenuBlur()
		this.hookTabHiddenChannels()
		this.hookTabHiddenVideos()
		this.hookTabSettings()
		this.hookTabAbout()
		
		this.restoreActiveTab()
		
		if(startHidden){
			// this.hideMenu()
			this.DOM.classList.add('fade')
			this.DOM.classList.add('hidden')
		}
		else{
			this.DOM.classList.remove('fade')
			this.DOM.classList.remove('hidden')
			this.showMenu()
		}
	}
}











