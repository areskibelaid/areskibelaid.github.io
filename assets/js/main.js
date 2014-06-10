var $j = jQuery.noConflict();


function responsiveImages() {
  "use strict";

  $j('.post').each(function(){
    if($j(this).find('img').length){
      $j(this).find('img').addClass('responsive-image');
    }
  });

  $j('.responsive-image').responsImg({
    allowDownsize: true,
    breakpoints: {
      small: 320,
      medium: 960,
      large: 1024,
      extralarge: 1200
    }
  });
}

function formatWidth() {
  "use strict";

  var contentWidth = $j('#main').width();
  var columns = 3;
  if (contentWidth<520)
    columns = 1;
  else if(contentWidth >=520 && contentWidth<=768)
    columns = 2;
  else if(contentWidth>768 && contentWidth<=1200)
    columns = 3;
  else if(contentWidth>1200)
    columns = 4;
  var itemWidth = Math.floor((contentWidth-(0*(columns+1)))/columns);
  $j('.home-template .post').each(function(){
    $j(this).css({"width":itemWidth+"px"});
  });
}

function getMaxPagination() {
  "use strict";

  if($j('.page-number').length){
    var numberPattern = /\d+/g;
    var pageNumberStr=$j('.page-number').html();
    var result=pageNumberStr.match(numberPattern);
    if(result!=null && result.length>1){
      return result[1];
    }
    else{
      return 1;
    }
  }
}

function fitVids() {
  "use strict";

  $j(".post").fitVids();
}

function isotopeSetup() {
  "use strict";

  if($j('#main').length){
    var container = $j('#main');
    $j('article').imagesLoaded().done( function( instance ) {
      //avanteApp.formatWidth();
      container.isotope({
        itemSelector : '.post',
        filter: '*'
      });
      $j('#preloader').fadeOut('fast', function () {
        $j(this).remove();
        container.animate({ 'opacity' : 1},650,'easeInCubic');
        reloadIsotope();
      })
    });
    // filter items when filter link is clicked
    $j('.filters a').click(function () {
      var selector = $j(this).attr('data-filter');
      container.isotope({
        filter: selector,
        animationOptions: {
          duration: 1000,
          easing: 'easeOutQuart',
          queue: false
        }
      });

      // scroll to window
      $j('html, body').animate({
        scrollTop: $j(".container-wrap").offset().top
      }, 500);

      // remove dropdown
      $j('.dropdown').removeClass('dropdown');

      //active classes
      $j('.filters a').removeClass('current');
      $j(this).addClass('current');

      return false;
    });

    $j('.filters a').click(function () {
      return false;
    });
  }
}

function removenoImg() {
  "use strict";

  // remove no image on homepage
  if ($j('.featured-img img').hasClass('responsive-image')) {
    $j('.featured-img .no-img').remove();
  }
  else {
    $j('.featured-img .no-img').show();
  }
}

function infiniteScrollSetup() {
  "use strict";

  if($j('#main').length){
    var container = $j('#main');
    container.infinitescroll({
        navSelector     : '.pagination',    // selector for the paged navigation
        nextSelector    : '.pagination a',  // selector for the NEXT link (to page 2)
        itemSelector    : '.post',          // selector for all items you'll retrieve
        maxPage         : getMaxPagination(),
        loading: {
          finishedMsg: 'No more post to load.',
          img: '/assets/images/loader.gif'
        }
      },
      // call Isotope as a callback
      function( newElements ) {
        container.isotope('appended', $j(newElements),function(){
          postAnimation();
          responsiveImages();
          $j(".post").fitVids();
          reloadIsotope();
          removenoImg();
        });
      }
    );
  }
}

function reloadIsotope() {
  "use strict";

  $j('#main').isotope();
}

function featuredImage() {
  "use strict";

  var mainImage = $j('.post-template img[alt="main-image"]');

  if (mainImage.length > 0) {
    var mainImageSource = mainImage.attr('src');
    $j('.featured-image').css('background-image', 'url(' + mainImageSource + ')');
    mainImage.remove();
  }
}

