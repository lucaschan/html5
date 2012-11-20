
function render(){
	if(!TYPE_)return;
	download.disabled = true;
	if (f) {
		doChart();
		f = false;
	} else {
		$canvas.fadeOut(300, function() {
			$(this).fadeIn(300);
			doChart();
		});
	}
}

var $form_tbody,$form_tr_temlate,$form_tr_head,$gallery_color_picker,$validateTips,download,download_a;
$(function() {
	$validateTips = $("#validateTips");
	$form_tbody = $("#form_tbody");
	download = document.getElementById("download");
	download_a = document.getElementById("download_a");
	$gallery_color_picker = $("#gallery_color_picker");
	$form_tr_temlate = $('<tr><td><input type="text" class="form_text" /></td><td><input type="text" class="form_text" /></td><td><input type="text" class="form_text" /></td><td class="td_color"><input type="text" class="form_text"/></td><td><a href="javascript:void(0)" onclick="removeRow(this);">移除</a></td></tr>');
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
		$gallery_color_picker.css("top",70).fadeIn();
		$gallery_color_picker.css("left",298).fadeIn();
		
		e.stopPropagation();
	});
	
	$form_tr_temlate.find('.td_color .form_text').click(function(e) {
		$current_color = $(this);
		var i = $(this).parents("tr").prevAll().length;
		$gallery_color_picker.css("top",70+29*i).fadeIn();
		$gallery_color_picker.css("left",298).fadeIn();
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

