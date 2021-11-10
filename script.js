function getSelectorsFromPageType(pageType){
	let json = {
		'home':{
			'root':'ytd-rich-item-renderer',
			'videoTitle': '#video-title',
			'videoHref': '#thumbnail',
			'channelName' : '#text > a',
			'channelHref' : '#text > a',
		},
		'search':{
			'root':'ytd-video-renderer',
			'videoTitle': '#video-title',
			'videoHref': '#thumbnail',
			'channelName' : '#text > a',
			'channelHref' : '#text > a',
		},
		'feed':{
			'root':'ytd-video-renderer',
			'videoTitle': '#video-title',
			'videoHref': '#thumbnail',
			'channelName' : '#text > a',
			'channelHref' : '#text > a',
		},
		'watch':{
			'root':'ytd-compact-video-renderer',
			'videoTitle': '#video-title',
			'videoHref': '#thumbnail',
			'channelName' : 'ytd-channel-name',
			'channelHref' : '#text > a',
		},
	}
	
	return json[pageType]
}

class ChannelBlacklist {
	constructor(){
		this.key = 'CHANNELS_BLACKLIST'
		this.content = {}
		this.loadList()
	}
	
	banChannel(name, link){
		this.content[name] = link
		this.saveList()
	}
	
	unbanChannel(name){
		delete this.content[name]
		this.saveList()
	}
	
	getBannedNames(){
		let names = []
		for(name in this.content){
			names.push(name)
		}
		return names
	}
	
	getBannedLinks(){
		let links = []
		for(link of this.content){
			links.push(link)
		}
		return links
	}
	
	has(name){
		return (name in this.content)
	}
	
	loadList(){
		this.content = {}
		chrome.storage.local.get([this.key], (data)=>{
			this.content = data[this.key]
            this.content = this.content ? this.content : {}
		})
	}
	
	saveList(){
		chrome.storage.local.set({[this.key] : this.content})
	}
}

class VideosSet {
	constructor(key = 'videoHref') {
		this.key = key
		this.content = []
		this.updated = false
	}
	
	add(newvid){
		if( ! this.has(newvid) ){
			this.content.push(newvid)
			this.updated = true
			return true
		}
		return false
	}
	
	has(searchvid){
		for(let vid of this.content){
			if(searchvid[this.key] == vid[this.key]){
				return true
			}
		}
		return false
	}
}

function parseAllVideos(){
	let url = window.location.href
	let pageType = ''
	let vids = []
	
	if(url.includes('/result')){ pageType = 'search' }
	else if(url.includes('/feed')){	pageType = 'feed' }
	else if(url.includes('/watch')){ pageType = 'watch'	}
	else{ pageType = 'home'	}
	
	let selectors = getSelectorsFromPageType(pageType)
	for(let domElt of document.querySelectorAll(selectors.root)){
		try {
			vids.push({
				videoTitle: domElt.querySelector(selectors.videoTitle).innerText,
				videoHref: domElt.querySelector(selectors.videoHref).href,
				channelName : domElt.querySelector(selectors.channelName).innerText,
				channelHref : pageType != 'watch' ? domElt.querySelector(selectors.channelHref).href : '',
				DOM: domElt,
			})
		}catch(e){}
		
		if(!vids.length){ continue }
		
		let vid = vids[vids.length - 1]
		let progress = vid.DOM.querySelector('#progress')
		
		if(progress){
			progress = progress.outerHTML
			progress = progress.split('width: ')[1]
			progress = progress.split('%')[0]
			progress = parseFloat(progress)
		}
		vid.progress = progress ? progress : 0
	}
	
	return vids
}

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
            this.catchRemoval()
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
    
    catchRemoval(){
        if(!this.isRendered()){
            this.waitToRender()
        }
        else{
            setTimeout(()=>{
                this.catchRemoval()
            }, 255)
        }
    }
    
    isRendered(){
        return this.DOM && this.DOM.parentNode
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
        this.id = 'ytbl-bancounter'
        this.type = 'span'
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

class ExtensionLogo extends ExtensionElement {    
    first(){
        this.type = 'img'
        this.className = 'ytbl-logo'
    }
    
    onRender(){
        this.DOM.src = chrome.extension.getURL("icons/ChortOutline.svg")
        
        this.DOM.onclick = ()=>{
            let menu = document.querySelector('#ytbl-menu')
            if(menu){
                menu.classList.toggle('hidden')
            }
        }
    }
}

class ExtensionMenu extends ExtensionElement{    
    first(){
        this.type = 'aside'
        this.id = 'ytbl-menu'
        this.className = 'ytbl'
    }
	
	updateMenu(){
		this.innerHTML = `
        <main class="tabs-wrapper">
            <div class="tabs-options">
                <button class="tab-option active-tab" id="tab-option-1">Black List</button>
                <button class="tab-option" id="tab-option-2">Remove Watched</button>
                <button class="tab-option" id="tab-option-3">Max Suggestions</button>
            </div>
            
            <div id="tabs-content">
                <div class="tab" id="tab-1">
					${this.getBlacklistTab()}
				</div>
                <div class="tab hidden" id="tab-2"></div>
                <div class="tab hidden" id="tab-3"></div>
            </div>
        </main>
        `
	}
	
	getBlacklistTab(){
		let code = ``
		for(let channelName in banlist.content){
			code += 
			`
			<div class="blacklist-item">
				<span>${channelName}</span>
				<button class="unhide-button">UnHide</button>
			</div>
			`
		}
	}
    
    onRender(){
        this.DOM.classList.toggle('hidden')
        
        let tabOptions = document.querySelectorAll('.tab-option')
        let tabs = document.querySelectorAll('.tab')
        let n = Math.min(tabOptions.length, tabs.length)
        
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

class BanButton extends ExtensionElement {    
    first(){
        this.type = 'button'
        this.id = 'ban-button'
        this.innerHTML = `Hide Channel`
        
        setInterval(()=>{
			this.updateButtonText()
        }, 500)
    }
	
    getChannelLink(){
        let result = document.querySelector('ytd-video-owner-renderer #text > a')
        return result ? result.href : ''
    }
    
    getChannelName(){
        let result = document.querySelector('ytd-video-owner-renderer #text > a')
        return result ? result.innerText : ''
    }
    
    getIsBanned(){
        return banlist.has(this.getChannelName())
    }
    
    updateButtonText(){
        this.innerHTML = this.getIsBanned() ? 'UnHide Channel' : 'Hide Channel'
    }
    
    onRender(){
        this.updateButtonText()
        
        this.DOM.onclick = (e)=>{
            console.log(banlist);
            if(this.getIsBanned()){
                banlist.unbanChannel(this.getChannelName())
            }
            else{
                banlist.banChannel(this.getChannelName(), this.getChannelLink())
            }
                
            setTimeout(()=>{
                this.updateButtonText()
            }, 100);
        }
    }
}

let banCounter = new BanCounter('#center')
let logo = new ExtensionLogo('#buttons > ytd-button-renderer')
let menu = new ExtensionMenu('#end')
let banButton = new BanButton('#top-row #subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button')

let removedVideos = new VideosSet()
let banlist = new ChannelBlacklist()

setInterval(()=>{
	for(let vid of parseAllVideos()){
		if(banlist.has(vid.channelName) || vid.progress){
			vid.DOM.innerHTML = ''
			vid.DOM.style.position = 'absolute'
			removedVideos.add(vid)
		}
	}
    
    if(removedVideos.updated){
        removedVideos.updated = false
        banCounter.banCnt = removedVideos.content.length
    }
}, 255)














