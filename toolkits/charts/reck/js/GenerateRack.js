        
        var tooltipOffsetXPoint=-60 //Customize x offset of tooltip
                    var tooltipOffsetYPoint=40 //Customize y offset of tooltip
                    var ie=document.all
                    var ns6=document.getElementById && !document.all
                    var enableTip=false;
                    var enableDetail=false;
                    var machineDetailFlag=false;
                    var tootipObj, detailObj;                    
                    var loadWaterLevel=5;
                    var svgDoc, svgroot, xr=0, yr=0, xm=0, ym=0, svgns="http://www.w3.org/2000/svg";
                    var color, width, rackStepX=900,rackStepY=250;
                    var rackWidth = 900, rackHeight=250, machineWidth = 530;
                    var xMachineStartPointer=400, yMachineStartPointer=500;
                    var yPointer, machine1UHeight=50, machine2UHeight = 100;
                    var serverID_2U ="2udetail", serverID_1U="1udetail";
                    var svgDoc;
                    var detailMachine
                    var all;
                    var winX
                    var winY
                    var scaleX,scaleY
                    
                    
                    var nodeJson=[]
                    var netJson=[]
                    var nodeLength
                    var netLength
                    
            var rackJson=[]  
            //var rackMap      
        function Rack(json){
            
                    
				$.getJSON(json,function(data){				
					rackJson=data.Rack
					Init();  
			});
        }
                
        
                    document.write('<div id="tooltip">aaa</div>'); //write out tooltip DIV
                    
                    function Init(evt)
                    { 
                        pageWidth = document.body.clientWidth;
                        rackNumber = rackJson.length;
                        svgWidth = rackWidth * rackNumber + 200;
                        scaleRate = svgWidth / pageWidth
                        
                        //svgDoc = evt.target.ownerDocument;
                        svgDoc = document.getElementById("rackMap")
                        svgRoot = svgDoc.rootElement;
                                               
                        rackName=svgDoc.getElementById("rackTemplate");
                        all = svgDoc.getElementById("all");
                        winX=ie&&!window.opera? IETrueBody().clientWidth : window.innerWidth;
                        winY=ie&&!window.opera? IETrueBody().clientHeight : window.innerHeight
                        
                        GenerateRack(rackJson);
                    }
                    
                    function GenerateRack(rackJson) 
                    {
                        rackLength = rackJson.length;
                        rackMap=document.getElementById("rackMap")
                        
                        width=rackLength*rackStepX+100;
                        height=rackLength*rackStepY+3000;
                        
                        scaleX=winX/width
                        scaleY=winY/height
                        
                        ratio = scaleX
                        if ( scaleX > scaleY)
                        {
                                ratio = scaleY
                        }

                        rackMap.setAttribute("width",width+"px");
                        rackMap.setAttribute("height", height+"px");
                        
                        allName = svgDoc.getElementById("all");
                        
                        allTransform="scale("+ratio+")"
                        allName.setAttribute("transform",allTransform)
                       
                        
                        for (i=rackLength-1; i>=0; i--)
                        {
                            translateX = rackStepX * i+100;
                            translateY = rackStepY * (rackLength-i);
                            CloneRack( translateX, translateY, i);
                            
                            machineLength= rackJson[i].Series.length;
                            
                            xPointer = translateX+xMachineStartPointer;
                            yPointer = translateY+yMachineStartPointer;
                           
                            for (j=0; j<machineLength; j++) {
                                machineStep = machine2UHeight;
                                if ( rackJson[i].Series[j].height==1 )
                                {
                                    machineStep = machine1UHeight;
                                 }
                                else 
                                    if (rackJson[i].Series[j].height==2)
                                        machineStep = machine2UHeight;
                                    else
                                        alert("Error");
                             
                                translateMachineX = xPointer;
                                translateMachineY = yPointer;

                                if ( rackJson[i].Series[j].height==1 )
                                    CloneMachine_1U(translateMachineX, translateMachineY,rackJson[i].Series[j]);
                                else 
                                    CloneMachine_2U(translateMachineX, translateMachineY,rackJson[i].Series[j]);
                                yPointer = yPointer + machineStep;

                            }
                        }
                        CloneMachineDetail_1U()
                        CloneMachineDetail_2U()
                    }
                    
                    
                    function  execReg(reg,str){
                        var result =  reg.exec(str);
                        if (result)
                            return result[0]
                        else
                            return null
                    }
                    
                    function Zoom(ratio)
                    {
                        
                        rackMap=document.getElementById("rackMap")
                        
                        width=rackMap.getAttribute("width")
                        height=rackMap.getAttribute("height")
                   
                        width1=parseInt(width)*(1/ratio)
                        height1=parseInt(height)*(1/ratio)
       
                        width= Math.round(parseInt(width)*ratio);
                        height= Math.round(parseInt(height)*ratio);
       
                        winX=ie&&!window.opera? IETrueBody().clientWidth : window.innerWidth;
                        winY=ie&&!window.opera? IETrueBody().clientHeight : window.innerHeight
                        
                        scaleX=winX/width1
                        scaleY=winY/height1
                        
                        all=svgDoc.getElementById("all")
                        transform=all.getAttribute("transform")
    
                        rackMap.setAttribute("width",width+"px");
                        rackMap.setAttribute("height", height+"px");
                        
                        allName = rackMap.getElementById("all");
                        
                        reg=/\d+/
                        scaleHTML=execReg(reg,allTransform)
                        
                        if (scaleHTML=="0") {
                            
                            reg=/\d+.\d+/
                            scaleHTML=execReg(reg,allTransform)
                            if ( !scaleHTML)
                                scaleHTML="1"
                        }
                        if (scaleHTML=="0")
                            scaleHTML="1"
                        scale=parseFloat(scaleHTML)
                        scale=scale*ratio
                        allTransform="scale("+scale+")"
                        allName.setAttribute("transform",allTransform)
                       
                    }
                    function CloneRack(translateX, translateY, i) 
                    {
                        
                        theFirstChild=all.firstChild
                        rackName = document.getElementById("rackTemplate");
                        if (rackName) {
                            newRack = rackName.cloneNode(true);
                            
                            newRack.setAttribute("id","rack_"+i);
                            newRack.setAttribute("visibility", "visible");
                            newRack.setAttribute("display", "inline");
                            translateString = "translate(+" + translateX + ",+" + translateY + ")"
                        
                            newRack.setAttribute("transform",translateString);
                           
                            all.appendChild(newRack);
                        }
                    }
                    
                    function CloneMachine_1U(translateX, translateY, machineJson) 
                    {
                        all = document.getElementById("all");
                        theFirstChild=all.firstChild
                        machineName = document.getElementById("1u-server-rotate");
                        newMachine = machineName.cloneNode(true);
                        newMachine.setAttribute("id",machineJson.machineName)
                        newMachine.setAttribute("visibility", "visible");
                        newMachine.setAttribute("display", "inline");
                        translateString = "translate(" + translateX + ",+" + translateY + ")"

                        newMachine.setAttribute("transform",translateString);
			
			newMachine.setAttribute("racknum",i);
                        newMachine.setAttribute("unum",j);
                        newMachine.getElementsByTagName("rackinfo")[0].setAttribute("machinename",machineJson.machineName);
			newMachine.setAttribute("desc",machineJson.description);
			newMachine.setAttribute("ip",machineJson.ip);
			newMachine.setAttribute("load",machineJson.load);
                        newMachine.setAttribute("dataSource",machineJson.dataSource);
			
			machineLoad=eval(machineJson.load);
			
			if (eval(machineLoad) > eval(loadWaterLevel))
			    TurnLightRed(newMachine)
                        all.appendChild(newMachine);
                    }
                    
                    function CloneMachine_2U(translateX, translateY, machineJson) 
                    {
                        
                        machineName = document.getElementById("2u-server-rotate");
                        newMachine = machineName.cloneNode(true);
                        newMachine.setAttribute("id",machineJson.machineName);

                        newMachine.setAttribute("visibility", "visible");
                        newMachine.setAttribute("display", "inline");
                      
                        translateString = "translate(" + translateX + ",+" + translateY + ")";
                        newMachine.setAttribute("transform",translateString);
                        newMachine.setAttribute("racknum",i);
                        newMachine.setAttribute("unum",j);
                        newMachine.getElementsByTagName("rackinfo")[0].setAttribute("machinename",machineJson.machineName);
			newMachine.setAttribute("desc",machineJson.description);
			newMachine.setAttribute("ip",machineJson.ip);
			newMachine.setAttribute("load",machineJson.load);
                        newMachine.setAttribute("dataSource",machineJson.dataSource);
			
			machineLoad=eval(machineJson.load);
			
			if (eval(machineLoad) > eval(loadWaterLevel))
			    TurnLightRed(newMachine)
                        all.appendChild(newMachine);
                    }
                    
                    function TurnLightRed(newMachine) 
		    {
		    
			machineLight=newMachine.getElementsByTagName("circle");
			
			machineLight[1].setAttribute("fill","red");
			machineLight[2].setAttribute("fill","red");
			machineLight[3].setAttribute("fill","red");
			
		    }
		    
		    function TurnLightGreen(newMachine) 
		    {
		    
			machineLight=newMachine.getElementsByTagName("circle");
			
			machineLight[1].setAttribute("fill","green");
			machineLight[2].setAttribute("fill","green");
			machineLight[3].setAttribute("fill","green");
			
		    }
		    
		    
                    function CloneMachineDetail_1U() 
                    {
                        
                        machineName = document.getElementById("dhtml1udetail");

                        var newMachine = machineName.cloneNode(true);
                        newMachine.setAttribute("id",serverID_1U);

                        rackMap = document.getElementById("rackMap");
                        rackMap.appendChild(newMachine);
        
                        all.appendChild(newMachine);
                    }
 
                    function CloneMachineDetail_2U() 
                    {
		    
                        machineName = document.getElementById("dhtml2udetail");

                        newMachine = machineName.cloneNode(true);
                        newMachine.setAttribute("id",serverID_2U);
			
                        all.appendChild(newMachine);
                    }
                     
                     if (ie||ns6) {
                     
                        tooltipObj=document.all? document.all["tooltip"] : document.getElementById? document.getElementById("tooltip") : ""
                    }
                    
            
                    function IETrueBody(){
                            return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
                    }

                    function ShowTooltip(thetext, thecolor, thewidth){
                        fontWidth=30;
                        fontSize=40;

                        if (ns6||ie){
                            tooltipWidth=fontWidth * thewidth
                         
                            tooltipObj.style.fontsize=fontSize+"px";
                            tooltipObj.style.width=tooltipWidth+"px" 
                         
                            if (typeof thecolor!="undefined" && thecolor!="") 
                                tooltipObj.style.backgroundColor=thecolor;
                
                            tooltipObj.innerHTML=thetext;
                            tooltipObj.style.visibility="visible"
                            enableTip=true;
                            return false;
                        }
			
                    }
          
                    function ShowDetail(machineType, machineName, thewidth)
                    {
                        svgWidth=document.getElementById("rackMap").clientWidth
                    
                        detailObj=document.getElementById("rackMap").getElementById(machineType);

			detailMachine=document.getElementById(machineName);
			
                        if (ns6||ie){
                            if (typeof thecolor!="undefined" && thecolor!="") 
                                   detailObj.style.backgroundColor=thecolor;
                                
                            enableDetail=true;
                            return false
                        }
                    }
                    
                    function HideDetail(machineType) 			
		    {
                        if (enableDetail) {
                    
                            detailobj=document.getElementById("rackMap").getElementById(machineType)
			    
				detailobj.setAttribute("visibility","hidden");
				
				machineStatus=detailObj.getElementsByTagName('text')
			    
				machineStatus[0].firstChild.data="MachineName: "
				machineStatus[1].firstChild.data="Desc:"
				machineStatus[2].firstChild.data="IP: "
				machineStatus[3].firstChild.data="Load: "
				machineStatus=detailObj.getElementsByTagName('a')
			    
				machineLoad=eval(detailMachine.getAttribute('load'));
			
				if (eval(machineLoad) > eval(loadWaterLevel)){
				
				    TurnLightGreen(detailObj)
				}
			    
                            enableDetail = false;
                        }

                    }

                    function PositionTip(e){
                    
                        if (enableTip){
                            
                            var curX=(ns6)?e.pageX : event.clientX+IETruebody().scrollLeft;
                            var curY=(ns6)?e.pageY : event.clientY+IETruebody().scrollTop

                            //Find out how close the mouse is to the corner of the window
                            var rightEdge=ie&&!window.opera? IETrueBody().clientWidth-event.clientX-tooltipOffsetXPoint : window.innerWidth-e.clientX-tooltipOffsetXPoint-40
                            var bottomEdge=ie&&!window.opera? IETrueBody().clientHeight-event.clientY-tooltipOffsetYPoint : window.innerHeight-e.clientY-tooltipOffsetYPoint-40

                            var leftEdge=(tooltipOffsetXPoint<0)? tooltipOffsetXPoint*(-1) : -1000

                            //if the horizontal distance isn't enough to accomodate the width of the context menu
                            
                            if (rightEdge<tooltipObj.offsetWidth)
                            //move the horizontal position of the menu to the left by it's width
                                tooltipObj.style.left=ie? IETruebody().scrollLeft+event.clientX-tooltipObj.offsetWidth+"px" : window.pageXOffset+e.clientX-tooltipObj.offsetWidth+"px"
                            else if (curX<leftEdge)
                                tooltipObj.style.left="5px"
                                else
                                //position the horizontal position of the menu where the mouse is positioned
                                    tooltipObj.style.left=curX+tooltipOffsetXPoint+"px"

                            //same concept with the vertical position
                            if (bottomEdge<tooltipObj.offsetHeight)
                                tooltipObj.style.top=ie? IETruebody().scrollTop+event.clientY-tooltipObj.offsetHeight-offsetypoint+"px" : window.pageYOffset+e.clientY-tooltipObj.offsetHeight-tooltipOffsetYPoint+"px"
                            else
                                tooltipObj.style.top=curY+tooltipOffsetYPoint+"px"
                            
                            tooltipObj.style.visibility="visible";
                        }
                    }

                    function PositionDetail(e){
                    
                        var detailWidth=1400
			var detailHeight=1400
                        var detailOffsetXPoint=40 //Customize x offset of tooltip
                        var detailOffsetYPoint=40 //Customize y offset of tooltip
                    
                        scaleX=3500/IETrueBody().clientWidth
                        scaleY=3900/IETrueBody().clientHeight
                        var detailWidth=Math.ceil(1400/scaleX)
                        var detailHeight=Math.ceil(1400/scaleY)
                    
                        if (enableDetail && detailObj.getAttribute("visibility")=="hidden"){
                            var curX=(ns6)?e.pageX : event.clientX+IETrueBody().scrollLeft;
                            var curY=(ns6)?e.pageY : event.cli=ntY+IETrueBody().scrollTop;
                         
                            rightEdge=IETrueBody().clientWidth-curX-detailOffsetXPoint-detailWidth
			    bottomEdge=IETrueBody().clientHeight-curY-detailOffsetYPoint-detailHeight
			    leftEdge=curX-detailOffsetXPoint-detailWidth
			    if (rightEdge>0 ) {
				detailX=curX+detailOffsetXPoint
			    } else 
				if (leftEdge>=0) {
					detailX=curX-detailOffsetXPoint
				} else 
					if (leftEdge<0) {
						detailX=detailOffsetXPoint
					}
		
			    topEdge=curY+detailOffsetYPoint
			    bottomEdge=IETrueBody().clientHeight-curY-detailOffsetYPoint-detailHeight
			    
			    if (bottomEdge>0) 
				detailY=curY+detailOffsetYPoint
			    else 
				if (topEdge>0)
				    detailY=topEdge
				else
				    detailY=detailOffsetYpoint
                            detailX=Math.ceil(scaleX*detailX)
                            detailY=Math.ceil(scaleY*detailY)

                            transformString="translate("+ detailX +","+ detailY +")";
                            detailObj.setAttribute("visibility","visible");

                            detailObj.setAttribute("transform",transformString);
                            machineStatus=detailObj.getElementsByTagName('text');
                            

			    machineStatus[0].firstChild.data=machineStatus[0].firstChild.data + detailMachine.getAttribute('id');
                    
			    machineStatus[1].firstChild.data=machineStatus[1].firstChild.data + detailMachine.getAttribute('desc');
			    machineStatus[2].firstChild.data=machineStatus[2].firstChild.data + detailMachine.getAttribute('ip');
			    machineStatus[3].firstChild.data=machineStatus[3].firstChild.data + detailMachine.getAttribute('load');
			    machineStatus=detailObj.getElementsByTagName('a')
			    machineStatus[0].setAttribute('xlink:href',detailMachine.getAttribute('dataSource'));
			    
			    machineLoad=eval(detailMachine.getAttribute('load'));
			
			    if (eval(machineLoad) > eval(loadWaterLevel)){
				TurnLightRed(detailObj)
			    }
                        }
                    }

                    function HideTooltip(){
                        if (ns6||ie){
                            enableTip=false
                            tooltipObj.style.visibility="hidden"
                            tooltipObj.style.left="-1000px"
                            tooltipObj.style.backgroundColor=''
                            tooltipObj.style.width=''
                        }
                    }
                    

                    document.onmousemove=PositionTip;
                    document.onclick=PositionDetail;