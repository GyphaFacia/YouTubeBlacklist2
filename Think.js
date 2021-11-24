let removedVideos = new VideosSet()
let banlist = new ChannelBlacklist()
let suggestions = new Suggestions()

let banCounter = new BanCounter()
let menu = new ExtensionMenu()
let logo = new ExtensionLogo()
let banbutton = new BanButton()

setStoreIsUpdated(false)

setInterval(()=>{
	for(let thumbnail of document.querySelectorAll("#dismissible")){
		thumbnail.oncontextmenu = (e)=>{
			let link = thumbnail.querySelector('a').href
			let name = thumbnail.querySelector('#video-title').innerText
			
			if(	confirm(`Do you want to hide \n${name}\nvideo from suggestions ?`) ){
				suggestions.addToList(link, name)
				e.preventDefault()
			}
		}
	}
	
	for(let vid of parseAllVideos()){
		let pageIsHistory = window.location.href.includes('/history')
		let isChannelBlacklisted = banlist.has(vid.channelName) && menu.options['HideBanned']
		let isVideoSeen = vid.progress && menu.options['HideWatched'] && !pageIsHistory
		let videoHiddenFromSuggestions = (vid.videoHref in suggestions.content) && menu.options['HideSuggested']
		
		let vidShallBeRemoved = isChannelBlacklisted || isVideoSeen || videoHiddenFromSuggestions
		if(vidShallBeRemoved){
			// vid.oldHTML = vid.DOM.innerHTML
			// vid.DOM.innerHTML = ''
			vid.DOM.style.position = 'absolute'
			vid.DOM.style.tranform = 'translateY(-200vh)'
			vid.DOM.style.display = 'none'
			removedVideos.add(vid)
		}
		else if (vid.DOM.style.position == 'absolute') {
			// vid.DOM.innerHTML = vid.oldHTML
			vid.DOM.style.position = 'static'
			vid.DOM.style.tranform = 'none'
			vid.DOM.style.display = 'block'
		}
	}
	
	if(isStoreUpdated() && isStoreUpdated() != window.location.href){
		setTimeout(()=>{
			setStoreIsUpdated(false)
		}, 255)
		banlist.update()
		suggestions.update()
	}
    
    if(removedVideos.updated){
        removedVideos.updated = false
        banCounter.cnt = removedVideos.content.length
    }
}, 255)













