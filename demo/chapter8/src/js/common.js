function myshow(show,close,toshow){
	function addMask(){
		if(!document.getElementById('mask')){
		
		var newMask = document.createElement("div");

		newMask.id = "mask";

		newMask.style.position = "absolute";

		newMask.style.zIndex = "1";

		_scrollWidth = Math.max(document.body.scrollWidth,document.documentElement.scrollWidth);

		_scrollHeight = Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);

		newMask.style.width = _scrollWidth + "px";

		newMask.style.height = _scrollHeight + "px";

		newMask.style.top = "0px";

		newMask.style.left = "0px";

		newMask.style.backgroundColor = "#535353";

		newMask.style.filter = "alpha(opacity=40)";

		newMask.style.opacity = "0.40";

		document.body.appendChild(newMask);
		}
  }
	show.click(function(e){
            e.preventDefault();
            toshow.css('display','block');
            addMask();
		});
	close.click(function(e){
            e.preventDefault();
            toshow.css('display','none');
            $('#mask').remove();
        });
}
$(document).ready(function(){
	myshow($('#a-weixin'),$('#model-weixin #close'),$('#model-weixin'));
	myshow($('#shiping'),$('#cdd_vedio #close'),$('#cdd_vedio'));
	myshow($('#dalaotuijian'),$('#recommend #close'),$('#recommend'));
	
	$('.product_img').slick(
		{
			dots: true
		}
	);
	
	
	$('.nav-sidebar > li > a').click(function(e){
		e.preventDefault();
		var href = "#"+e.target.href.split("#")[1];
		$('.tab-pane').removeClass('active');
		$(href).addClass('active');
		(function(href){
			if(href=='#tab3'&&$('#tab3').height()+$('.container').height()<$(window).height()){
				$('.footer').addClass('fixed-bottom');
			}else{
				$('.footer').removeClass('fixed-bottom');
			}
		}(href));
	});
		function fixed_footer(window_height,div_height){
			if(div_height<window_height&&main_height!=null){
				$('.footer').addClass('fixed-bottom');
			}else{
				$('.footer').removeClass('fixed-bottom');
			}
		};
});
	
