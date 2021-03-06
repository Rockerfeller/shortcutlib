/*
    GPL javascript library for dom manipulation and more
    Copyright (C) 2013  Antoine Morin-Paulhus

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

var shortcutLib;

if(typeof q !== 'undefined'){
	shortcutLib.previousQ = q;
}

q = shortcutLib;


(function(q){
	
	q = {};
	
	//Utilities
	
	q.callbacks = {};
	
	q.callbacks.callbacks = [];
	
	q.callbacks.add = function(refName,callback){
		
		if(typeof q.callbacks.callbacks[refName] === 'undefined')
			q.callbacks.callbacks[refName] = []
			
		q.callbacks.callbacks[refName].push(callback)
	}
	
	q.callbacks.execute = function(refName){
		
		if(typeof q.callbacks.callbacks[refName] === 'undefined')
			return
			
		for(var i = 0; i < q.callbacks.callbacks[refName].length; i++){
			q.callbacks.callbacks[refName][i]()
		}
	}
	
	q.ready = function(callback){
		if(typeof callback === 'undefined'){
			q.callbacks.execute("domready")
		}
		else{
			q.callbacks.add("domready",callback)
		}
	}
	
	q.inArray = function(a,obj){
		return (a.indexOf(obj) === -1)?false:true;
	}
	
	shortcutLib = q;
	
})(shortcutLib);

q = shortcutLib;
(function(q){
	/*[dom]*/
	
	rootElement = document
	
	q.d = function(selector,initing){
		if( typeof initing !== 'undefined' && initing == true){
			
			this.element = null
			this.elements = []
			this.isQ = true
			
			if(typeof selector == 'string')
				this.elements = rootElement.querySelectorAll(selector)
			else if ( selector.isQ == true){
				this.elements = selector.elements
				this.length = selector.length
			}
			else{
				this.elements[0] = selector
				this.length = 1
			}
				
		
			return this;
		}
		else{		
			return q.d.init(selector)
		}		
	}
	
	//Selectors
	
	q.d.fn = q.d.prototype;
	
	q.d.init = function (selector){
		return new q.d(selector,true); 
	}
	
	q.d.fn.find = function (selector){
		
		var rootElement = this.elements[0]
		
        var ret = q.d(this)
        
		ret.element = null;
		ret.elements = [];
		
		if(typeof selector == 'string')
			ret.elements = rootElement.querySelectorAll(selector)
			
		return ret
	}
	
	
	//Manipulate
	
	q.d.fn.before = function(content){
		var $ = this
		
		if(typeof(content) == "string"){
			content = q.d.utils.HTMLStringToFragment(content)
		}
		$.each(function(){
			rootElement.body.insertBefore(content, $.element)
		})
		
		return $
	}

	q.d.fn.after = function(content){
		var $ = this;
		
		if(typeof(content) == "string"){
			content = q.d.utils.html(content)
		}
		$.each(function(){
			$.element.
				parentNode.
					insertBefore( 	
									content,	
									$.element.nextSibling 
								);
		});
		
		return $;
	}

	q.d.fn.append = function(content){
		var $ = this
		
		if(typeof content === 'undefined')
			return q
			
		if(typeof content === "string"){
			content = q.d.utils.html(content)
		}
		
		$.each(function(){
			$.element.appendChild(content)
		})
		
		return $;
	}

	q.d.fn.prepend = function(content){
		var $ = this;
		
		if(typeof(content) == "string"){
			content = q.d.utils.html(content)
		}
		
		$.each(function(){
			if($.element.firstChild){
				$.element.insertBefore(content,$.element.firstChild)
			}
			else{
				$.element.appendChild(content)
			}
		});
		
		return $;
	}

	q.d.fn.remove = function(){
		var q = this;
		
		q.each(function(){
			q.element.parentNode.removeChild(q.element)
		})
		
		return q
	}
	
	q.d.fn.clear = function (){
		var q = this
		
		q.each(function(){
			this.element.innerHTML = ''
		})
		
		return q
	}
	
	q.d.fn.text = function(newText){
		var $ = this;
		
		if(typeof newText === 'undefined'){
			var text = "";
			$.each(function(){
				text += $.element.textContent
			})
			
			return text
		}
		else{
			$.each(function(){
				$.element.textContent = newText
			})
		}
		
		return $;
	}
	
	q.d.fn.html = function(newHtml){
		var $ = this;
		
		if(typeof newHtml === 'undefined'){
			var html = "";
			$.each(function(){
				html += $.element.innerHTML
			})
			
			return html
		}
		else{
			$.each(function(){
				$.element.innerHTML = newHtml
				$.element.innerHTML = newHtml
			})
		}
		
		return $;
	}
	
	//classes
	
	q.d.fn.addClass = function(className){
		var $ = this;
		
		$.each(function(){
			$.element.classList.add(className)
		});
		return $;
	}
	
	q.d.fn.removeClass = function(className){
		var $ = this;
		
		$.each(function(){
			$.element.classList.remove(className)
		});
		return $;
	}
	
	q.d.fn.toggleClass = function(className){
		var $ = this;
		
		$.each(function(){
			$.element.classList.toggle(className)
		});

		return $;
	}
	
	q.d.fn.hasClass = function(className){
		return this.elements[0].classList.contains(className)
	}
	
	//Events
	
	q.d.fn.on = function(eventType,callback){
		var $ = this;
		
		$.each(function(){
			callback.bind(q.d($.element))
            $.element.addEventListener(eventType,callback);
		});
		
		return $;
	}

	q.d.fn.one = function(eventType,callback){
		var $ = this;
		
		$.each(function(){
			
			var el = $.element
			
			el.addEventListener(eventType,internalEventListener);
			
			function internalEventListener(event){
				el.removeEventListener(eventType,internalEventListener)
				callback.call(el,event)
			}
		});
		
		return $;
	}
    
    q.d.fn.unbind = function(event,listener){
        var $ = this
        this.each(function(){
            $.element.removeEventListener(event,listener)
        })
        return this
    }

	//Styling
	
	q.d.fn.css = function(rules){
		var $ = this;

		for(rule in rules){
			$.each(function(){
				$.element.style[rule] = rules[rule]
			})			
		}

		return $;
	}
	
	q.d.fn.hide = function(){
		this.each(function(){
			this.attr("data-display",this.element.style.display)
			this.element.style.display = "none"
		})
		return this
	}
	
	q.d.fn.show = function(){
		this.each(function(){
			this.element.style.display = this.attr("data-display")
		})
		return this
	}
	
	q.d.fn.height = function(newHeight){
		if(typeof newHeight === 'undefined'){
			var clientHeight = this.elements[0].clientHeight
			
			return	(clientHeight != 0 ) ?
					clientHeight :
					this.elements[0].innerHeight
		}
		this.each(function(){
			if(newHeight == parseInt(newHeight)){
				newHeight += "px"
			}
			this.element.style.height = newHeight
		})
	}
	
	q.d.fn.width = function(newWidth){
		if(typeof newWidth === 'undefined'){
			var clientWidth = this.elements[0].clientWidth
			
			return	(clientWidth != 0 ) ?
					clientWidth :
					this.elements[0].innerWidth
		}
		this.each(function(){
			if(newWidth == parseInt(newWidth)){
				newWidth += "px"
			}
			this.element.style.Width = newWidth
		})
	}
	
	//Forms
	
	q.d.fn.val = function(value){
		if(typeof value === 'undefined'){
			return this.elements[0].value
		}
		this.each(function(){
			this.element.value = value
		})
		
		return this
	}
	
    //Absolute positioning
    
    q.d.fn.top = function(arg){
        var $ = this
        if(typeof arg == "undefined")
            return this.elements[0].offsetTop || 0
        $.each(function(){            
            if(typeof arg == "string")
                this.element.style.top = arg
            else
                this.element.style.top = arg+"px"
        })
        return this
    }

    q.d.fn.left = function(arg){
        var $ = this
        if(typeof arg == "undefined")
            return this.elements[0].offsetLeft
        $.each(function(){
            if(typeof arg == "string")
                $.element.style.left = arg
            else
                $.element.style.left = arg+"px"
        })
        return this
    }
    
	//Data
	
	q.d.fn.attr = function(attribute,value){
		if (typeof value === 'undefined'){
			return this.elements[0].getAttribute(attribute)
		}
		else{
			this.elements[0].setAttribute(attribute,value)
			return this;
		}
	}
	
	//Merge elements with other q.d() instances
	
	q.d.fn.and = function(otherInstance){
		this.element = null
		this.elements = this.elements.concat(otherInstance.elements)
		this.length = this.elements.length
		
		return this
	}
	
	//Access dom
	
	q.d.fn.item = function(index){
		if(typeof this.elements[index] != 'undefined')
			return this.elements[index]
		else
			return null
	}
	
	q.d.fn.eq = function(index){
		if(typeof this.elements[index] != 'undefined')
			return q.d(this.elements[index])
		else
			return null
	}
	
	q.d.fn.parent = function(nthParent){
		var el = this.elements[0]
        
        while(nthParent--)
            el = el.parentNode

		return q.d(el)
	}
    
	/*
      Be careful with q.each() !
      It does not work as jQuery's each method,
      q.each() iterates over selected elements
      and puts the current element in q.element 
      before calling your callback function.
      
      Examples:
      
      q.d("div").each(function(){
          //Here, q.element is the current div
          q.element.style.color = red
      })
      
      q.d("div").each(function(){
          //You can also do this
          q.d(q.element).css({color:'red'})
      })

      q.d("div").each(function(){
          //You can stop iterating by returning -1
          if(thatWasEnough)
              return -1;
      })
    */
	q.d.fn.each = function(callback){
		var $ = this
		for(var i = 0; i < $.elements.length; i++ ){
			$.element = $.elements[i]
            
			if(callback.call($) == -1){
				return $
			}
		}
		return $
	}
	
	q.d.fn.first = function(){
		return q.d(this.elements[0])
	}
	
	
	q.d.utils = {}
	
	q.d.utils.html = function (htmlString){	
		var frag = rootElement.createDocumentFragment(),
			temp = rootElement.createElement('div')
		
		temp.innerHTML = htmlString;
		
		while (temp.firstChild) {
			frag.appendChild(temp.firstChild)
		}
		
		return frag;
	}
	
	q.d.utils.nodeList = function(domElement){
		var fragment = rootElement.createDocumentFragment()
		fragment.appendChild(domElement);
		return fragment.childNodes;
	}
	
	q.d.utils.addStyle = function (style){
		if(typeof(style) == "string"){
			var css = rootElement.createElement("style")
			css.type = "text/css"
			css.innerHTML = style
			q.d("head").append(css)
		}
	}
	
	q.extend = function (object,defaults){
		
		if(typeof object === 'undefined'){
			return defaults
		}
		
		for(var setting in defaults)
			if(typeof object[setting] === 'undefined')
				object[setting] = defaults[setting]
		
		return object
	}
	
	
	/*[/dom]*/
})(shortcutLib);
(function(q){
	q.rest = {}
	
	q.rest.data = {}
	
	q.rest.data.remoteUrl = "127.0.0.1"
	
	q.rest.put = function(path,data,url){
		url = url || q.rest.data.remoteUrl
		
	}
	
	q.rest.delete = function(path,data,url){
		url = url || q.rest.data.remoteUrl
		
	}
	
	q.ajax = function(data){
		
		if(typeof data.url === 'undefined')
			return "AJAX: url is undefined";
		if(typeof data.method === 'undefined')
			return "AJAX: method is undefined";
			
		var xhr = new XMLHttpRequest();
		
		xhr.open(data.method,data.url,true)
		
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		
		if(data.beforeSend === 'function')
			data.beforeSend(xhr)
		
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 0){
				if(typeof data.notInitialized === 'function')
					data.notInitialized(xhr)
			}
			if(xhr.readyState == 1){
				if(typeof data.setUp === 'function')
					data.setUp(xhr)
			}
			if(xhr.readyState == 2){
				if(typeof data.sent === 'function')
					data.sent(xhr)
			}
			if(xhr.readyState == 3){
				if(typeof data.inProgress === 'function')
					data.inProgress(xhr)
			}
			if(xhr.readyState == 4){
				console.log(xhr.responseText)
				if(typeof data.complete === 'function')
					data.complete(xhr)
			}
					
		}
		
		xhr.send()
	}
	
})(shortcutLib);
/*

WORKFLOW:

Define/run asserts
    q.assert(cond,"planting potatoes inside garden")

Define/run equality tests
    q.equal(a,b,"...")

Define/run deep equality tests (Not yet implemented)
    q.deepEqual(a,b,"...")

Do a benchmark test
    //How many test per seconds, over 300 miliseconds
    console.log(
        q.bench(function(){},{method:"perSecond",length:300})
    )
    //OR
    //How many miliseconds for 100 executions
    console.log(
        q.bench(function(){},{method:"timeTo",repeats:100})
    )

Show test log
    console.log(q.testLog())

Erase tests logs and bench to start anew
    q.clearTests()

*/

