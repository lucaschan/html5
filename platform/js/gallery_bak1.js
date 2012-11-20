
var data1 = [{
	name : 'Other',
	value : 4.73,
	color : '#6f83a5'
}, {
	name : 'Opera',
	value : 7.02,
	color : '#778088'
}, {
	name : 'Safari',
	value : 16.77,
	color : '#a5aaaa'
}, {
	name : 'Firefox',
	value : 24.88,
	color : '#97b3bc'
}, {
	name : 'Chrome',
	value : 29.84,
	color : '#5d7f97'
}, {
	name : 'IE',
	value : 35.75,
	color : '#9d4a4a'
}, ], data2 = [{
	name : '北京',
	value : 10502,
	color : '#5ad0dd'
}, {
	name : '上海',
	value : 2405,
	color : '#ff2120'
}, {
	name : '广州',
	value : 1806,
	color : '#e3ff2e'
}], data3 = [{
	name : "一月",
	value : 8,
	color : '#4572a7'
}, {
	name : '二月',
	value : 12,
	color : '#4572a7'
}, {
	name : '三月',
	value : 14,
	color : '#4572a7'
}, {
	name : '四月',
	value : 20,
	color : '#4572a7'
}, {
	name : '五月',
	value : 26,
	color : '#4572a7'
}, {
	name : '六月',
	value : 32,
	color : '#4572a7'
}, {
	name : '七月',
	value : 34,
	color : '#4572a7'
}, {
	name : '八月',
	value : 36,
	color : '#4572a7'
}, {
	name : '九月',
	value : 31,
	color : '#4572a7'
}, {
	name : '十月',
	value : 26,
	color : '#4572a7'
}, {
	name : '十一月',
	value : 18,
	color : '#4572a7'
}, {
	name : '十二月',
	value : 12,
	color : '#4572a7'
}];

var DEFAULT_,OPTION_, TYPE_,TITLE_='Top 5 Browsers from 1 to 29 Feb 2012', DATA_ = data1, ANIMATION_ = true, SHADOW_ = false,f = true,BACKGROUND_COLOR = '#FEFEFE',COO_BACKGROUND_COLOR = '#FEFEFE',IMAGE_DATA="";
var color = ['#a5c2d5','#cbab4f','#76a871','#c12c44','#9f7961','#6f83a5'];

function doChart() {
	if (TYPE_ == 'Pie2D' || TYPE_ == 'Pie3D') {
		var r = TYPE_ == 'Pie2D' ? 140 : 160;
		var d = [];
		if(DATA_.length==12){
			for(var i=0;i<12;i++){
				d.push(iChart.clone(DATA_[i]));
				d[i].color = color[i%6];
			}
		}else{
			d = DATA_;
		}
		DEFAULT_ = {
			render : 'canvasDiv',
			data : d,
			legend : {
				enable : true
			},
			showpercent : true,
			decimalsnum : 2,
			width : 800,
			height : 440,
			radius : r
		};
	} else if (TYPE_ == 'Column2D' || TYPE_ == 'Column3D') {
		DEFAULT_ = {
			render : 'canvasDiv',
			data : DATA_,
			legend : {
				enable : true
			},
			coordinate : {
				width : 600,
				height : 280
			},
			width : 800,
			height : 400
		};
	} else if (TYPE_ == 'Bar2D') {
		DEFAULT_ = {
			render : 'canvasDiv',
			data : DATA_,
			legend : {
				enable : true
			},
			coordinate : {
				width : 600,
				height : 280
			},
			width : 800,
			height : 400
		};
	} else if (TYPE_ == 'LineBasic2D'||TYPE_=='Area2D') {
		var labels = [], data_l = [];
		for ( var i = 0; i < DATA_.length; i++) {
			labels.push(DATA_[i].name);
			data_l.push(DATA_[i].value);
		}
		if(data_l.length==1){
			alert("折线图至少需要2组数据才能画线哦!请定制数据或者选择其他图形.");
			return;
		}
		DEFAULT_ = {
			render : 'canvasDiv',
			data_labels : labels,
			data:[{
				name : '北京',
				value : data_l,
				color : '#1f7e92',
				linewidth : 3
			}],
			coordinate : {
				width : 600,
				height : 280
			},
			width : 800,
			height : 400
		};
		if(OPTION_ == '1'){
			DEFAULT_.segment_style={
				smooth : true,
				point_hollow : false
			}
		}
		
	}
	if(TITLE_!='')
		DEFAULT_.title = TITLE_;
	
	DEFAULT_.animation = ANIMATION_;
	DEFAULT_.shadow = SHADOW_;
	DEFAULT_.shadow_blur = 3;
	DEFAULT_.background_color = BACKGROUND_COLOR;
	DEFAULT_.footnote = "Design by ichartjs";
	if(DEFAULT_.coordinate){
		DEFAULT_.coordinate.background_color = COO_BACKGROUND_COLOR;
		DEFAULT_.coordinate.grid_color = iChart.dark(COO_BACKGROUND_COLOR,0.2);
	}
	/**
	 * 使导出图片按钮有效
	 */
	DEFAULT_.listeners={};
	DEFAULT_.listeners[ANIMATION_?'afterAnimation':'draw']=function(c){
		download.disabled = false;
		IMAGE_DATA = this.target.canvas.toDataURL();
	}
	
	new iChart[TYPE_](DEFAULT_).draw();
}

