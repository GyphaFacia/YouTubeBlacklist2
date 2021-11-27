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
		if(vidShallBeRemoved(vid)){
			if(vidShallBeBlured()){
				vid.DOM.classList.add('video-blured')
			}
			else{
				vid.DOM.classList.add('video-removed')
			}
			// vid.DOM.innerHTML = ''
			removedVideos.add(vid)
		}
	}
	
	if(isStoreUpdated() && isStoreUpdated() != window.location.href){
		setTimeout(()=>{
			setStoreIsUpdated(false)
		}, 500)
		banlist.update()
		suggestions.update()
	}
    
    if(removedVideos.updated){
        removedVideos.updated = false
        banCounter.cnt = removedVideos.content.length
    }
}, 500)













