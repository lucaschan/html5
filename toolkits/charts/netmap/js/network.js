        var ie=document.all
        var ns6=document.getElementById && !document.all
        var nodeCount = []; 
        
        var nodeSort = [];
        
        var nodePosition = [];
        
        var connection =[];
        
        var radius=5;

        var divClass="node";
		var shapes=[];
        var conValue = [];
        var WinX, winY;
        var r;
        var connections=[];
		
		/*var netJson,nodeJson,nodeLength,netLength;
		
		$(function(){						
				$.getJSON("net.json",function(data){				
					nodeJson = data.nodeJson1;
					netJson = data.netJson1;
					nodeLength = nodeJson.length;
					netLength = netJson.length;				
					generateRack();  
			});
		});*/
    	var netJson,nodeJson,nodeLength,netLength;
		
		//$(function(){						
		function generateNet(json){
				$.getJSON(json,function(data){				
					nodeJson = data.nodeJson;
					netJson = data.netJson;
					nodeLength = nodeJson.length;
					netLength = netJson.length;				
					rack();  
			});
		//});
		}

        //Analysis node and connections
        function Analysis(nodeJson, netJson) {
        
            for (i = 0; i < nodeLength; i++)  {
                nodeCount[nodeJson[i]]=i;
                var temp1={};
                var temp2={};

                temp1[nodeJson[i]] = [0,0];
                temp2[nodeJson[i]] = 0;

                nodePosition[i]=temp1;
                nodeSort[i]=temp2;
            }
        
            for (i = 0; i < netLength; i++)
            {
                conValue[i]=netJson[i][2];
                for (j=0; j<nodeLength; j++) {
                    
                        if ( nodeJson[j] == netJson[i][0] ) {
                            nodeSort[j][nodeJson[j]]++;
                        }
                        if ( nodeJson[j] == netJson[i][1] ) {
                            nodeSort[j][nodeJson[j]]++;
                        }
                }
            }
        }
        
        function SortNodes(node) {
            
            sequence=[];
            /**********************
            sequence[0]=0;
            
            var j=0;
            for(var i=1; i<nodeLength; i++) {
                j = i-1;
                if((nodeSort[i][node[i]]) > (nodeSort[sequence[j]][node[sequence[j]]])) {
                    do {
                        sequence[j+1] = sequence[j];
                        j--;
                    } while (j>=0 &&  nodeSort[i][node[i]]>nodeSort[sequence[j]][node[sequence[j]]] );
                    
                } 
                sequence[j+1]=i;
            }
            *********/
            for (var i=0; i<nodeLength; i++) {
            
                sequence[i]=i;    
            }
            return sequence;
        }
        
        function CreateDiv(i,divName,nodeCenter){
            var objDiv = document.createElement("DIV");
            //objDiv.id = divName;
            objDiv.id = "node"+i;
            objDiv.class = divClass;
            document.body.appendChild(objDiv);
            objDiv.innerHTML=divName;
            objDiv.style.fontSize="10px";
            objDiv.style.fontFamily="Arial";
            objDiv.style.fontWeight=""
        }
        
        function GetNodePosition(i) {
            var a=1;
            var b=10;
            angle = 0.5*i+5;
            x = Math.round(winCX + (a + b * angle) * Math.cos(angle));
            y = Math.round(winCY + (a + b * angle) * Math.sin(angle));
            return([x,y])
        }
        
        function GetWindowsCenter(){
        
                winX=ie&&!window.opera? IETrueBody().clientWidth : window.innerWidth;
                winY=ie&&!window.opera? IETrueBody().clientHeight : window.innerHeight;
                
                winCX=Math.ceil(winX/2);
                winCY=Math.ceil(winY/2);
                return[winCX, winCY]
        }

        function getStartEnd(obj1, obj2) {
            bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox();
                
            lineSpace=0
            var p = [
                    { x: bb1.x + bb1.width / 2, y: bb1.y - lineSpace },
                    
                    { x: bb1.x + bb1.width * 0.14-lineSpace, y: bb1.y + bb1.height * 0.14-lineSpace },
                    
                    { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + lineSpace  },
                 
                    { x: bb1.x + bb1.width * 0.86+lineSpace, y: bb1.y + bb1.height * 0.86+lineSpace },
                    
                    { x: bb1.x - lineSpace, y: bb1.y + bb1.height / 2 },
                 
                    { x: bb1.x + bb1.width *0.14-lineSpace , y: bb1.y + bb1.height * 0.86+lineSpace },
                                                            
                    { x: bb1.x + bb1.width + lineSpace, y: bb1.y + bb1.height / 2 },
                    
                    { x: bb1.x + bb1.width * 0.86+lineSpace, y: bb1.y + bb1.height * 0.14-lineSpace },
                    
                    { x: bb2.x + bb2.width / 2, y: bb2.y - lineSpace },
                  
                    { x: bb2.x +bb2.width * 0.14-lineSpace , y: bb2.y + bb2.height * 0.14-lineSpace },
                    
                    { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + lineSpace },
                    
                    { x: bb2.x +bb2.width * 0.86+lineSpace , y: bb2.y + bb2.height * 0.86+lineSpace },
                    
                    { x: bb2.x - lineSpace, y: bb2.y + bb2.height / 2 },
                    
                    { x: bb2.x + bb2.width * 0.14 - lineSpace , y: bb2.y + bb2.height *  0.86 + lineSpace },
                    
                    { x: bb2.x + bb2.width + lineSpace, y: bb2.y + bb2.height / 2 },
                  
                    { x: bb2.x + bb2.width * 0.86+lineSpace , y: bb2.y + bb2.height * 0.14-lineSpace },
                ];

            var d = {}, dis = [];

            for (var i = 0; i < 8; i++) {
                for (var j = 8; j < 16; j++) {
                    var dx = Math.abs(p[i].x - p[j].x)-10,
                        dy = Math.abs(p[i].y - p[j].y)-10;

                    if (
                         (i == j - 8) ||
                         (((i != 6 && j != 12) || p[i].x < p[j].x) &&
                         
                         ((i != 1 && j != 11) || ( (p[i].x > p[j].x) &&(p[i].y > p[j].y ) ) )&&
                         
                         ((i != 4 && j != 14) || p[i].x > p[j].x) &&
                         
                         ((i != 3 && j != 9) || ( (p[i].x < p[j].x) &&(p[i].y < p[j].y ) ) )&&
                         
                         ((i != 0 && j != 10) || p[i].y > p[j].y) &&
                         
                         ((i != 7 && j != 13) || ( (p[i].x < p[j].x) &&(p[i].y > p[j].y ) ) )&&
                         
                         ((i != 2 && j != 8) || p[i].y < p[j].y) &&
                         
                         ((i != 5 && j != 15) || ( (p[i].x > p[j].x) &&(p[i].y < p[j].y ) ) )
                         ))
                        {
                        dis.push(dx + dy);
                    
                        d[dis[dis.length - 1]] = [i, j];
                        
                    }
                }
                
            }


            if (dis.length == 0) {
                var res = [0, 8];
            } else {
                res = d[Math.min.apply(Math, dis)];
            }
            var result = {};
            result.start = {};
            result.end = {};
            result.start.x = p[res[0]].x;
            result.start.y = p[res[0]].y;
            result.end.x = p[res[1]].x;
            result.end.y = p[res[1]].y;

            return result;
        }


        function getArr(x1, y1, x2, y2, size) {
        
            var angle = Raphael.angle(x1, y1, x2, y2);
            var a45 = Raphael.rad(angle - 45);
            var a45m = Raphael.rad(angle + 45);
            var x2a = x2 + Math.cos(a45) * size;
            var y2a = y2 + Math.sin(a45) * size;
            var x2b = x2 + Math.cos(a45m) * size;
            var y2b = y2 + Math.sin(a45m) * size;
            //var result = ["M", x1, y1, "L", x2, y2, "L", x2a, y2a, "M", x2, y2, "L", x2b, y2b];
            var result = ["M", x1, y1, "L", x2, y2];
            
            return result;
        }
        
        
        Raphael.fn.drawArr = function (obj) {
            var point = getStartEnd(obj.obj1, obj.obj2);
            
            var lineWidth = obj.value;
            var path1 = getArr(point.start.x, point.start.y, point.end.x, point.end.y, 10);
            if (obj.arrPath) {
                obj.arrPath.attr({ path: path1});
                obj.arrPath.attr({"stroke-width":lineWidth});
                obj.arrPath.attr({"stroke":"#9189A3"});
                obj.arrPath.attr({"value":lineWidth});
            } else {
                obj.arrPath = this.path(path1);
                obj.arrPath.attr({"stroke-width":lineWidth});
                obj.arrPath.attr({"stroke":"#9189A3"});
                obj.arrPath.attr({"value":lineWidth});
            }
            
            return obj;
        };
       // $(function () {
	   function rack(){
        
            Analysis(nodeJson, netJson) ;

            // Sort the nodes by the connections
            // ²åÈë·¨ÅÅÐò        
            var sequence=[]        
        
            sequence=SortNodes(nodeJson);
            
            var winCX, winCY, winX, winY;
            
            nodeCenter=GetWindowsCenter();
            winX=ie&&!window.opera? IETrueBody().clientWidth : window.innerWidth;
            winY=ie&&!window.opera? IETrueBody().clientHeight : window.innerHeight;
            
            var r = ScaleRaphael("holder", winX, winY);
            
            var scaleNet =1;
            var divFontSize=10;
            for(var i=0; i<nodeLength; i++) {

                nodePosition[sequence[i]][nodeJson[sequence[i]]]=nodeCenter;
                nodeCenter=GetNodePosition(i)
            //radius=
//                shapes[sequence[i]]=r.circle(nodeCenter[0], nodeCenter[1], radius);
                shapes[sequence[i]]=r.circle(nodeCenter[0], nodeCenter[1],nodeSort[i][nodeJson[i]]+6);
                //CreateDiv(nodeJson[sequence[i]],nodeCenter)
                CreateDiv(i,nodeJson[sequence[i]],nodeCenter)
               
                $("#node"+sequence[i]).offset({ top: nodeCenter[1]-14 , left: nodeCenter[0]-6 });
            }
            for (var i=0; i<netLength; i++) {
                connections.push(r.drawArr({ obj1: shapes[nodeCount[netJson[i][0]]], obj2: shapes[nodeCount[netJson[i][1]]],value:conValue[i] }));
            }
            var dragger = function () {
                this.ox = this.attr("cx");
                this.oy = this.attr("cy");
                this.or = this.attr("r")
                this.animate({ "fill-opacity": .8 }, 500);
            };
            
            var up = function () {
                this.animate({ "fill-opacity": .5 }, 500);
            };

            var move = function (dx, dy) {
                var att = { cx: this.ox + dx, cy: this.oy + dy , r:this.or};

                this.attr(att);
                var yy=this.oy+dy ,xx=this.ox + dx;
                $("#node"+this.id).offset({ top: (this.oy+dy)*scaleNet-10 , left: (this.ox+dx)*scaleNet-10});
                
                for (var i = connections.length; i--; ) {
                            r.drawArr(connections[i]);
                }
            };
            
            function Highlight(evt) 
            { 
                    evt.target.setAttribute("opacity", 0.5); 
                    evt.target.setAttribute("strokewidth",0)
                    evt.target.setAttribute("strokeopacity",0);
                    //shapes[i].attr({ fill: color,  stroke: color, strokewidth:0,"fill-opacity": 1});
                    var objDiv = document.getElementById("node"+this.id)
                    objDiv.style.fontWeight="bold"
            } 
            function Unhighlight(evt) 
            { 
                evt.target.setAttribute("opacity", "1"); 
                var objDiv = document.getElementById("node"+this.id)
                objDiv.style.fontWeight=""
            } 
            
            function ZoomIn() {
            
                scaleNet = scaleNet *1.25;

                r.scaleAll(scaleNet)
                
                for(var i=0; i<nodeLength; i++) {
                    xx = shapes[i].attr("cx");
                    yy = shapes[i].attr("cy");
                    rr = shapes[i].attr("r");
                
                //if (scaleNet==1)
                //    $("#node"+i).offset({ top: (yy)*scaleNet  -10, left: (xx)*scaleNet - 10});
                //else
                    $("#node"+i).offset({ top: (yy)*scaleNet  - (rr)*scaleNet-10, left: (xx)*scaleNet - (rr)*scaleNet-10});
                }
            }

            function ZoomOut() {
            
                scaleNet = scaleNet *(0.8);
            
                if (scaleNet<=1) 
                    location.reload(true)
                else {
                    r.scaleAll(scaleNet)

                    for(var i=0; i<nodeLength; i++) {
                        xx = shapes[i].attr("cx");
                        yy = shapes[i].attr("cy");
                        rr = shapes[i].attr("r");
                        $("#node"+i).offset({ top: (yy)*scaleNet  - (rr)*scaleNet-10, left: (xx)*scaleNet - (rr)*scaleNet-10});
                    }
                }
            }
            zoomInCircle=r.circle(50,50,15);
            zoomInCircle.attr({ fill: "r(0.5, 0.5)#f55:70-#fff:20", stroke: "red", "fill-opacity": 0.2, "stroke-width": 5});
            zoomInPath=r.path("M 50 40 L 50 60 M 40 50 L 60 50")
            zoomInPath.attr({fill:"none" , stroke:"black", "stroke-width":3})
            zoomInCircle.click(ZoomIn)

            zoomOutCircle=r.circle(100,50,15);
            zoomOutCircle.attr({ fill: "r(0.5, 0.5)#008870:70-#fff:20", stroke: "green", "fill-opacity": 0.2, "stroke-width": 5,cursor: "ZoomOut"});
            zoomOutPath=r.path("M 90 50 L 110 50")
            zoomOutPath.attr({fill:"none" , stroke:"black", "stroke-width":3})
            zoomOutCircle.click(ZoomOut)

            for (var i = 0, ii = shapes.length; i < ii; i++) {
            
                        var color = Raphael.getColor();
                        //shapes[i].attr({ fill: color, stroke: color, "fill-opacity": 0.5, cursor: "move"});
                        shapes[i].attr({ fill: color,  stroke: color, strokeopacity:0.4, "stroke-width":0, "fill-opacity": 0.8});
                    
                        
                        shapes[i].bigFlag=false;
                        shapes[i].drag(move, dragger, up);
                        shapes[i].hover(Highlight, Unhighlight);
                    
            }
		}
		 