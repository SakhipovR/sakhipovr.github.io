$(document).ready(function () {
    $('.mob_button button').on('click', function () {
        $('.modal_bot').css('display', 'block');
        $("html").animate({scrollTop: 0}, "slow");
        $('body').css('overflow', 'hidden');
        $('body').css('position', 'fixed');
    });

    $('.modal_close').on('click', function () {
        $('.modal_bot').css('display', 'none');
        $('body').css('overflow', 'auto');
        $('body').css('position', 'relative');
    });

    $('.js-sms-list li').on('click', function () {
        var question = $(this).text();
        var answerIndex = $(this).data('answer-index');
        var $chat = $('.css-ljhy6a');

        $chat.append('' +
            '<li class="css-1qyo5rb" role="listitem">' +
                '<div class="css-tyxksf css-2p02md from-user">' +
                    '<div class="content">' +
                        '<div class="webchat__row message">' +
                            '<div class="css-b9r2pe from-user bubble">' +
                                '<p class="plain css-o3xlyv">' + question + '</p>' +
                            '</div>' +
                            '<div class="filler"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</li>');

        $chat.append('' +
            '<li class="css-1qyo5rb hide-timestamp" role="listitem">' +
                '<div class="css-tyxksf css-2p02md">' +
                    '<div class="content">' +
                        '<div class="webchat__row message">' +
                            '<div class="css-b9r2pe bubble">' +
                                '<div class="markdown css-o3xlyv">' +
                                    '<p>' + answers[answerIndex] + '</p>\n' +
                                '</div>' +
                            '</div>' +
                            '<div class="filler"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</li>');

        if ($(window).width() < 768){
            $('.mob_button button').click();
        }
    });
});

var wpcf7Elm = document.querySelector( '.wpcf7' );
 
