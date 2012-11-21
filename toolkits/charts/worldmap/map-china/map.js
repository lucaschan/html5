 var colour;
	 var id = new Array();
	 var value = new Array();
	 var toolTip = new Array();
	 var Hlink = new Array();
	 var dataColour = new Array();
	 dataColour[0] = new Array();
	 dataColour[1] = new Array();
	 dataColour[2] = new Array();
	 dataColour[3] = new Array();
	 dataColour[4] = new Array(); 
	 var large;
	 var small;
	 
	 var colorStyleSheets = $('[id^=color_style_]');
	 $(function() {
			url = 'china.json';
			$.getJSON(url, function(data) {
                        colour = data[0].colour[0].colour;
                        //colour = 'yellow';//change this value to use dummy data
                        colorStyleSheets.attr('disabled',true);
                        $('#color_style_'+colour).attr('disabled',false);
						
                        for(var i=0;i < data[0].id.length;i++){			
                             id[i] = data[0].id[i].id;
                             value[i] = data[0].id[i].value;
                             toolTip[i] = data[0].id[i].tooltip;
                             Hlink[i] = data[0].id[i].Hlink;
                         }
			for(var i=0; i< id.length; i++){
				getColourValue(id[i]);
			}
			 colourCountries(dataColour);
			});
		});


        function  getToolTip(currentId)
        {
            for(var i=0; i < id.length; i++){
                if (id[i] == currentId){
                    return toolTip[i];
                }
            }
        }
        
        function  getHlink(currentId)
        {
            for(var i=0; i < id.length; i++){
                if (id[i] == currentId){
                    return Hlink[i];
                }
            }
        }
		
		function  getColourValue(currentId)
        {	
            for(var i=0; i < id.length; i++){
                if (id[i] == currentId){
					large = largest(value);
					//$('#legend5').get(0).textContent = large;
					small = smallest(value);
					var equaValue = (largest(value) - smallest(value));
					var classValue = getColour(id[i],value[i],equaValue,large,small);
                    return classValue;
                }
            }
        }
        
        //get colour's value
		
		function smallest(array)
		{
			return Math.min.apply( Math, array );
		}
		function largest(array)
		{
			return Math.max.apply( Math, array );
		}
		
		function getColour(id,value,equaValue,large,small)
		{	
			value = parseInt(value);
			equaValue = parseInt(equaValue);
			large = parseInt(large);
			small = parseInt(small);
			var equaValue1 = equaValue/5;
			var equaValue2 = equaValue/5*2;
			var equaValue3 = equaValue/5*3;
			var equaValue4 = equaValue/5*4;
			equaValue1 = parseInt(equaValue1);
			equaValue2 = parseInt(equaValue2);
			equaValue3 = parseInt(equaValue3);
			equaValue4 = parseInt(equaValue4);
			var str0 = small;
			str0 += " to ";
			str0 += equaValue1;
			$('#legend0').get(0).textContent = str0;
			var str1 = equaValue1;
			str1 += " to ";
			str1 += equaValue2;
			$('#legend1').get(0).textContent = str1;
			var str2 = equaValue2;
			str2 += " to ";
			str2 += equaValue3;
			$('#legend2').get(0).textContent = str2;
			var str3 = equaValue3;
			str3 += " to ";
			str3 += equaValue4;
			$('#legend3').get(0).textContent = str3;
			var str4 = equaValue4;
			str4 += " to ";
			str4 += large;
			$('#legend4').get(0).textContent = str4;
			//$('#legend5').get(0).textContent = str5;
		
			if (small<=value && value<equaValue1){
				
				dataColour[0].push(id);
				return dataColour[0];
			}else if (equaValue1<=value && value<equaValue2){
				dataColour[1].push(id);
				return dataColour[1];
			}else if (equaValue2<=value && value<equaValue3){
				dataColour[2].push(id);
				return dataColour[2];
			}else if (equaValue3<=value && value<equaValue4){
				dataColour[3].push(id);
				return dataColour[3];
			}else if (equaValue4<=value && value<=large){
				dataColour[4].push(id);
				return dataColour[4];
			}
		
		}    
        
	function init(evt)
	{
	    if ( window.svgDocument == null )
	    {
		svgDocument = evt.target.ownerDocument;
	    }
		addToolTip_bg();
		
		addToolTip();
		addTextTip();
		
		
		
	    
	    tooltip_bg = svgDocument.getElementById('tooltip_bg');
		
		tooltip = svgDocument.getElementById('tooltip');
		setMouse(svgDocument);
		createHlink(svgDocument);
		
	}

	function ShowTooltip(evt, mouseovertext)
	{
	    tooltip.setAttributeNS(null,"x",evt.clientX+11);
	    tooltip.setAttributeNS(null,"y",evt.clientY+27);
	    tooltip.firstChild.data = mouseovertext;
	    tooltip.setAttributeNS(null,"visibility","visible");

	    length = tooltip.getComputedTextLength();
	    tooltip_bg.setAttributeNS(null,"width",length+8);
	    tooltip_bg.setAttributeNS(null,"x",evt.clientX+8);
	    tooltip_bg.setAttributeNS(null,"y",evt.clientY+14);
	    tooltip_bg.setAttributeNS(null,"visibility","visibile");
		
		Highlight(evt);
	}

	function HideTooltip(evt)
	{
	    tooltip.setAttributeNS(null,"visibility","hidden");
	    tooltip_bg.setAttributeNS(null,"visibility","hidden");
		Unhighlight(evt);
	}
	
	function colourCountries(data) {
    	for (var colour=0; colour<data.length; colour++) {    
        	for (var country=0; country<data[colour].length; country++) {
            	colourCountry(data[colour][country], colour);
        	}
    	}
	}
	
	function colourCountry(name, colour) {
		var country = svgDocument.getElementById(name);
		var oldClass = country.getAttributeNS(null, 'class');
		var newClass = oldClass + ' colour' + colour;
		country.setAttributeNS(null, 'class', newClass);
	}
	
	
	//Add mouse
	function setMouse(svgDocument)
	{
		var list = document.getElementsByTagName("path");
		var tempId;
		for(var i = 0; i < list.length; i++){
			if(list[i].id!=null && typeof(list[i].id)!='undefined'&&list[i].id!=''&&list[i].id!=' ')
			{
				tempId = svgDocument.getElementById(list[i].id);
				tempId.setAttribute("onmousemove","ShowTooltip(evt, getToolTip(this.getAttribute('id')))");
				tempId.setAttribute("onmouseout","HideTooltip(evt)");
			}
		}		

	}
	
	
	function setAttri(svgDocument)
	{
		newSet=svgDocument.getElementById("ly");
		
		newSet.setAttributeNS(null,"onmousemove","Highlight(evt)");
                        
		newSet.setAttributeNS(null,"onmouseout","Unhighlight(evt)");	
	}
	
	function Highlight(evt) 
	{ 
		evt.target.setAttribute("opacity", "0.5"); 
	} 
	function Unhighlight(evt) 
	{ 
		evt.target.setAttribute("opacity", "1"); 
	}
	var svgNS = "http://www.w3.org/2000/svg";
	
	function createHlink(svgDoc) {
	 //create node
      	
			  var list=document.getElementsByTagName("path");
			 
			  for(var i=0;i<list.length && list[i];i++){
			   
			  if(list[i].id!=null && typeof(list[i].id)!='undefined'&&list[i].id!=''&&list[i].id!=' '){
                                       
						
					  var newRect = document.createElementNS(svgNS,"a");
					  newRect.setAttributeNS(null,"onclick","location.href = getHlink(this.getElementsByTagName('path')[0].getAttribute('id'));");	
					  newRect.setAttributeNS(null,"target","_black");	
					  newRect.setAttributeNS(null,"id",i);	
					  document.getElementById(list[i].id).parentNode.insertBefore(newRect,svgDoc.getElementById(list[i].id));
					  //clone nodes
					  oldnode = svgDoc.getElementById(list[i].id);
					  newnode = oldnode.cloneNode(true);
					  rootId = svgDoc.getElementById(i);
					  rootId.appendChild(newnode);
					  father = document.getElementById(oldnode.parentNode.id);
					  father.removeChild(oldnode);
				  }
			  }
		
    }
	
	function addToolTip_bg(){
		
		var svg = document.getElementsByTagName("svg");
		var newRect = document.createElementNS(svgNS,"rect");
		newRect.setAttributeNS(null,"class","tooltip_bg");
		newRect.setAttributeNS(null,"id","tooltip_bg");
		newRect.setAttributeNS(null,"x","0");
		newRect.setAttributeNS(null,"y","0");
		newRect.setAttributeNS(null,"rx","4");
		newRect.setAttributeNS(null,"ry","4");
		newRect.setAttributeNS(null,"width","55");
		newRect.setAttributeNS(null,"height","17");
		newRect.setAttributeNS(null,"visibility","hidden");
		var newnode = newRect.cloneNode(true);
		svg[0].appendChild(newnode);
		}

	function addToolTip(){
		
		var svg = document.getElementsByTagName("svg");
		var newRect = document.createElementNS(svgNS,"text");
		
		newRect.setAttributeNS(null,"class","tooltip");
		newRect.setAttributeNS(null,"id","tooltip");
		newRect.setAttributeNS(null,"x","0");
		newRect.setAttributeNS(null,"y","0");
		newRect.setAttributeNS(null,"visibility","hidden");
		//newRect.setAttributeNS(null,"value","Tooltip");
		
		var newnode = newRect.cloneNode(true);
		svg[0].appendChild(newnode);
		$('#tooltip').get(0).textContent = "Tooltip";
		}
		
		
		
	function addTextTip(){
		
		var svg = document.getElementsByTagName("svg");
		var newg = document.createElementNS(svgNS,"g");
		newg.setAttributeNS(null,"id","key");
		newg.setAttributeNS(null,"class","label");
		var newnode = newg.cloneNode(true);
		svg[0].appendChild(newnode);
		
		var g = document.getElementsByTagName("svg")[0].lastChild;
		var newRect0 =  document.createElementNS(svgNS,"rect");
		newRect0.setAttributeNS(null,"x","850");
		newRect0.setAttributeNS(null,"y","450");
		newRect0.setAttributeNS(null,"width","20");
		newRect0.setAttributeNS(null,"height","20");
		newRect0.setAttributeNS(null,"class","key colour0");
		var newnode0 = newRect0.cloneNode(true);
		g.appendChild(newnode0);
		
		var newRect1 =  document.createElementNS(svgNS,"rect");
		newRect1.setAttributeNS(null,"x","850");
		newRect1.setAttributeNS(null,"y","475");
		newRect1.setAttributeNS(null,"width","20");
		newRect1.setAttributeNS(null,"height","20");
		newRect1.setAttributeNS(null,"class","key colour1");
		var newnode1 = newRect1.cloneNode(true);
		g.appendChild(newnode1);
		
		var newRect2 =  document.createElementNS(svgNS,"rect");
		newRect2.setAttributeNS(null,"x","850");
		newRect2.setAttributeNS(null,"y","500");
		newRect2.setAttributeNS(null,"width","20");
		newRect2.setAttributeNS(null,"height","20");
		newRect2.setAttributeNS(null,"class","key colour2");
		var newnode2 = newRect2.cloneNode(true);
		g.appendChild(newnode2);
		
		var newRect3 =  document.createElementNS(svgNS,"rect");
		newRect3.setAttributeNS(null,"x","850");
		newRect3.setAttributeNS(null,"y","525");
		newRect3.setAttributeNS(null,"width","20");
		newRect3.setAttributeNS(null,"height","20");
		newRect3.setAttributeNS(null,"class","key colour3");
		var newnode3 = newRect3.cloneNode(true);
		g.appendChild(newnode3);
		
		var newRect4 =  document.createElementNS(svgNS,"rect");
		newRect4.setAttributeNS(null,"x","850");
		newRect4.setAttributeNS(null,"y","550");
		newRect4.setAttributeNS(null,"width","20");
		newRect4.setAttributeNS(null,"height","20");
		newRect4.setAttributeNS(null,"class","key colour4");
		var newnode4 = newRect4.cloneNode(true);
		g.appendChild(newnode4);
		
		//Edit Text
		var text0 =  document.createElementNS(svgNS,"text");
		text0.setAttributeNS(null,"id","legend0");
		text0.setAttributeNS(null,"x","880");
		text0.setAttributeNS(null,"y","465");
		var newtext0 = text0.cloneNode(true);
		g.appendChild(newtext0);
		
		var text1 =  document.createElementNS(svgNS,"text");
		text1.setAttributeNS(null,"id","legend1");
		text1.setAttributeNS(null,"x","880");
		text1.setAttributeNS(null,"y","490");
		var newtext1 = text1.cloneNode(true);
		g.appendChild(newtext1);
		
		var text2 =  document.createElementNS(svgNS,"text");
		text2.setAttributeNS(null,"id","legend2");
		text2.setAttributeNS(null,"x","880");
		text2.setAttributeNS(null,"y","515");
		var newtext2 = text2.cloneNode(true);
		g.appendChild(newtext2);
		
		var text3 =  document.createElementNS(svgNS,"text");
		text3.setAttributeNS(null,"id","legend3");
		text3.setAttributeNS(null,"x","880");
		text3.setAttributeNS(null,"y","540");
		var newtext3 = text3.cloneNode(true);
		g.appendChild(newtext3);
		
		var text4 =  document.createElementNS(svgNS,"text");
		text4.setAttributeNS(null,"id","legend4");
		text4.setAttributeNS(null,"x","880");
		text4.setAttributeNS(null,"y","565");
		var newtext4 = text4.cloneNode(true);
		g.appendChild(newtext4);
		
		}
