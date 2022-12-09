      
   /*  $(".serv-redirect-a").click(function(){
    $(".red-trans").addClass("red-trans-active");
    $(window).scrollTop(0);
	window.setTimeout(function () {
        location.href = "servico-a.html";
    }, 1200);
}); */
       
                    $(".serv-redirect-b").click(function(){
    $(".red-trans").addClass("red-trans-active");
    $(window).scrollTop(0);
	window.setTimeout(function () {
        location.href = "automovel.html";
    }, 1200);
});
     
$(".serv-redirect-a").click(function(){
        var url = "https://api.whatsapp.com/send?phone=5516981784048";
        window.open(url, '_blank').focus();
});