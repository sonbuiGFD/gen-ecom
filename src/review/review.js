import './review.scss';

import '../assets/css/youCover.css';
import '../assets/js/youCover';

$(document).ready(function() {
  window.app.initReview();
  // Event change price
});

$(window).on('resize', function() {
  window.app.initReview();
});
