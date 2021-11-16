class Suggestions{
    constructor(){
        this.content = {}
        let store = localStorage.getItem('suggestions')
        if(!store){
            localStorage.setItem('suggestions', JSON.stringify(this.content))
        }
        else{
            this.content = JSON.parse(store);
        }
    }
    
    addVideo(videoLink, videoName){
        this.content[videoLink] = videoName
        
        let newStore = {...this.content, ...JSON.parse(localStorage.getItem('suggestions'))}
        localStorage.setItem('suggestions', JSON.stringify(this.content))
        this.content = newStore
        menu.updateMenu()
    }
    
    removeVideo(link){
        let newStore = JSON.parse(localStorage.getItem('suggestions'))
        delete newStore[link]
        this.content = newStore
        localStorage.setItem('suggestions', JSON.stringify(this.content))
    }
}