$(function(){
  
  $(window).on('scroll', function(){
    if($(window).scrollTop() > 5){
      $('header').addClass('shrink');
    } else {
      $('header').removeClass('shrink');
    }
  })
})