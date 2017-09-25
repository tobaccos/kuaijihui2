//单选框

$(".radios li").click(function() {

	var radio = $(this).find(".radio");
	//	console.log(radios)
	if(radio.hasClass('icon-radio-checked')) {
		radio.removeClass('icon-radio-checked').addClass("icon-radio");
	} else {
		radio.addClass('icon-radio-checked');
	}

	$(this).siblings().find('.radio').removeClass('icon-radio-checked')
})

//三级联动

function options(data) {
	var options='';
	for(var i = 0; i < data.length; i++) {
		if(data[i]['Depth'] == 1) {
			//			
			options += '<li data-value=' + data[i]["ID"] + '>' + data[i]["City"] + '</li>'
		}

	}
	return options
};

function optionsc(data, id) {
	var options='';
	for(var i = 0; i < data.length; i++) {
		if(data[i]['ParentID'] == id) {
			options += '<li name=' + data[i]["city_level"] + ' ' + 'value=' + data[i]["ID"] + '>' + data[i]["City"] + '</li>'
		}

	};

	return options
};

$.ajax({
	type: "get",
	url: "http://edu.360kjh.com/special/City.php",
	async: true,
	success: function(res) {
		//console.log(res);
		var reses = JSON.parse(res);
		//console.log(reses);
		//	初始化生成省
		$(".province").html(options(reses));
		var proindex = $(".province li:first").attr("data-value");
		var textp = $(".province li:first").text();
		$("#province").val(textp);
		//初始化生成市区
		$('.city').html(optionsc(reses, proindex));
		var textc = $(".city li:first").text();
		$("#city").val(textc);
		var city_level1 = $('#city').attr("name");
		$('.level').val(city_level1)

		//		点击下拉箭头
		$(".province_icon").click(function() {
			$(".province").toggle(500);
			$(".city").hide(500);
			//省变动生成相应市

			$('.province li').click(function() {
				var proindex = $(this).attr("data-value");
				$('.city').html(optionsc(reses, proindex));
				var textp = $(this).text();
		$("#province").val(textp);
				var textc = $(".city li:first").text();
//				console.log(textc);
				$("#city").val(textc);
				var city_level = $(".city li:first").attr("name");
				$('.level').val(city_level);
				$(this).parent().fadeIn(500);
				
				console.log(city_level);

			});
		})

		//		点击下拉箭头
		$(".city_icon").click(function() {
			$(".city").toggle(500);
			$(".province").hide(500);
			//市变动
			$('.city li').click(function() {
				var city_level = $(this).attr("name");
				var textc = $(this).text();
				$("#city").val(textc);
				$('.level').val(city_level);
				$(this).parent().hide();
//				console.log(city_level);
			})
		});
		
//	点击任意一处的,列表隐藏


	}
});


//		发送验证码
var count = 0;
var index = 60;
$('i.btn').click(function() {
	var mobile = $('input[name="phone"]').val();
	if(/1[0-9]{10}/.test(mobile)) {

		if(index == 60) {
			$.ajax({
				type: "post",
				url: "http://edu.360kjh.com/special/sms.php",
				data: {
					mobile: mobile
				},
				async: true,
				success: function(res) {

				}
			});
			$("i.btn").css({backgroundColor:'#ccc'})
			var timer = setInterval(function() {
				
				$('i.btn').html("重新发送(" + index + ")");
				if(index == 0) {
					clearInterval(timer);
					index = 60;
					$("i.btn").css({backgroundColor:'#e4b026'})
				} else {

					index--;
				}
			}, 1000);
		}

	}else{
		layer.msg('请输入手机号');
	}

})

//		提交数据
var province;
var city;
var gender;
var certificate;
var position;
var sallary;
var working_life;
var desire;
var mobile;
var code;
var city_level;


$('.sub').click(function() {
	province = $("#province").val();
	city = $("#city").val();
//	var city_levels = $("#city option:selected").attr('name');
	city_level = $(".level").val();
	//	console.log(city_levels==city_level);
	gender = $('.gender .icon-radio-checked').attr('data-value');
	certificate = $('.certificate .icon-radio-checked').attr('data-value');
	position = $('.positions .icon-radio-checked').attr('data-value');
	sallary = $('.sallary .icon-radio-checked').attr('data-value');
	working_life = $('.working_life .icon-radio-checked').attr('data-value');
	desire = $('.desire .icon-radio-checked').attr('data-value');
	mobile = $('.phone').val();
	code = $('.code').val();

	if(province && city && gender && certificate && position && sallary && working_life && desire && mobile && code && city_level) {

		$.ajax({
			type: "post",
			url: "http://edu.360kjh.com/special/investigationadd.php",
			data: {
				province: province,
				city: city,
				gender: gender,
				certificate: certificate,
				position: position,
				sallary: sallary,
				working_life: working_life,
				desire: desire,
				mobile: mobile,
				code: code,
				city_level:city_level
			},
			async: true,
			success: function(res) {
				console.log(res);

								if(res == 1) {
									var url = window.location.href.replace(/index/, "success")
									window.location.href = url
								};
								if(res == -1) {
									layer.msg('验证码错误');
								}
								if(res == -2) {
									layer.msg('验证码超时');
								}
								if(res == -3) {
									layer.msg('您已参加此活动');
								}
			}
		})

	} else {
		layer.msg('请填写完整');
	}
});
