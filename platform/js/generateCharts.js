//////////////////////////////////////////////////////////////
/////////////////Generate simple bar//////////////////////////
function generateSimpleBar(data){
    function getBrowserName(){
        var lsBrowser = navigator.userAgent;
        if (lsBrowser.indexOf("MSIE") >=0)
            lsBrowser = "MSIE";
        else if (lsBrowser.indexOf("Chrome") >=0)
            lsBrowser = "Chrome";
        else if (lsBrowser.indexOf("Firefox") >=0)
            lsBrowser = "Firefox";
        else if (lsBrowser.indexOf("Netscape") >=0)
            lsBrowser = "Netscape";
        else if (lsBrowser.indexOf("Safari") >=0)
            lsBrowser = "Safari";
        else if (lsBrowser.indexOf("Opera") >=0)
            lsBrowser = "Opera";
        else
            lsBrowser = "UNKNOWN";
        return lsBrowser;
    }
//Get height and width of div
var div_height = document.getElementById("chart").offsetHeight;     
var div_width = document.getElementById("chart").offsetWidth;
//compute fontsize of title and axis
titleFontsize = (div_height + div_width)/(2*17);
axisFontsize = titleFontsize/2;
axisString = axisFontsize + "px Verdana";

//insert title on the top of the chart
var title_top = -div_height;
var inner_string = "<div style='font-size:"+titleFontsize+"px;text-align:center;margin-top:"+title_top+"px'>"+data.title+"</div>";
document.getElementById("chart").innerHTML = inner_string;

//Get the maximum length of labels
var labels_maxLength = 0;
var k = 0;
var countLabel_ch = new Array();
var labelLength = new Array();
while (undefined != data.labels[k]){
    countLabel_ch[k] = 0;
    for(var j=0; j< data.labels[k].length; j++){
        if(0x4E00 <= parseInt(data.labels[k].charCodeAt(j)) && parseInt(data.labels[k].charCodeAt(j)) <= 0x9FA5)
        {
            countLabel_ch[k] = countLabel_ch[k]+1;
        }
    }
    //alert(countLabel_ch[k]);
    labelLength[k] = data.labels[k].length;
    if("MSIE" == getBrowserName()){
        var length = (labelLength[k]-countLabel_ch[k]) * 3.5+ countLabel_ch[k] * 7.5 + 15;
    }
    else if("Firefox" == getBrowserName()){
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 10 + 15;
    }
    else if("Chrome" == getBrowserName()){
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 10 + 9;
    }
    else{
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 14;
    }
    if (labels_maxLength < length)
    {
        labels_maxLength = length;
    }
    k++;
}
var label_height = labels_maxLength*Math.sin(45); 
//Get the maximum length of legend
var legendSeries = data.legend.serie1
var i = 2;
var k = 0;
var legend_length = new Array();
var count_ch = new Array();           //count chinese character
var legend_width = 0;
var legend_height = 0;

while (undefined != legendSeries){
    count_ch[k] = 0;
    legend_length[k]=0;
    for(var j=0; j< legendSeries.length; j++){
        if(0x4E00 <= parseInt(legendSeries.charCodeAt(j)) && parseInt(legendSeries.charCodeAt(j)) <= 0x9FA5)
        {
            count_ch[k] = count_ch[k]+1;
        }
    }
    legend_length[k] = legendSeries.length;
    //calculate string's length mixed with EN and CH charaters
    if ("MSIE" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else if ("Firefox" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else if ("Chrome" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    if (legend_width < width)
        legend_width = width;
    legendSeries = eval("data.legend.serie" + i);
    k++;
    i++;
}
//count the height by the number of items
var legend_height = i*(div_height/37);

//count rigth and bottom margin of charts
var margin_u = div_height/10;
var margin_r = legend_width + 16; //One char equals about 8 pix,16 pix is for margin
var margin_b = labels_maxLength*Math.sin(45) + 25 ;
var margin_l = div_width/50+40;
//alert(labels_maxLength*Math.sin(45)*8);

//count legend's coordinate
var legend_x = div_width - margin_r + 8;  
var legend_y = div_height - legend_height - margin_b;


// # is needed to make the function working the right way
var divId = "#"+data.divId;
//alert("test");
$.elycharts.templates['line_basic_6'] = {
 type : "line",
 defaultSeries : {
  plotProps : {
   opacity : 0.9
  },
  highlight : {
   overlayProps : {
    fill : "white",
    opacity : 0.5
   }
  },
  startAnimation : {
   active : true,
   type : "grow"
  },
  tooltip : {
   frameProps : false,
   height : 30,
   offset : [0, 0],
   contentStyle : "font-weight: bold"
  }
 },
 series : data.color,
 defaultAxis : {
  labels : true,
  labelsPos : "middle"
 },

 features : {
  grid : {
   draw : [true, true],
   forceBorder : true,
   ny: 10
         },
  legend:{
   horizontal: false,
   width: legend_width,
   height: legend_height,
   x:legend_x,
   y:legend_y,
   borderProps:{
    "fill-opacity": 0,
    }
  }
 },
 barMargins : 15,
 margins:[margin_u,margin_r,margin_b,margin_l]
};
$(function() {
$(divId).chart({
 template :'line_basic_6',
 title: data.title,

 tooltips : data.tooltips,
 values : data.values,
 labels : data.labels,
 legend : data.legend,
 defaultSeries : {
  type : "bar"
 },
 margins : data.margins,
 axis : {
  l:{
    title : data.axis.l.title,
    titleProps:{
        font : axisString
    },
    titleDistance : 40,
  },
  x:{
     title : data.axis.x.title,
     labelsRotate:45,	
     titleProps : {
        font : axisString
     },
     titleDistance : label_height,
  },
 },
});
});
//alert ("test3");
}

//////////////////////////////////////////////////////////////
//////////////////////Generate line///////////////////////////
function generateLine(data){
//get the name of browser
function getBrowserName(){
    var lsBrowser = navigator.userAgent;
    if (lsBrowser.indexOf("MSIE") >=0)
        lsBrowser = "MSIE";
    else if (lsBrowser.indexOf("Chrome") >=0)
        lsBrowser = "Chrome";
    else if (lsBrowser.indexOf("Firefox") >=0)
        lsBrowser = "Firefox";
    else if (lsBrowser.indexOf("Netscape") >=0)
        lsBrowser = "Netscape";
    else if (lsBrowser.indexOf("Safari") >=0)
        lsBrowser = "Safari";
    else if (lsBrowser.indexOf("Opera") >=0)
        lsBrowser = "Opera";
    else
        lsBrowser = "UNKNOWN";
    return lsBrowser;
}

//Get height and width of div
var div_height = document.getElementById("chart").offsetHeight;     
var div_width = document.getElementById("chart").offsetWidth;

//compute fontsize of title and axis
titleFontsize = (div_height + div_width)/(2*17);
axisFontsize = titleFontsize/2;
axisString = axisFontsize + "px Verdana";

//insert title on the top of the chart
var title_top = -div_height;
var inner_string = "<div style='font-size:"+titleFontsize+"px;text-align:center;margin-top:"+title_top+"px'>"+data.title+"</div>";
document.getElementById("chart").innerHTML = inner_string;

//Get the maximum length of labels
var labels_maxLength = 0;
//var i = 1;
var k = 0;
var countLabel_ch = new Array();
var labelLength = new Array();
while (undefined != data.labels[k]){
    countLabel_ch[k] = 0;
    for(var j=0; j< data.labels[k].length; j++){
        if(0x4E00 <= parseInt(data.labels[k].charCodeAt(j)) && parseInt(data.labels[k].charCodeAt(j)) <= 0x9FA5)
        {
            countLabel_ch[k] = countLabel_ch[k]+1;
        }
    }
    labelLength[k] = data.labels[k].length;
    if("MSIE" == getBrowserName())
        var length = (labelLength[k]-countLabel_ch[k]) * 3.5+ countLabel_ch[k] * 7.5 + 15;
    else if("Firefox" == getBrowserName())
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 10 + 9;
    else if("Chrome" == getBrowserName())
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 10 + 9;
    else
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 14;

    if (labels_maxLength < length)
    {
        labels_maxLength = length;
    }
    k++;
}
var label_height = labels_maxLength*Math.sin(45); 

//Get the maximum length of legend
var legendSeries = data.legend.serie1
var i = 2;
var k = 0;
var legend_length = new Array();
var count_ch = new Array();           //count chinese character
var legend_width = 0;
var legend_height = 0;

while (undefined != legendSeries){
    count_ch[k] = 0;
    legend_length[k]=0;
    for(var j=0; j< legendSeries.length; j++){
        if(0x4E00 <= parseInt(legendSeries.charCodeAt(j)) && parseInt(legendSeries.charCodeAt(j)) <= 0x9FA5)
        {
            count_ch[k] = count_ch[k]+1;
        }
    }
    legend_length[k] = legendSeries.length;
    //calculate string's length mixed with EN and CH charaters
    if ("MSIE" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else if ("Firefox" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else if ("Chrome" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    if (legend_width < width)
        legend_width = width;
    legendSeries = eval("data.legend.serie" + i);
    k++;
    i++;
}
//count the height by the number of items
var legend_height = i*(div_height/37);

//count rigth and bottom margin of charts
var margin_u = div_height/10;
var margin_r = legend_width + 16; //One char equals about 8 pix,16 pix is for margin
var margin_b = labels_maxLength*Math.sin(45) + 25 ;
var margin_l = div_width/50+40;
//alert(labels_maxLength*Math.sin(45)*8);

//count legend's coordinate
var legend_x = div_width - margin_r + 8;  
var legend_y = div_height - legend_height - margin_b;


// # is needed to make the function working the right way
var divId = "#"+data.divId;

$.elycharts.templates['line_basic_6'] = {
 type : "line",
 defaultSeries : {
  plotProps : {
   opacity : 0.9,
   "stroke-width":3
  },
  highlight : {
   overlayProps : {
    fill : "white",
    opacity : 0.5
   }
  },
  startAnimation : {
   active : true,
   type : "grow"
  },
  tooltip : {
   frameProps : false,
   height : 30,
   offset : [0, 0],
   contentStyle : "font-weight: bold"
  }
 },
 series : data.color,
 defaultAxis : {
  labels : true
 },

 features : {
  grid : {
   draw : [true, true],
   forceBorder : true,
   ny: 10
         },
  legend:{
   horizontal: false,
   width: legend_width,
   height: legend_height,
   x:legend_x,
   y:legend_y,
   borderProps:{
    "fill-opacity": 0,
    }
  }
 },
 barMargins : 15,
 margins:[margin_u,margin_r,margin_b,margin_l]
};


$(function() {
$(divId).chart({
 template : data.template,
 title: "test",

 tooltips : data.tooltips,
 values : data.values,
 labels : data.labels,
 legend : data.legend,
 defaultSeries : {
  type : "line"
 },
 margins : data.margins,
 axis : {
  l:{
    title : data.axis.l.title,
    titleProps:{
        font : axisString
    },
    titleDistance : 40,
  },
  x:{
     title : data.axis.x.title,
     labelsRotate:45,	
     titleProps : {
        font : axisString
     },
     titleDistance : label_height,
  },
 },
});
});

}

///////////////////////////////////////////////////////////////
/////////////////Generate stacked bar//////////////////////////
function generateStackedBar(data){
//get the name of browser
function getBrowserName(){
    var lsBrowser = navigator.userAgent;
    if (lsBrowser.indexOf("MSIE") >=0)
        lsBrowser = "MSIE";
    else if (lsBrowser.indexOf("Chrome") >=0)
        lsBrowser = "Chrome";
    else if (lsBrowser.indexOf("Firefox") >=0)
        lsBrowser = "Firefox";
    else if (lsBrowser.indexOf("Netscape") >=0)
        lsBrowser = "Netscape";
    else if (lsBrowser.indexOf("Safari") >=0)
        lsBrowser = "Safari";
    else if (lsBrowser.indexOf("Opera") >=0)
        lsBrowser = "Opera";
    else
        lsBrowser = "UNKNOWN";
    return lsBrowser;
}

//Get height and width of div
var div_height = document.getElementById("chart").offsetHeight;     
var div_width = document.getElementById("chart").offsetWidth;

//compute fontsize of title and axis
titleFontsize = (div_height + div_width)/(2*17);
axisFontsize = titleFontsize/2;
axisString = axisFontsize + "px Verdana";

//insert title on the top of the chart
var title_top = -div_height;
var inner_string = "<div style='font-size:"+titleFontsize+"px;text-align:center;margin-top:"+title_top+"px'>"+data.title+"</div>";
document.getElementById("chart").innerHTML = inner_string;

//Get the maximum length of labels
var labels_maxLength = 0;
//var i = 1;
var k = 0;
var countLabel_ch = new Array();
var labelLength = new Array();
while (undefined != data.labels[k]){
    countLabel_ch[k] = 0;
    for(var j=0; j< data.labels[k].length; j++){
        if(0x4E00 <= parseInt(data.labels[k].charCodeAt(j)) && parseInt(data.labels[k].charCodeAt(j)) <= 0x9FA5)
        {
            countLabel_ch[k] = countLabel_ch[k]+1;
        }
    }
    labelLength[k] = data.labels[k].length;
    if("MSIE" == getBrowserName())
        var length = (labelLength[k]-countLabel_ch[k]) * 3.5+ countLabel_ch[k] * 7.5 + 15;
    else if("Firefox" == getBrowserName())
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 10 + 15;
    else if("Chrome" == getBrowserName())
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 10 + 9;
    else
        var length = (labelLength[k]-countLabel_ch[k]) * 6+ countLabel_ch[k] * 14;

    if (labels_maxLength < length)
    {
        labels_maxLength = length;
    }
    k++;
}
var label_height = labels_maxLength*Math.sin(45); 

//Get the maximum length of legend
var legendSeries = data.legend.serie1
var i = 2;
var k = 0;
var legend_length = new Array();
var count_ch = new Array();           //count chinese character
var legend_width = 0;
var legend_height = 0;

while (undefined != legendSeries){
    count_ch[k] = 0;
    legend_length[k]=0;
    for(var j=0; j< legendSeries.length; j++){
        if(0x4E00 <= parseInt(legendSeries.charCodeAt(j)) && parseInt(legendSeries.charCodeAt(j)) <= 0x9FA5)
        {
            count_ch[k] = count_ch[k]+1;
        }
    }
    legend_length[k] = legendSeries.length;
    //calculate string's length mixed with EN and CH charaters
    if ("MSIE" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else if ("Firefox" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else if ("Chrome" == getBrowserName())
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    else
        var width = (legend_length[k]-count_ch[k]) * 5.5 + (count_ch[k] * 12) + 30;
    if (legend_width < width)
        legend_width = width;
    legendSeries = eval("data.legend.serie" + i);
    k++;
    i++;
}
//count the height by the number of items
var legend_height = i*(div_height/37);

//count rigth and bottom margin of charts
var margin_u = div_height/10;
var margin_r = legend_width + 16; //One char equals about 8 pix,16 pix is for margin
var margin_b = labels_maxLength*Math.sin(45) + 25 ;
var margin_l = div_width/50+40;
//alert(labels_maxLength*Math.sin(45)*8);

//count legend's coordinate
var legend_x = div_width - margin_r + 8;  
var legend_y = div_height - legend_height - margin_b;


// # is needed to make the function working the right way
var divId = "#"+data.divId;

$.elycharts.templates['line_basic_6'] = {
 type : "line",
 defaultSeries : {
  plotProps : {
   opacity : 0.9
  },
  highlight : {
   overlayProps : {
    fill : "white",
    opacity : 0.5
   }
  },
  startAnimation : {
   active : true,
   type : "grow"
  },
  tooltip : {
   frameProps : false,
   height : 30,
   offset : [0, 0],
   contentStyle : "font-weight: bold"
  }
 },
 series : data.color,
 defaultAxis : {
  labels : true,
  labelsPos : "middle"
 },

 features : {
  grid : {
   draw : [true, true],
   forceBorder : true,
   ny: 10
         },
  legend:{
   horizontal: false,
   width: legend_width,
   height: legend_height,
   x:legend_x,
   y:legend_y,
   borderProps:{
    "fill-opacity": 0,
    }
  }
 },
 barMargins : 15,
 margins:[margin_u,margin_r,margin_b,margin_l]
};


$(function() {
$(divId).chart({
 template : data.template,
 title: "test",

 tooltips : data.tooltips,
 values : data.values,
 labels : data.labels,
 legend : data.legend,
 defaultSeries : {
  type : "bar",
  stacked:true
 },
 margins : data.margins,
 axis : {
  l:{
    title : data.axis.l.title,
    titleProps:{
        font : axisString
    },
    titleDistance : 40,
  },
  x:{
     title : data.axis.x.title,
     labelsRotate:45,	
     titleProps : {
        font : axisString
     },
     titleDistance : label_height,
  },
 },
});
});

}

