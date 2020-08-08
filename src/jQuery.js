
$(document).mouseup(function(e) {
  //Remove pop up when user click on X
  $(".ol-popup-closer").click(function() {
    $(this).parent().parent().remove();
    resetView();
  })
  $(".ol-popup").click(function() {
      var content = $(".ol-popup-content");
      var name = $(this).find(content).html().split("<br>")[0];
      openArchitectureWindow(name);
  })
  //Remove search rersult when click out of search bar
  var input =  $("#searchInput");
  var result = $(".result");
  if (!input.is(e.target) && input.has(e.targer).length === 0 && !result.is(e.target) && result.has(e.target).length === 0){
      var elem =  $(".result");
      var i;
      for (i = 0; i < elem.length; i++) {
          $(elem[i]).remove();
      }
  }
})
