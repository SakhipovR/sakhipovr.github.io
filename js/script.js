$( document ).ready(function() {
    $('.mob_button button').on('click', function(){
        $('.modal_bot').css('display', 'block');
        $("html").animate({ scrollTop: 0 }, "slow");
        $('body').css('overflow', 'hidden');
    })

    $('.modal_close').on('click', function(){
        $('.modal_bot').css('display', 'none');
        $('body').css('overflow', 'auto');
    })

    
});