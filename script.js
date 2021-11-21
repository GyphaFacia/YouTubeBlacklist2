let removedVideos = new VideosSet()
let banlist = new ChannelBlacklist()
let suggestions = new Suggestions()

let banCounter = new BanCounter()
let menu = new ExtensionMenu()
let logo = new ExtensionLogo()
let banbutton = new BanButton()

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
			vid.DOM.innerHTML = ''
			vid.DOM.style.position = 'absolute'
			removedVideos.add(vid)
		}
	}
    
    if(removedVideos.updated){
        removedVideos.updated = false
        banCounter.cnt = removedVideos.content.length
    }
}, 255)


// let banCounter = new BanCounter('#center')
// let logo = new ExtensionLogo('#buttons > ytd-button-renderer')
// let menu = new ExtensionMenu('#end')
// let banButton = new BanButton('#top-row #subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button')











