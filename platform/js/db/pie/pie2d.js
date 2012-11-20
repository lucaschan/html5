function loadXMLDoc(userName,userPwd,DB,table,server,port,pieName,pieValue)
{
	var a;
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
	}
	else
	  {// code for IE6, IE5
	    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
	        a = xmlhttp.responseText;

		//alert(a);
		//document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
		}
	  }
	  
	  var url = "js/db/pie/pie2d.jsp?&userName="+userName+"&userPwd="+userPwd+"&DB="+DB+"&table="+table+"&server="+server+"&port="+port+"&pieName="+pieName+"&pieValue="+pieValue;
	  //var url = "pie2d.jsp?&userName="+userName+"&userPwd="+userPwd+"&DB="+DB+"&table="+table+"&server="+server+"&port="+port+"&pieName="+pieName+"&pieValue="+pieValue;
	//xmlhttp.open("GET","http://127.0.0.1:8080/pie/final/pie2d.jsp",false);
	alert(url);
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
	alert(a);
	//a = eval(a);
	//a = eval("(" + a + ")");
	//alert(a[2].name);
    //alert("exit");
	return a;
	}
function browser()
		{
			 var Sys = {};
			 var ua = navigator.userAgent.toLowerCase();		 
			 var s;
			 (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
			 (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
			 (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
			 (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
			 (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
			 
			 if (Sys.ie) return 'IE ' + Sys.ie;
			 if (Sys.firefox) return 'Firefox ' + Sys.firefox;
			 if (Sys.chrome) return 'Chrome ' + Sys.chrome;
			 if (Sys.opera) return 'Opera ' + Sys.opera;
			 if (Sys.safari) return 'Safari ' + Sys.safari;
		}
function generatePie2d(chart){
	var def_color = new Array();
	def_color = ['#00008b','#8b8b00','#adadad','#ffd700','#00ff00','#cd00cd','#00f5ff','#008b00','#ee0000','#0000cd','#ffbbff','#8b008b','#eeee00','#a52a2a','#000000'];
	var check_browser = browser();
	
	if(chart.type == "pie2d"){
		if(check_browser =="IE 8.0"){	
			//$(document.body).append('<div style = "width:"'+chart.width+'px;height:'+chart.height+'px>'+'<div style = "font-size:25px;text-align:center;margin-top:20px">'+chart.title+'</div>'+'<div id="chart1" style="width: 800px; height: 400px"></div></div>')
			$(document.body).append('<div style = "width:800px;height:400px">'+'<div style = "font-size:25px;text-align:center;margin-top:20px">'+chart.title+'</div>'+'<div id="chart1" style="width: 800px; height: 400px"></div></div>');
			var i;
			var values_serie1 = new Array();
			var legend = new Array();
			var tooltips_serie1 = new Array();
			var color = new Array();
			var length = chart.data.length;
			for(i = length-1;i>=0;i--){
				values_serie1.push(chart.data[i].value);
				legend.push(chart.data[i].name);
				tooltips_serie1.push(chart.tooltips[chart.data[i].name]);
				if(chart.data[0].color!=undefined){
				color.push({
				  plotProps: {
					fill: chart.data[i].color
				  }
				});
				}
				if(chart.data[0].color==undefined){
					color.push({
					plotProps:{
						fill:def_color[i%15]
					}
					});
				}
			}
			var k = 0;
			var legend_length = new Array();
			var count_ch = new Array();        
			var legend_width = 0;
			var legend_height = 0;
			var m = 0;
			while (undefined != legend[m]){
				count_ch[k] = 0;
				legend_length[k]=0;
				for(var j=0; j< legend[m].length; j++){
					if(0x4E00 <= parseInt(legend[m].charCodeAt(j)) && parseInt(legend[m].charCodeAt(j)) <= 0x9FA5)
					{
						count_ch[k] = count_ch[k]+1;
					}
				}
				legend_length[k] = legend[m].length;
				var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
				if (legend_width < width)
					legend_width = width;
				
				k++;
				m++;
			}
			legend_width+=10;
			var legend_height = legend.length*17;
			var legend_x = chart.width - legend_width - 16;  
			var legend_y = (chart.height- legend_height)/2;
			$.elycharts.templates['pie_basic_1'] = {
			  type: "pie",
			  defaultSeries: {
				plotProps: {
				  stroke: "white",
				  "stroke-width": 2,
				  opacity: 0.8
				},
				highlight: {
				  move: 20
				},
				tooltip: {
				  width:200,
				  frameProps: {
					opacity: 0.5
				  }
				},
				startAnimation: {
				  active: true,
				  type: "grow"
				}
			  },
			  features: {
				legend:{
				   horizontal: false,
				   width: legend_width,
				   height: legend_height,
				   x:legend_x,
				   y:legend_y,
				   borderProps:{
					"fill-opacity": 0
					}
				},
			  }
			};
			$("#chart1").chart({
			  template: "pie_basic_1",		  
			  values: {
				serie1: values_serie1
			  },
			  
			  legend: legend,
			  
			  tooltips: {
				serie1: tooltips_serie1
			  },
			  defaultSeries: {
				values: color
			  }
			});
		}
		else{
			//$(document.body).append("<div id = "+chart.render+"></div>");
			radius = (chart.width<chart.height?chart.width:chart.height)*0.8/3;
			new iChart.Pie2D({
				render:chart.render,
				data:chart.data,
				title:chart.title,
				animation:true,
				legend:{
					enable:true
				},
				tip : {
						enable : true
				},
				listeners:{
					parseTipText:function(d,t,i){
						return chart.tooltips[d.name];
					}
				},
				width:chart.width,
				height:chart.height,
				radius:radius			
			}).draw();
		}
	}
	
}

function show(userName,userPwd,DB,table,server,port,pieName,pieValue){
    //alert(userName);
	//var b = {};
	
	//alert(1);
	var b = "";
	b = loadXMLDoc(userName,userPwd,DB,table,server,port,pieName,pieValue);
    alert(b);
	//b =  eval("(function() {return (" + b + ");})()");
	b = eval(b);
	//alert(b[3].name);
	//alert("2");
	//self.setTimeout("json()", 60000)
	//$.getJSON('pie2d.json',function(chart){
		$.getJSON('js/db/pie/pie2d.json',function(chart){
			
			chart.data = b;
			//alert(chart.data[0].value);
			generatePie2d(chart);
		});
}

