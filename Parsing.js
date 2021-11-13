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