function stickyMenu() {
  "use strict";

  $j('.sticky-menu').animate({ 'opacity' : 1},650,'easeInCubic');

  // Detect mobile
  if( window.innerWidth < 768 ){
    $j('body').addClass('mobile');
    $j('.icon-menu').show();
    $j('.filters').addClass('dropdown-menu');
  }
  else {
    $j('.icon-menu').hide();
    $j('.filters').removeClass('dropdown-menu');
  }

  // Filter dropdown
  var windowsize = 0;

  $j(window).resize(function() {
    windowsize = $j(window).width();
    if (windowsize < 768) {
      $j('.icon-menu').show();
    $j('.filters').addClass('dropdown-menu');

    }
    else {
      $j('.icon-menu').hide();
      $j('.filters').removeClass('dropdown-menu');
    }
  });
}

function postAnimation() {
  "use strict";

  $j('.featured-img img')
  .on( "mouseenter", function() {
    $j(this).stop().transition({ scale: 1.2 });
    $j(this).css('opacity', '1');
  })
  .on( "mouseleave", function() {
    $j(this).stop().transition({ scale: 1.1 });
    $j(this).css('opacity', '0.7');
  });
}

function bootstrapEvents() {
  "use strict";

  // social tooltip
  $j('#social-profiles li a').tooltip();
  // share popover
  $j('#pop-share').popover({
    animation:true,
    content:$j('#sharePopover').html(),
    html:true,
    placement:'bottom',
    container: '#post-menu'
  });
}

function smoothScrolling() {
  "use strict";

  function initSmoothScroll() {
    $j("html").niceScroll({
      // scrollspeed: 60,
      // mousescrollstep: 60,
      cursorwidth: 5,
      cursorborder: 0,
      cursorcolor: '#858585',
      cursorborderradius: 6,
      autohidemode: false,
      horizrailenabled: false
    });
  }

  var smoothScroll = $j('body').attr('data-smooth-scroll');
  if (smoothScroll == 1 ) {
    initSmoothScroll();
  }
}

function parallaxEffects() {
  //"use strict";

  function addShadow() {
    $j('.sticky-menu').addClass('shadow').css('border-bottom', '0');
  }

  function removeShadow() {
    $j('.sticky-menu').removeClass('shadow').css('border-bottom', '1px solid #E3E3E3');
  }
  // Parallax effect
  if($j('.heading-bg').length > 0) {

    //fadeIn
    function extractUrl(input) {
      return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
    }

    var img = new Image();
    var scrollTop;

    var imgX, imgY, aspectRatio;
    var diffX, diffY;
    var headingHeight = $j('.head-content').height();
    var headerHeight = parseInt($j('.heading-bg').attr('data-height'));

    img.onload = function() {

      // Header
      if ( $j('.centered').hasClass( "no-bg" ) ) {
        $j('.no-bg').css('margin-top', '0');
      }

      $j('#header .heading-bg').css({'top': '0px' });
      $j('#header .heading-bg').animate({ 'opacity' : 1},650,'easeInCubic');

      $j('#header, #header .head-content').css({'height' : headerHeight});

      $j('#header .head-content').css({
        'opacity' : 1-(scrollTop/(headerHeight-($j('#header .head-content').height()*2)+60)),
        'top' : ((headerHeight/2) - (headingHeight/2)) +10 +"px"
      });

      //sticky menu
      stickyMenu();
    }

    img.src = extractUrl($j('#header .heading-bg').css('background-image'));

    // Scroll effect
    $j(window).scroll(function(){

      var scrollTop = $j(window).scrollTop();
      var headingHeight = $j('.head-content').height();
      var headerHeight = $j('#header').height();

      //if(!$j('body').hasClass('mobile') && navigator.userAgent.match(/iPad/i) == null){

        $j('#header .heading-bg').transition({ y: $j(window).scrollTop()*-.2 },0);

        $j('.centered').css({
          'opacity' : 1-(scrollTop/(headingHeight-($j('.centered').height()*2)+400))
        });

        $j('#header .head-content').stop(true,true).transition({ y: $j(window).scrollTop()*-.14 },0);

        //hide elements to allow other parallax sections to work in webkit browsers
        if( (scrollTop / (headerHeight)) > 1 ) {
          $j('#header .heading-bg').css('visibility','hidden').hide();
        }
        else {
          $j('#header .heading-bg').css('visibility','visible').show();
        }
      //}

      //sticky menu
      if((scrollTop) >= headerHeight ) {
        $j('.sticky-menu').affix({
          offset: {
            top: function () {
              return (this.top = $j('#header').height())
            }
          }
        });

        $j('.affix').css({'top': headingHeight - headingHeight});
        addShadow();

      } else {
        $j('.sticky-menu').removeClass('affix');
        removeShadow();
      }
    });
  }

  if($j('.featured-image').length > 0) {

    //fadeIn
    function extractUrl(input) {
      return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
    }

    var img = new Image();
    var scrollTop;

    var imgX, imgY, aspectRatio;
    var diffX, diffY;
    var postheaderHeight = parseInt($j('.featured-image').attr('data-height'));

    img.onload = function() {

      $j('.featured-image').css({'top': '0px' });
      $j('.featured-image').animate({ 'opacity' : 1},650,'easeInCubic');

      $j('.featured-image-wrap, .featured-image').css({'height' : postheaderHeight});

      //sticky menu
      stickyMenu();
    }

    img.src = extractUrl($j('.featured-image').css('background-image'));

    // Scroll effect
    $j(window).scroll(function(){

      var scrollTop = $j(window).scrollTop();

      //if(!$j('body').hasClass('mobile') && navigator.userAgent.match(/iPad/i) == null){
        $j('.featured-image').transition({ y: $j(window).scrollTop()*-.2 },0);
      //}

      // sticky menu
      if((scrollTop) >= postheaderHeight ) {
        $j('.sticky-menu').affix({
          offset: {
            top: function () {
              return (this.top = $j('.featured-image').height())
            }
          }
        });

        $j('.affix').css({'top': postheaderHeight - postheaderHeight});
        addShadow();

      } else {
        $j('.sticky-menu').removeClass('affix');
        removeShadow();
      }
    });
  }
}

