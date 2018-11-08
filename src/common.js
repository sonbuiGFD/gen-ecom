// Import your code here
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/reset.scss';
import './assets/css/ultil.scss';
import './assets/css/slick.css';

// block css
import './assets/css/header.scss';
import './assets/css/footer.scss';
import './assets/css/pagination.scss';
import './assets/css/product-item.scss';
import './assets/css/breadcrumb.scss';

// js
import 'jquery';
import 'bootstrap';
import './assets/js/slick.min';

class Fantasy {
  constructor() {
    this.initHomepage = this.initHomepage.bind(this);
    this.initMainSlider = this.initMainSlider.bind(this);
    this.initProductSlideShow = this.initProductSlideShow.bind(this);
    this.initBorder = this.initBorder.bind(this);
    this.initProductPage = this.initProductPage.bind(this);
    this.initProductCarousel = this.initProductCarousel.bind(this);
    this.initSearchHeader = this.initSearchHeader.bind(this);
    this.initProductChangeVariant = this.initProductChangeVariant.bind(this);
    this.initProductChangeImage = this.initProductChangeImage.bind(this);
    this.initAboutPage = this.initAboutPage.bind(this);
  }
  // global
  initSearchHeader() {
    const mainav = $('#mainav');
    const searchForm = mainav.find('.header-search');
    const searchInput = mainav.find('.header-search_input');
    const triggerBtn = mainav.find('.nav-item_trigger');
    const searchBtn = mainav.find('.header-search_btn');

    searchBtn.click(function(e) {
      mainav.toggleClass('showSearch');
      searchInput.focus();
      e.stopPropagation();
    });

    searchForm.click(function(e) {
      e.stopPropagation();
      // mainav.toggleClass("showSearch");
    });
    triggerBtn.on('click', function() {
      $(this)
        .parent('.nav-item')
        .find('.nav-item_child')
        .slideToggle();
    });

    $(document).click(function() {
      // searchInput.blur();
      mainav.removeClass('showSearch');
    });
  }

  // home page
  initHomepage() {
    this.initMainSlider();
    this.initProductSlideShow();
    this.initBorder();
  }

  initMainSlider() {
    $('.main-slider .main-slider-wrapper').slick({
      dots: true,
      infinite: true,
      autoplay: true,
      arrows: false,
      speed: 500,
    });
  }

  initProductSlideShow() {
    $('.product-slideshow .slideshow_content').slick({
      dots: false,
      autoplay: false,
      arrows: true,
      speed: 500,
      slidesToShow: 4,
      nextArrow:
        '<button type="button" class="slick-prev"><img src="https://fantasy.steenify.com/wp-content/themes/fantasy/app/src/assets/img/next.svg" alt="next" /></button>',
      prevArrow:
        '<button type="button" class="slick-next"><img src="https://fantasy.steenify.com/wp-content/themes/fantasy/app/src/assets/img/next.svg" alt="next" /></button>',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    });
  }

  initBorder() {
    var $topBox = $('.top_box'),
      $botBox = $('.bot_box');
    var w = $(window).width();
    $topBox.css('border-right-width', w);
    $botBox.css('border-left-width', w);
  }

  // product page
  initProductPage() {
    this.initProductCarousel();
    this.initProductChangeVariant();
    this.initProductChangeImage();
  }

  initProductCarousel() {
    $('.product-images_carousel').slick({
      dots: true,
      autoplay: false,
      arrows: false,
      slidesToShow: 3,
      appendDots: $('.product-images_carousel_paging'),
    });
  }

  initProductChangeVariant() {
    $('.product-variants a').on('click', function(e) {
      e.preventDefault();
      $('.product-variants a.active').removeClass('active');
      const price = $(this).attr('data-price') || 0;
      $(this).addClass('active');
      const priceEl = $('.product-price span');
      if (priceEl) {
        priceEl.html(parseInt(price).format());
      }
    });
    $('.product-variants a:first').click();
  }

  initProductChangeImage() {
    const productImgs = $('.product-page-images');
    const imgMain = productImgs.find('.product-images-main_img');
    const imgThumb = productImgs.find('.product-images_carousel_item_img');
    imgThumb.on('click', function() {
      const src = $(this).data('src');
      imgMain.attr('src', src);
    });
  }

  // page about
  initAboutPage() {
    $('.about-product-list').slick({
      dots: false,
      autoplay: false,
      arrows: true,
      speed: 500,
      slidesToShow: 2,
      nextArrow:
        '<button type="button" class="slick-prev"><img src="https://fantasy.steenify.com/wp-content/themes/fantasy/app/src/assets/img/next.svg" alt="next" /></button>',
      prevArrow:
        '<button type="button" class="slick-next"><img src="https://fantasy.steenify.com/wp-content/themes/fantasy/app/src/assets/img/next.svg" alt="next" /></button>',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }

  // page reivew

  initReview() {
    var $topBoxRight = $('.top_box_right'),
      $topBoxLeft = $('.top_box_left'),
      $botBoxLeft = $('.bot_box_left'),
      $botBoxRight = $('.bot_box_right');
    var w = $(window).width();
    $topBoxRight.css('border-right-width', w);
    $topBoxLeft.css('border-left-width', w);
    $botBoxRight.css('border-right-width', w);
    $botBoxLeft.css('border-left-width', w);
  }
}

const app = new Fantasy();
window.app = app;

Number.prototype.format = function(n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
};
$(document).ready(function() {
  app.initSearchHeader();
});
