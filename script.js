class ExtensionElement{
	constructor(){
		this.DOM = null
		this.tag = 'div'
		this.className = this.id = this.innerHTML = ''
		
		this.first()
		this.waitToRender()
		this.second()
	}
	
	// updates
	first(){}
	second(){}
	onRender(){}
	onUpdate(){}
	
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
	waitToRender(){
		if(this.isRendered()){return true}
		
		this.render()
		
		if(!this.isRendered()){
			setTimeout(()=>{
				this.waitToRender()
			}, 100)
		}
		else{
			this.onRender()
		}
	}
	
	render(){
		let next = document.querySelector('#center')
		let root = next.parentNode
		
		if(!next || !root){return false}
		
		this.DOM = document.createElement(this.tag)
		this.DOM.ext = this
		root.insertBefore(this.DOM, next)
		this.updateDOM()
		return true
	}
	
	isRendered(){return this.DOM ? true : false}	
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
		let next = document.querySelector('#center')
		let root = next.parentNode
		
		if(!next || !root){return false}
		
		this.DOM = document.createElement(this.tag)
		this.DOM.ext = this
		root.insertBefore(this.DOM, next)
		this.updateDOM()
		return true
	}
}

class ExtensionLogo extends ExtensionElement{
	first(){
		this.tag = 'img'
		this.className = 'ytbl-extension-logo'
	}
	
	onRender(){
		this.DOM.src = chrome.extension.getURL("icons/ChortOutline.svg")
	}
	
	render(){
		let next = document.querySelector('#buttons > ytd-button-renderer')
		let root = next.parentNode
		
		if(!next || !root){return false}
		
		this.DOM = document.createElement(this.tag)
		this.DOM.ext = this
		root.insertBefore(this.DOM, next)
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











