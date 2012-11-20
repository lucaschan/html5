
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

function displayJson(json) {
    var newStr = {};
    var bra = {"{":0,"[":0};
    var br = "<br>";
    var ind = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    var jsonStr = JSON.stringify(json);  //将json对象转换为字符串
    for (var i=0; i<jsonStr.length; i++) {
        if (jsonStr[i] == "{" || jsonStr[i] == "[") {
            bra[jsonStr[i]]++;
            newStr[i] = jsonStr[i];
            //newStr[i] += br;
        }
        else if (jsonStr[i] == "}") {
            newStr[i] = br;
            bra["{"]--;
            for (var k=0; k<bra["{"]; k++) {
                newStr[i] += ind;
            }
            newStr[i] += jsonStr[i];
        }
        else if (jsonStr[i] == "]") {
            bra["["]--;
            newStr[i] = jsonStr[i];
        }
        else if (jsonStr[i] == ",") {
            newStr[i] = jsonStr[i];
            if (!bra["["]) {
                newStr[i] += br;
                for (var j=0; j<bra["{"]; j++) {
                    newStr[i] += ind;
                }
            }
        }
        else
            newStr[i] = jsonStr[i];
    }
    var newstr="";         //将newStr所有value值提取出来
    for (var j=0; j<jsonStr.length; j++) {
        //alert(newStr[j]);
        newstr += newStr[j];
    }
    return newstr;
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


////////////////////////////////////////////////////////////////////////
    ////////////////用于柱图，堆栈图，线图数据输入/////////////////
	$( "#dialog-form" ).dialog({
		autoOpen: false,
		height: 400,
		width: 450,
		modal: true,
		buttons: {
			"应用我的数据": function() {
				var $inputs = $form_tbody.children("tr").find("input"),data = {},values = {},tooltips = {},legend = {},color = {},axis = {},CHECK = true;
                axis["l"]={};
                axis["x"]={};
                //Get value
				var title = $("#form_title").val();	
				var labels = $("#form_label").val().split(",");	
				axis["l"].title = $("#form_axis_left").val();	
				axis["x"].title = $("#form_axis_bottom").val();	

				//if(title==""){
				//	$validateTips.html("提示:标题项不能为空!");
				//	return;
				//}
				//TITLE_ = title;
				
				for(var i=0;i<$inputs.length;i+=4){
                    //0为values,1为tooltips(可以为空),2为legend,3为color
					if($inputs[i].value==""||$inputs[i+2].value==""||$inputs[i+3].value==""){
						CHECK = false;
						break;
					}

                    var serie = "serie" + (i/4 +1);
                    color[serie]={};
                    values[serie] = $inputs[i].value.split(",");
                    //字数字符数组转化为数字数组
                    for (var j=0; j<values[serie].length; j++)
                    {
                        values[serie][j] = parseInt(values[serie][j]);
                    }
                    tooltips[serie] = $inputs[i+1].value.split(",");
                    legend[serie] = $inputs[i+2].value;
                    color[serie].color = $inputs[i+3].value;
				}
			    data = {
                    template : "line_basic_6",
                    divId : "chart",
                    title : title,
                    labels : labels,
                    axis : axis,
			    	values : values,
			    	tooltips : tooltips,
			    	legend : legend,
			    	color : color
			    };
				if(!CHECK){
					$validateTips.html("提示:数据项不能为空!");
				}else{
                    //alert(displayJson(data));
                    //alert($("#gallery_select_type").val());
                    //alert(JSON.stringify(data));
                    var str = displayJson(data);
                    //$("#gallery_dataarea").innerHTML = str;
                    document.getElementById("gallery_dataarea").innerHTML=str;
					$validateTips.html("所有文本均为必填项.");
                    if ($("#gallery_select_type").val() == "simple_bar") {
                        generateSimpleBar(data);
                    }
                    else if ($("#gallery_select_type").val() == "stack_bar") {
                        //alert(data.values.serie2);
                        generateStackedBar(data);
                    }
                    else if ($("#gallery_select_type").val() == "line") {
                        generateLine(data);
                    }
                    //alert($("#gallery_select_type").val());
					//DATA_ = data;
					//render();
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


	$( "#custom-data" ).click(function() {
		$( "#dialog-form" ).dialog( "open" );
	});
            ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////	
	
/////////////////////////////////////////////////////////////////////////////
   /////////////数据库-饼图/////////////////
   $("#dialog-form-db-pie2d").dialog({
		autoOpen: false,
        height:400,
        width: 450,
        modal: true,
        buttons: {
            "提交": function() {
                var $inputs = $form_tbody.children("tr").find("input"),CHECK = true;

                var server = $("#form_db_pie_serverAddr").val();
                var port = $("#form_db_pie_port").val();
                var userName = $("#form_db_pie_userName").val();
                var userPwd = $("#form_db_pie_userPassword").val();
                var DB = $("#form_db_pie_dbName").val();
                var table = $("#form_db_pie_tableName").val();
                var pieName = $("#form_db_pie_pieName").val();
                var pieValue = $("#form_db_pie_pieValue").val();
                alert(server);
                alert(port);
                alert(userName);

                if (!CHECK) {
                }else{
                    if ($("#gallery_select_type").val() == "pie2d") {
                        show(userName,userPwd,DB,table,server,port,pieName,pieValue);
                    }
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

	$( "#database" ).click(function() {
		$( "#dialog-form-db-pie2d" ).dialog( "open" );
	});
////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

	var h = $(document.body).height();
	var w = $(document.body).width();
	var datatype,type;
	$canvas = $("#canvasDiv");
	h = h - 150;
	w = w - 280;
	w = w > 800 ? w : 800;
	$("#gallery_right_container").width(w).height(h);
	$("#gallery_right_bg").width(w).height(h);
	
	
	
	var $current_color;
	$(".td_color .form_text").click(function(e) {
		$current_color = $(this);
		$gallery_color_picker.css("top",-6).fadeIn();
		$gallery_color_picker.css("left",298).fadeIn();
		
		e.stopPropagation();
	});
	
	$form_tr_temlate.find('.td_color .form_text').click(function(e) {
		$current_color = $(this);
		var i = $(this).parents("tr").prevAll().length;
		$gallery_color_picker.css("top",-6+29*i).fadeIn();
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

