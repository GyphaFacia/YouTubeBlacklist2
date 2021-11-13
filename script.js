class ExtensionElement{
	constructor(){
		this.DOM = null
		this.tag = 'div'
		this.className = this.id = this.innerHTML = ''
		this.alive = false
		this.thinkDelay = 350
		
		this.first()
		// this.waitToRender()
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
	
	render(){
		this.next = document.querySelector('#center')
		this.root = this.next.parentNode
		
		if(!this.next || !this.root){return false}
		
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

class BanCounter extends ExtensionElement{
	get cnt(){return this.__cnt}
	set cnt(val){
		this.__cnt = val
		this.innerHTML = `Removed ${this.cnt} videos`
	}
	
	first(){
		this.cnt = 0
		this.className = 'ytbl-extension-bancounter'
	}
	
	onRender(){
		this.DOM.onclick = (e)=>{
			this.cnt++
		}
	}
	
	render(){
		this.next = document.querySelector('#center')
		this.root = this.next.parentNode
		
		if(!this.next || !this.root){return false}
		
		this.DOM = document.createElement(this.tag)
		this.DOM.ext = this
		this.root.insertBefore(this.DOM, this.next)
		this.updateDOM()
		return true
	}
}

class ExtensionLogo extends ExtensionElement{
	first(){
		this.tag = 'img'
		this.className = 'ytbl-extension-logo'
	}
	
	onRemove(){
		console.log('logo lost');
	}
	
	onRender(){
		this.DOM.src = chrome.extension.getURL("icons/ChortOutline.svg")
	}
	
	render(){
		this.next = document.querySelector('#buttons > ytd-button-renderer')
		if(!this.next){return false}
		this.root = this.next.parentNode
		if(!this.root){return false}
		
		this.DOM = document.createElement(this.tag)
		this.DOM.ext = this
		this.root.insertBefore(this.DOM, this.next)
		this.updateDOM()
		return true
	}
}

let banCounter = new BanCounter()
let logo = new ExtensionLogo()

// let banCounter = new BanCounter('#center')
// let logo = new ExtensionLogo('#buttons > ytd-button-renderer')
// let menu = new ExtensionMenu('#end')
// let banButton = new BanButton('#top-row #subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button')











