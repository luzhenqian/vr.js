class VR{
	constructor(option){
		Object.keys(option).forEach(k=>{
			if(k === 'state'){
				this._state = option[k];
			}else{
				if(k === 'render'){
					this._render = option[k];				
				}else{
					this[k] = option[k];
				}
			}
		});
		if(!this.app){
			console.error('Uncaught TypeError: app is not a defined;not specified app,app is necessary!');
			return;
		}else{
			if(typeof this.app !== 'string'){
				console.error('Uncaught TypeError: app is not a string');
				return;
			}else{
				this.app = document.getElementById(this.app);
			}
		}
		if(this.methods){
			if(typeof this.methods !== 'object'){
				console.error('Uncaught TypeError: methods is not a object');
				return;
			}else{
				Object.keys(this.methods).forEach(method=>{
					this[method] = this.methods[method].bind(this);
				})
			}
		}
		this.state = new Proxy(this._state,{set:(k,v)=>{
			console.warn(`state can't be updated on their own initiative`);
			this._state[k] = v;
		}});
		['a','abbr','acronym','address','applet','area','article','aside','audio',
		'b','base','basefont','bdi','bdo','big','blockquote','body','br','button',
		'canvas','caption','center','cite','code','col','colgroup','command',
		'datalist','dd','del','details','dir','div','dfn','dialog','dl','dt',
		'em','embed','fieldset','figcaption','figure','font','footer','form','frame','frameset',
		'h1','h2','h3','h4','h5','h6','head','header','hr','html','i','iframe','img','input','ins','isindex',
		'kbd','keygen','label','legend','li','link','map','mark','menu','menuitem','meta','meter',
		'nav','noframes','noscript','object','ol','optgroup','option','output','p','param','pre','progress',
		'q','rp','rt','ruby','s','samp','script','section','select','small','source','span','strike','strong','style','sub','summary','sup',
		'table','tbody','td','textarea','tfoot','th','thead','time','title','tr','track','tt','u','ul','var','video','wbr','xmp',]
		.forEach(el=>{window[el] = (...args)=>this.makeElement(`${el}`,...args);});
		this.init();
	}
	init(){
		this.didMount();
		this.render();
	}
	render(){
		this.removeAllChildElements();
		this.app.appendChild(this._render());
	}
	removeAllChildElements(){
		while(this.app.hasChildNodes()){
			this.app.removeChild(app.firstChild);
		}
	}
	makeElement(elType,attribute,...otherChildren) {
		const el = document.createElement(elType);
		if(Array.isArray(attribute)){
			this.appendElement(el,attribute);
		}else{
			if(attribute instanceof window.Element){
				el.appendChild(attribute);
			}else{
				if(typeof attribute === 'string'){
					this.appendText(el,attribute);
				}else{
					if(typeof attribute === 'object'){
						Object.keys(attribute).forEach(t=>{
							if(t in el){
								const value = attribute[t];
								if(t === 'style'){
									Object.keys(attribute[t]).forEach(style=>{el.style[style] = attribute[t][style]});
								}else{
									el[t] = value;
								}
							}else{
								if(t === 'text'){
									this.appendText(el,attribute[t]);
								}
								if(t === 'bind'){
									el.value = this.state[attribute[t]];
									el.onchange = ()=>this.bind(el.value,attribute[t]);
								}
							}
						})
					}
				}
			}
		}
		if(otherChildren){
			this.appendElement(el,otherChildren);
		}
		return el;
	}
	appendText(el,text){
		const textNode = document.createTextNode(text);
		el.appendChild(textNode);
	}
	appendElement(el,children){
		children.forEach(child=>{
			if(Array.isArray(child)){
				this.appendElement(el,child);
			}else if(child instanceof window.Element){
				el.appendChild(child);
			}else if(typeof child === 'string'){
				this.appendText(el,child);
			}else if(typeof child === 'object'){
				this.setProtoelType(el,child);
			}
		})
	}
	setProtoelType(el,attribute){
		if(!attribute){
			return;
		}
		Object.keys(attribute).forEach(t=>{
			if(t in Object.getPrototypeOf(el)){
				el[t] = attribute[t];
			}else{
				console.warn(`${t} is not a valid style for a <${el.tagName.toLowerCase()}>`);
			}
		})
	}
	bind(v,k){
		this._state[k] = v;
	}
	setState(state){
		if(typeof state !== 'object'){
			console.error('Uncaught TypeError: state is not a object');
		}else{
			Object.keys(state).forEach(k=>{this._state[k]=state[k];});
			this.render();
		}
	}
}