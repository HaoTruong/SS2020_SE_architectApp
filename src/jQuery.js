$(document).mouseup(function(e) {
  //Remove pop up when user click on X
  $(".ol-popup-closer").click(function() {
    $(this).parent().parent().remove();
  })
  //Remove search rersult when click out of search bar
  var input =  $("#searchInput");
  if (!input.is(e.target) && input.has(e.targer).length === 0){
      var elem =  $(".result");
      var i;
      for (i = 0; i < elem.length; i++) {
          $(elem[i]).remove();
      }
  }
})