var $form_tbody,$form_tr_temlate,$form_tr_head,$gallery_color_picker,$validateTips,download,download_a;
$(function() {
	$validateTips = $("#validateTips");
	$form_tbody = $("#form_tbody");
	download = document.getElementById("download");
	download_a = document.getElementById("download_a");
	$gallery_color_picker = $("#gallery_color_picker");
	$form_tr_temlate = $('<tr><td><input type="text" class="form_text" /></td><td><input type="text" class="form_text" /></td><td class="td_color"><input type="text" class="form_text"/></td><td><a href="javascript:void(0)" onclick="removeRow(this);">移除</a></td></tr>');
	$form_tr_head = $("#form_tr_head");
	
	$( "#dialog-form" ).dialog({
		autoOpen: false,
		height: 400,
		width: 450,
		modal: true,
		buttons: {
			"应用我的数据": function() {
				var title = $("#form_title").val();	
				if(title==""){
					$validateTips.html("提示:标题项不能为空!");
					return;
				}
				TITLE_ = title;
				
				var $inputs = $form_tbody.children("tr").find("input"),data = [],CHECK = true;
				for(var i=0;i<$inputs.length;i+=3){
					if($inputs[i].value==""||$inputs[i+1].value==""||$inputs[i+2].value==""){
						CHECK = false;
						break;
					}
					data.push({
						name : $inputs[i].value,
						value : parseFloat($inputs[i+1].value)||0,
						color : $inputs[i+2].value
					});
				}
				if(!CHECK){
					$validateTips.html("提示:数据项不能为空!");
				}else{
					$validateTips.html("所有文本均为必填项.");
					DATA_ = data;
					render();
					$( this ).dialog( "close" );
				}
			},
			'取消': function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			
		}
	}).click(function(){
		$gallery_color_picker.fadeOut();
	});
	
	
	
	var h = $(document.body).height();
	var w = $(document.body).width();
	var datatype,type;
	$canvas = $("#canvasDiv");
	h = h - 150;
	w = w - 280;
	w = w > 800 ? w : 800;
	$("#gallery_right_container").width(w).height(h);
	$("#gallery_right_bg").width(w).height(h);
	
	
	
	$( "#custom-data" ).click(function() {
		$( "#dialog-form" ).dialog( "open" );
	});
	var $current_color;
	$(".td_color .form_text").click(function(e) {
		$current_color = $(this);
		$gallery_color_picker.css("top",6).fadeIn();
		
		e.stopPropagation();
	});
	
	$form_tr_temlate.find('.td_color .form_text').click(function(e) {
		$current_color = $(this);
		var i = $(this).parents("tr").prevAll().length;
		$gallery_color_picker.css("top",6+29*i).fadeIn();
		e.stopPropagation();
	});
	
	$("#gallery_color_picker .color").hover(function(){
		$(this).addClass("gallery_color_hover");
	},function(){
		$(this).removeClass("gallery_color_hover");
	}).click(function(){
		var color = $(this).attr('color');
		$current_color.val(color);
		$current_color.parent("td").css("background-color",color);
	});
	
});
function addRow(){
	$form_tbody.append($form_tr_temlate.clone(true));
}
function removeRow(a){
	$(a).parents("tr").remove();
}

