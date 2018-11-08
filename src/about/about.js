import './about.scss';

$(document).ready(function() {
  window.app.initAboutPage();
  $('a[data-link="about"]').addClass('active');
});
