/*================================================================*/
/*  Do magical stuff
/*================================================================*/
var avanteApp={
  responsiveImages:function(){
    $('.post').each(function(){
      if($(this).find('img').length){
        $(this).find('img').addClass('responsive-image');
      }
    });

    $('.responsive-image').responsImg({
      allowDownsize: true,
      breakpoints: {
        small: 320,
        medium: 960,
        large: 1024,
        extralarge: 1200
      }
    });
  },
  formatWidth: function(){
    var contentWidth = $('#main').width();
    var columns = 3;
    if (contentWidth<520)
      columns = 1;
    else if(contentWidth >=520 && contentWidth<=768)
      columns = 2;
    else if(contentWidth>768 && contentWidth<=1200)
      columns = 3;
    else if(contentWidth>1200)
      columns = 4;
    var itemWidth = Math.floor((contentWidth-(20*(columns+1)))/columns);
    $('.home-template .post').each(function(){
      $(this).css({"width":itemWidth+"px"});
    });
  },
  getMaxPagination:function(){
    if($('.page-number').length){
      var numberPattern = /\d+/g;
      var pageNumberStr=$('.page-number').html();
      var result=pageNumberStr.match(numberPattern);
      if(result!=null && result.length>1){
        return result[1];
      }
      else{
        return 1;
      }
    }
  },
  fitVids:function(){
    $(".post").fitVids();
  },
  isotopeSetup:function(){
  	if($('#main').length){
      var $container = $('#main');
      $('article').imagesLoaded().done( function( instance ) {
        //avanteApp.formatWidth();
        $container.isotope({
          itemSelector : '.post',
          filter: '*'
        });
        $('#preloader').fadeOut('fast', function () {
          $(this).remove();
          $container.animate({ 'opacity' : 1},650,'easeInCubic');
          avanteApp.reloadIsotope();
        })
      });
	    // filter items when filter link is clicked
	    $('.filters a').click(function () {
	      var selector = $(this).attr('data-filter');
	      $container.isotope({
	        filter: selector,
	        animationOptions: {
	          duration: 1000,
	          easing: 'easeOutQuart',
	          queue: false
	        }
	      });

	      // scroll to window
	      $('html, body').animate({
	        scrollTop: $(".container-wrap").offset().top
	    	}, 500);

	      // remove dropdown
	      ('.dropdown').removeClass('dropdown');

	      //active classes
	      $('.filters a').removeClass('current');
	      $(this).addClass('current');

	      return false;
	    });

	    $('.filters a').click(function () {
	      return false;
	    });
    }
  },
  infiniteScrollSetup:function(){
    if($('#main').length){
      var $container = $('#main');
      $container.infinitescroll({
          navSelector     : '.pagination',    // selector for the paged navigation
          nextSelector    : '.pagination a',  // selector for the NEXT link (to page 2)
          itemSelector    : '.post',          // selector for all items you'll retrieve
          maxPage         : avanteApp.getMaxPagination(),
          loading: {
            finishedMsg: 'No more post to load.',
            img: '/assets/images/loader.gif'
          }
        },
        // call Isotope as a callback
        function( newElements ) {
          $container.isotope('appended', $(newElements),function(){
          	avanteApp.postAnimation();
            avanteApp.responsiveImages();
            $(".post").fitVids();
            avanteApp.reloadIsotope();
          });
        }
      );
    }
  },
  reloadIsotope:function(){
  	//avanteApp.formatWidth();
    $('#main').isotope();
  },
  featuredImage:function(){
    var $mainImage = $('.post-template img[alt="main-image"]');

    if ($mainImage.length > 0) {
      var $mainImageSource = $mainImage.attr('src');
      $('.featured-image').css('background-image', 'url(' + $mainImageSource + ')');
      $mainImage.remove();
    }
  },
  stickyMenu:function(){
    $('.sticky-menu').animate({ 'opacity' : 1},650,'easeInCubic');

    // Detect mobile
    if( window.innerWidth < 768 ){
      $('body').addClass('mobile');
      $('.icon-menu').show();
      $('.filters').addClass('dropdown-menu');
    }
    else {
      $('.icon-menu').hide();
      $('.filters').removeClass('dropdown-menu');
    }

    // Filter dropdown
    var windowsize = 0;

    $(window).resize(function() {
      windowsize = $(window).width();
      if (windowsize < 768) {
        $('.icon-menu').show();
      $('.filters').addClass('dropdown-menu');

      }
      else {
        $('.icon-menu').hide();
        $('.filters').removeClass('dropdown-menu');
      }
    });
  },
  postAnimation:function(){
    $('.featured-img img')
    .on( "mouseenter", function() {
      $(this).stop().transition({ scale: 1.2 });
      $(this).css('opacity', '1');
    })
    .on( "mouseleave", function() {
      $(this).stop().transition({ scale: 1.1 });
      $(this).css('opacity', '0.7');
    });
  },
  bootstrapEvents:function(){
    // social tooltip
    $('#social-profiles li a').tooltip();
    // share popover
    $('#pop-share').popover({
    	animation:true,
    	content:$('#sharePopover').html(),
    	html:true,
    	placement:'bottom',
    	container: '#post-menu'
    });
  },
  smoothScrolling:function(){
    // Smooth Scroll
    function initSmoothScroll() {
      $("html").niceScroll({
        scrollspeed: 60,
        mousescrollstep: 60,
        cursorwidth: 5,
        cursorborder: 0,
        cursorcolor: '#858585',
        cursorborderradius: 6,
        autohidemode: false,
        horizrailenabled: false
      });
    }

    var $smoothScroll = $('body').attr('data-smooth-scroll');
    if ($smoothScroll == 1 && $(window).width() > 690) {
      initSmoothScroll();
    }
  },
  parallaxEffects:function(){
    function addShadow() {
      $('.sticky-menu').addClass('shadow').css('border-bottom', '0');
    }

    function removeShadow() {
      $('.sticky-menu').removeClass('shadow').css('border-bottom', '1px solid #E3E3E3');
    }
    // Parallax effect
    if($('.heading-bg').length > 0) {

      //fadeIn
      function extractUrl(input) {
        return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
      }

      var img = new Image();
      var $scrollTop;

      var imgX, imgY, aspectRatio;
      var diffX, diffY;
      var headingHeight = $('.head-content').height();
      var headerHeight = parseInt($('.heading-bg').attr('data-height'));

      img.onload = function() {

        // Header
        if ( $('.centered').hasClass( "no-bg" ) ) {
		      $('.no-bg').css('margin-top', '0');
		    }

        $('#header .heading-bg').css({'top': '0px' });
        $('#header .heading-bg').animate({ 'opacity' : 1},650,'easeInCubic');

        $('#header, #header .head-content').css({'height' : headerHeight});

        $('#header .head-content').css({
          'opacity' : 1-($scrollTop/(headerHeight-($('#header .head-content').height()*2)+60)),
          'top' : ((headerHeight/2) - (headingHeight/2)) +10 +"px"
        });

        //sticky menu
        avanteApp.stickyMenu();
      }

      img.src = extractUrl($('#header .heading-bg').css('background-image'));

      // Scroll effect
      $(window).scroll(function(){

        var $scrollTop = $(window).scrollTop();
        var headingHeight = $('.head-content').height();
        var headerHeight = $('#header').height();

        //if(!$('body').hasClass('mobile') && navigator.userAgent.match(/iPad/i) == null){

          $('#header .heading-bg').transition({ y: $(window).scrollTop()*-.2 },0);

          $('.centered').css({
            'opacity' : 1-($scrollTop/(headingHeight-($('.centered').height()*2)+400))
          });

          $('#header .head-content').stop(true,true).transition({ y: $(window).scrollTop()*-.14 },0);

          //hide elements to allow other parallax sections to work in webkit browsers
          if( ($scrollTop / (headerHeight)) > 1 ) {
            $('#header .heading-bg').css('visibility','hidden').hide();
          }
          else {
            $('#header .heading-bg').css('visibility','visible').show();
          }
        //}

        //sticky menu
        if(($scrollTop) >= headerHeight ) {
          $('.sticky-menu').affix({
            offset: {
              top: function () {
                return (this.top = $('#header').height())
              }
            }
          });

          $('.affix').css({'top': headingHeight - headingHeight});
          addShadow();

        } else {
          $('.sticky-menu').removeClass('affix');
          removeShadow();
        }
      });
    }

    if($('.featured-image').length > 0) {

      //fadeIn
      function extractUrl(input) {
        return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
      }

      var img = new Image();
      var $scrollTop;

      var imgX, imgY, aspectRatio;
      var diffX, diffY;
      var postheaderHeight = parseInt($('.featured-image').attr('data-height'));

      img.onload = function() {

        $('.featured-image').css({'top': '0px' });
        $('.featured-image').animate({ 'opacity' : 1},650,'easeInCubic');

        $('.featured-image-wrap, .featured-image').css({'height' : postheaderHeight});

        //sticky menu
        avanteApp.stickyMenu();
      }

      img.src = extractUrl($('.featured-image').css('background-image'));

      // Scroll effect
      $(window).scroll(function(){

        var $scrollTop = $(window).scrollTop();

        //if(!$('body').hasClass('mobile') && navigator.userAgent.match(/iPad/i) == null){
          $('.featured-image').transition({ y: $(window).scrollTop()*-.2 },0);
        //}

        // sticky menu
        if(($scrollTop) >= postheaderHeight ) {
          $('.sticky-menu').affix({
            offset: {
              top: function () {
                return (this.top = $('.featured-image').height())
              }
            }
          });

          $('.affix').css({'top': postheaderHeight - postheaderHeight});
          addShadow();

        } else {
          $('.sticky-menu').removeClass('affix');
          removeShadow();
        }
      });
    }
  },
  pushMenu: function() {
    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft = document.getElementById( 'showLeft' ),
        body = document.body;

    showLeft.onclick = function() {
      classie.toggle( this, 'active' );
      classie.toggle( menuLeft, 'cbp-spmenu-open' );
      disableOther( 'showLeft' );
    };
  },
  misc:function(){
  	// Header no bg
  	var headingHeight = $('.head-content').height();
    var headerHeight = parseInt($('.heading-bg').attr('data-height'));

    $('#header').css({'height' : headerHeight});
  	$('#header .head-content').addClass('animated fadeIn');
    $('#header h1').addClass('animated pulse');
    $('#header .centered').addClass('no-bg');
    if ( $('.blog-logo').hasClass( "blog-logo" ) ) {
      $('#header .blog-title').css('margin-top', '20px');
    }
    $('#header .no-bg').css({
    	'margin-top' : ((headerHeight/2) - (headingHeight/2)) +"px"
    })

    avanteApp.stickyMenu();

    // remove no image on homepage
    if ($('.featured-img p img').hasClass('responsive-image')) {
    	$('.featured-img .no-img').remove();
    }
    else {
    	$('.featured-img .no-img').show();
    }


    // back to to top click event
    $('#go-up').click(function () {
      $("html, body").animate({scrollTop: 0}, 800);
      return false;
    });

    // anchor scroll
    $(function() {
      $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[id=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
          }
        }
      });
    });

    // sticky shadow menu
    $('#post-menu .content-nav a').click(function(){
    	//console.log('heelo');
      $('.shadow .content-nav a').removeClass('current');
      $(this).addClass('current');
    });
    // single post
    $('.post-template .post-content img').animate({ 'opacity' : 1},650,'easeInCubic');
  },
  init: function () {
    //$('.home-template').append('<div id="preloader"></div>');
    avanteApp.responsiveImages();
    avanteApp.postAnimation();
    avanteApp.fitVids();
    avanteApp.isotopeSetup();
    avanteApp.infiniteScrollSetup();
    avanteApp.featuredImage();
    avanteApp.bootstrapEvents();
    avanteApp.smoothScrolling();
    avanteApp.parallaxEffects();
    avanteApp.pushMenu();
    avanteApp.misc();
    //avanteApp.scrollEvent();
  }
};

/*================================================================*/
/*  Let's initialize shall we?
/*================================================================*/
$(document).ready(function() {
  avanteApp.init();
});

$(window).load(function(){
  avanteApp.reloadIsotope();
});