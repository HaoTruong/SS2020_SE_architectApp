
//Remove pop up when user click on X
$(document).ready(function() {
    $(".ol-popup-closer").click(function() {
      $(this).parent().parent().remove();
    })
  })
