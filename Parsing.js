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

class Blacklist{
	storageKey(){return 'BlacklistLocalStorageKey'}
	
	constructor(){
        this.content = {}
        let store = localStorage.getItem(this.storageKey())
        if(!store){
            localStorage.setItem(this.storageKey(), JSON.stringify(this.content))
        }
        else{
            this.content = JSON.parse(store);
        }
    }
	
	addToList(key, val){
        this.content[key] = val
        
        let newStore = {...this.content, ...JSON.parse(localStorage.getItem(this.storageKey()))}
        localStorage.setItem(this.storageKey(), JSON.stringify(this.content))
        this.content = newStore
        menu.updateMenu()
    }
    
    removeFromList(key){
        let newStore = JSON.parse(localStorage.getItem(this.storageKey()))
        delete newStore[key]
        this.content = newStore
        localStorage.setItem(this.storageKey(), JSON.stringify(this.content))
    }
	
	has(key){
		let store = {...this.content, ...JSON.parse(localStorage.getItem(this.storageKey()))}
		this.content = store
		return (key in this.content)
	}
}

class Suggestions extends Blacklist{
	storageKey(){return 'suggestions'}
}

class ChannelBlacklist extends Blacklist{
	storageKey(){return 'blacklist'}
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








