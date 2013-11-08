$(document).ready(function() {
  $('.account-login').on('shown.bs.dropdown', function() {
    setTimeout(function() {
      $('input[name="username"]').focus();
    }, 0);
  });

  $('.account-login-dropdown').click(function(e) {
    e.stopPropagation();
  });
});
