let removedVideos = new VideosSet()
let banlist = new ChannelBlacklist()

let banCounter = new BanCounter()
let menu = new ExtensionMenu()
let logo = new ExtensionLogo()
let banbutton = new BanButton()

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
        banCounter.cnt = removedVideos.content.length
    }
}, 255)


// let banCounter = new BanCounter('#center')
// let logo = new ExtensionLogo('#buttons > ytd-button-renderer')
// let menu = new ExtensionMenu('#end')
// let banButton = new BanButton('#top-row #subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button')











