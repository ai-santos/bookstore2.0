$(function(){
  $('#new-author').on('click', function(e){
    event.preventDefault()
    $('.author-name-hide').removeClass('author-name-hide');
  })

  $('#new-genre').on('click', function(e){
    event.preventDefault()
    $('.genre-name-hide').removeClass('genre-name-hide');
  })
})