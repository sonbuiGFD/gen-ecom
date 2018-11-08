import './home.scss';

import '../assets/css/youCover.css';
import '../assets/js/youCover';

$(document).ready(function() {
  window.app.initHomepage();
});

$(window).on('resize', function() {
  window.app.initBorder();
});