wpcf7Elm.addEventListener( 'wpcf7submit', function( event ) {
    wpcf7Elm.innerHTML = '<p style="color: #0085FF">Спасибо! Мы свяжемся с вами в ближайшее время и дадим больше информации</p>'
}, false );





 /* Chat-bot js */
 $(document).ready(function() 
 { 

 var answers_arr = [];
 var uniqueNames = [];
 var token = 'test123';
 var flag = false;
 var dialogue_info = {
     user_quesition: [ ],
     bot_sentence: [ ],
     answer: [ ],
     satisfaction: [ ],
     partner_token: token,
     question_time: [ ]
 }
 
 var answer_text = [];

if($(window).width()  < 768){
    var scrollBottom = $('.w_m').scrollTop() - ($('.w_m').height() * 50);
    function my_scr(){
        $(".w_m").animate({ scrollTop: scrollBottom }, 1000);
     }
}else{
    var scrollBottom = $('#webchat-desktop').scrollTop() + ($('#webchat-desktop').height() * 10);
    function my_scr(){
        $("#webchat-desktop").animate({ scrollTop: scrollBottom }, 1000);
     }
}

 


    setTimeout(function(){
        $('.webchat').append('<div class="quesitions">Добрый день, задайте вопрос!</div>')
        }, 1000);
 

 
 $('.send_form').on('submit', function(){
     var question = $('.input_quesition').val();
     var que = $('.chat_box_modal .input_quesition').val();
     if($(window).width()  < 768){
        dialogue_info.user_quesition.push(que);
        $('.webchat').append('<ul class="que"><li>'+  que  +'</li></ul>')
        $('.input_quesition').val('');

        MyAjax(que);
     }else{
        dialogue_info.user_quesition.push(question);
        $('.input_quesition').val('');
        $('.webchat').append('<ul class="que"><li>'+  question  +'</li></ul>');
        MyAjax(question);
     }
     my_scr()
     return false;
 })   

 
  $('.sms_list li').on('click', function(){
     var question = $(this).text().toString();
     
     dialogue_info.user_quesition.push(question);
     $('.webchat').append('<ul class="que"><li>'+  question  +'</li></ul>')
     MyAjax(question);
     my_scr()
     return dialogue_info.question_time;
 })
 
 
 
 
 function MyAjax(arg1){
     var chat = $('.webchat');
     var number = 1;
     var html = '<div class="quesitions_block"><div class="quesitions"><p>Выберите тему:</p><ul class="quesitions_list">'
     $.ajax({
         url: 'https://asfnschatbotapi.azurewebsites.net/bot_request.php',
         data: {question: arg1},
         method: "POST",
         dataType: 'json',
         success: function(result){
             if(result["answers"][0].answer == 'No good match found in KB.'){
                chat.append('<div class="quesitions"><p>Пожалуйста, сформулируйте вопрос по-другому</p></div>');
                dialogue_info.bot_sentence.push('Пожалуйста, сформулируйте вопрос по-другому')
                my_scr()
                return false;
             }

             
             for(k = 0; k < result['answers'].length; k++){
                answers_arr.push(result["answers"][k].answer); 
             }

             $.each(answers_arr, function(i, el){
                if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                });
                 
             var title_count;
             if(uniqueNames.length >= 5){
                 title_count = 5;
             }else{
                title_count = uniqueNames.length;
             }
             for(i = 0; i < title_count; i++){
                 html += '<li data-quesition-number="'+ i +'">' + (i+1)+'. '+uniqueNames[i].split('\n').shift(); +'</li>';
                 dialogue_info.bot_sentence.push(uniqueNames[i].split('\n').shift());
                 answer_text.push(uniqueNames[i]); 
             }

            uniqueNames = [];
            var dt = new Date();
            var min = dt.getUTCMinutes();
            if(min < 10){
                min = '0' + min; 
            }
            var time = (1 + dt.getMonth()) + '/' + dt.getUTCDate() + '/' + dt.getUTCFullYear() + ' ' + dt.getHours() + ':' + min;
            dialogue_info.question_time.push(time);

             html = html + '</ul></div><ul class="checkbox_quesitions">';
             for(j = 1; j <= title_count; j++){
                 html += '<li data-answer-number="'+(j-1)+'">'+j+'</li>'
             }
             html = html + '</ul></div>';
             chat.append(html);
             my_scr()
             answers_arr = [];
         }
         
     })
     
     return false;
  
 }
 
 
 $(document).on('click', '.checkbox_quesitions li', function(){
     var question;
     var number;
     var this_check_data = $(this).data('answer-number');
     $('.quesitions_list li').each(function(){
         if($(this).data('quesition-number') == this_check_data){
             question = $(this).text().split('. ').pop();
         }
     })

     $.ajax({
        url: 'https://asfnschatbotapi.azurewebsites.net/bot_request.php',
        data: {question: question},
        method: 'post',
        dataType: 'json',
        success: function(result){
            $('.webchat').append('<div class="answer">'+ result['answers'][0].answer +'</div>')
            dialogue_info.answer.push(result['answers'][0].answer);
            if(dialogue_info.question_time = []){
                var dt = new Date();
                var min = dt.getUTCMinutes();
                if(min < 10){
                min = '0' + min; 
            }
                var time = (1 + dt.getMonth()) + '/' + dt.getUTCDate() + '/' + dt.getUTCFullYear() + ' ' + dt.getHours() + ':' + min;
                dialogue_info.question_time.push(time);
            }
            my_scr()
        }
         })    
     setTimeout(function(){
        $('.webchat').append('<div class="quesitions">Удовлетворены ли вы нашим ответом на Ваш вопрос?</div><div class="yes_no_block"><ul><li>Да</li><li>Нет</li></ul></div>')
        my_scr()
        }, 4000);
 })
 
 $(document).on('click', '.yes_no_block ul li', function(){
        dialogue_info.satisfaction.push($(this).text());
        
        if(dialogue_info.bot_sentence == []){
            dialogue_info.bot_sentence = null;
            dialogue_info.user_quesition = null;
        }
        var dialogue = dialogue_info
        flag = true
      $.ajax({
         url: 'https://asfnschatbotapi.azurewebsites.net',
         data: {dialogue: dialogue},
         method: "POST",
         success: function(result){
                $('.webchat').append('<div class="quesitions"><p>Большое спасибо</p><p>Задавайте еще вопросы</p></div>')
                my_scr()
             }
             
     })
     

     dialogue_info = {
     user_quesition: [ ],
     bot_sentence: [ ],
     answer: [ ],
     satisfaction: [ ],
     partner_token: token,
     question_time: [ ]
    }
 });
 
$(window).on('beforeunload', function(){
    if(dialogue_info.user_quesition.length != 0 && flag == false){
         var dialogue = dialogue_info
         $.ajax({
         url: 'https://asfnschatbotapi.azurewebsites.net',
         data: {dialogue: dialogue},
         method: "POST",
         success: function(result){
                $('.webchat').append('<div class="quesitions"><p>Большое спосибо</p><p>Задавайте еще вопросы</p></div>')
             }
             
     })
    }
});

});