(function(q){

    //So this is a really small testing framework
    
    var testResults,
        successes = [],
        fails = [],
        warnings = [],
        benches = []

    q.assert = function(cond,msg){
        if(cond === true)
            successes.push("True assert: " + msg)
        else
            fails.push("False assert: " + msg)
    }
    
    q.equal = function(a,b,msg){
        if(a === b){
            successes.push("Equal: " + msg)
        }
        else if(a == b){
            successes.push(msg)
            warnings.push("Not strictly equal: " + msg)
        }
        else{
            fails.push("Not equal: " + msg)
        }
    }
    
    q.clearTest = function(){
        testResults = ""
        successes = []
        fails = []
        warnings = []
        benches = []
    }
    
    q.testLog = function(){
        console.log("q testLog")
        console.log(successes.length+" successes")
        console.log(fails.length+" failures")
        console.log(warnings.length+" warnings")
        q.successLog()
        q.failLog() 
        q.warningLog() 
    }    
    q.successLog = function(){
        console.log("successes:")
        for(var i = 0; i < successes.length; i++){
            console.log(successes[i])
        }
    }
    
    //Not to be confused with failblog...
    q.failLog = function(){
        for(var i = 0; i < fails.length; i++){
            console.log(fails[i])
        }
    }

    //Not to be confused with failblog...
    q.warningLog = function(){
        for(var i = 0; i < warnings.length; i++){
            console.log(warnings[i])
        }
    }

    q.bench = function(callback,settings){
        settings = q.extend(
                       settings,
                       { 
                           method:"timeTo",
                           repeat:100,length:100
                       }
                   )
        
        var err = function(msg){
            console.log("In q.bench, " + msg)
        }
        if(settings.method == "timeTo"){
            if(typeof settings.repeat != 'number'){
                err("Settings.repeat must be a number")
                return
            }
            var initialTime = new Date().getTime()
            for(var i = 0; i<settings.repeat; i++){
                callback()
            }
            return new Date().getTime()-initialTime + "ms"
        }
        else if(settings.method == "perSecond"){
            var initialTime = new Date().getTime()
            var endTime = settings.length
            var stop = false
            var i = 0
            setTimeout(function(){stop=true},settings.length)
            while(!stop && i++)
                callback()
            return i/settings.length*1000+" times per seconds"
        }
        else{
            err("settings.method is set to a bad value")
        }
    }
    
})(shortcutLib);

//This part goes after everything else in Q 

var q = shortcutLib;

