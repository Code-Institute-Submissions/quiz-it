// Change border of form input when clicked
$(document).ready(function () {
  $(function () {
    $('.input-with-icon').on('click', function () {
      $('.icon-wrap').toggleClass('iconWrapBorderColor');
    });
  });
});