function pushMenu() {
  "use strict";

  var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
      showLeft = document.getElementById( 'showLeft' ),
      body = document.body;

  showLeft.onclick = function() {
    classie.toggle( this, 'active' );
    classie.toggle( menuLeft, 'cbp-spmenu-open' );
    //disableOther( 'showLeft' );
  };
}

function misc() {
  "use strict";

  // Header no bg
  var headingHeight = $j('.head-content').height();
  var headerHeight = parseInt($j('.heading-bg').attr('data-height'));

  $j('#header').css({'height' : headerHeight});
  $j('#header .head-content').addClass('animated fadeIn');
  $j('#header h1').addClass('animated pulse');
  $j('#header .centered').addClass('no-bg');
  if ( $j('.blog-logo').hasClass( "blog-logo" ) ) {
    $j('#header .blog-title').css('margin-top', '20px');
  }
  $j('#header .no-bg').css({
    'margin-top' : ((headerHeight/2) - (headingHeight/2)) +"px"
  })

  stickyMenu();

  // back to to top click event
  $j('#go-up').click(function () {
    $j("html, body").animate({scrollTop: 0}, 800);
    return false;
  });

  // anchor scroll
  $j(function() {
    $j('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $j(this.hash);
        target = target.length ? target : $j('[id=' + this.hash.slice(1) +']');
        if (target.length) {
          $j('html,body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });

  // sticky shadow menu
  $j('#post-menu .content-nav a').click(function(){
    //console.log('heelo');
    $j('.shadow .content-nav a').removeClass('current');
    $j(this).addClass('current');
  });
  // single post
  $j('.post-template .post-content img').animate({ 'opacity' : 1},650,'easeInCubic');
}
/*================================================================*/
/*  Let's initialize shall we?
/*================================================================*/
$j(document).ready(function() {
  "use strict";

  responsiveImages();
  formatWidth();
  fitVids();
  isotopeSetup();
  infiniteScrollSetup();
  featuredImage();
  postAnimation();
  bootstrapEvents();
  smoothScrolling();
  parallaxEffects();
  pushMenu();
  removenoImg();
  misc();

  //$j('#loading').remove();

  $j('#wrap').animate({
    opacity: 1
  }, 600);
});

$j(window).load(function(){
  "use strict";

  reloadIsotope();
});