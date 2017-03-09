/*!
 * WEIGELSTEIN
 *
 * @name			   slick.js
 * @desc			   various slick-slider configurations
 *
 * @client			tba.
 * @author 			Ansgar Hiller <ansgar@weigelstein.de>
 * @since			01-2017
*/

// weigelstein namespace
var WS = WS || {},
	APP;

jQuery(document).ready(function ($) { 'use strict';

   var BODY = $('body'),
		 HTML = $('html'),
       PAGE	 = $('.page');

	$(window).on('application-start', function(e,app) {
		APP = app;
      WS.AJAX.ready = true;
   });

   $(window).on('delayed-resize', function(e,app) {
      if (WS.AJAX.ready) {
         WS.AJAX.LIGHTROOM.update( WS.AJAX.LIGHTROOM );
      }
   });

   WS.AJAX = {

      ready: false,

      /* ===================================================== */
      /* 	Simple Ajax-loader
      /* ===================================================== */

      load: function (url,options)
		{
			options = options || {};
			var opt = {
					// params
					dataType: 	options.dataType	|| 'html',
					method: 	   options.method 	|| 'GET',

					// callbacks
					onSuccess: 	options.onSuccess || null,
					onError:    options.onError	|| null
				};
			$.extend( opt, options );

         /* generic callbacks */
         var events   = $.Callbacks();

         var dispatch = function (fn,params,string )
         {
            if ( typeof fn === 'function' ) {
               events
                  .add(fn)
                  .fire(params,string )
                  .remove(fn);
            }
         };

			/* AJAX */
			try {
				$.ajax({
					url: url,
					dataType: opt.dataType,
					type : opt.method,
					processData: false,
					contentType: false,
					success: function(data){
						dispatch( opt.onSuccess, data, 'success');
					},
					error: function(data) {
					   dispatch( opt.onError, data, 'error');
					}
				});
			} catch (e) {
            // console.log(e);
         }
		},

      /* ===================================================== */
      /*    LIGHTROOM-SLIDER
      /*
      /*    Slider-like-navigation (slick.js) among articles of a
      /*    category displayed in a modal-layer.
      /*    for templates:
      /*    -  article  -> lightroom.php,
      /*    -  category -> flexblog.php
      /*    -  category -> flexblog-item.php
      /* ===================================================== */

      LIGHTROOM : {

         MODAL:         false,
         MODAL_READY:   false,

         SLIDER:        false,
         SLIDER_READY:  false,
         SLIDER_HTML:   '<div class="slick">' +
                          '<div class="slide slide-current" />' +
                        '</div>',

         DATA:          null,

         initialSlide: 1,
         load: false,
         direction: null,
         total: 3,
         linkLevelUp: false,
         imgMaxW: '100%',
         imgMaxH: 0,
         active: false,
         lastScrollTop: false,
         slideId: false,

         /* ===================================================== */
         /* 	INIT LIGHTROOM
         /* ===================================================== */
         init: function(url, view)
         {
            // console.log('WS.AJAX.LIGHTROOM.init');
            if ( url === undefined ) return false;

            var _view = view || 'blog';

            var _that = this;

            this.DATA = [];

            if (!this.MODAL) {
               if ($('#fullscreenslider').length) {
                  this.MODAL = $('#fullscreenslider');
               } else {
                  return false;
               }
            }

            if (!this.SLIDER) {
               this.SLIDER = $(this.SLIDER_HTML);
            }

            var _SLIDER = this.SLIDER,
                _MODAL = this.MODAL;

            // SLIDER EVENTS
            _SLIDER
               .on('init', function(event, slick)
               {
                  _that.SLIDER_READY = true;
                  _that.update(_that);

                  _that.slideId = $(slick.$slides[_that.initialSlide])
                     .attr('id');

                  _that.initIcons(_that.slideId);
               })
               .on('setPosition', function( event, slick, direction)
               {
                  _that.update(_that);

               })
               .on('beforeChange', function(event, slick, currentSlide, nextSlide)
               {
                  // console.log('beforeChange');
                  _that.direction = (nextSlide > currentSlide) ? 'next' : 'prev';
                  _that.total = $(slick.$slides).length;

                  _that.slideId = $(slick.$slides[nextSlide])
                     .attr('id');

                  _that.MODAL.find('.modal-footer .inner').empty();

                  // console.log(_that.DATA[_that.slideId]);

                  // 'true', if a new slide needs to get loaded on 'afterChange'
                  _that.load = (nextSlide >= (_that.total-1) || nextSlide <= 0);

                  // disable arrow buttons while animating and/or slide is loading in case of user with a "click-fit"
                  _SLIDER.find('button.slick-' + _that.direction).attr({ disabled :true });

                  // update slides & images
                  _that.update(_that);

               })
               .on('swipe', function(event, slick, direction)
               {
                  _that.direction = (direction === 'left') ? 'next' : 'prev';

                  _SLIDER.slick('slickSetOption','swipe',false);

                  _that.update(_that);
               })
               .on('afterChange', function(event, slick, currentSlide)
               {
                  _that.initIcons(_that.slideId);

                  // console.log('afterChange');
                  _that.nextSlideUrl = $(slick.$slides[currentSlide])
                     .find('.slide-content')
                     .data(_that.direction) || false;

                  if (_that.load && _that.nextSlideUrl)
                  {
                     // load next slide if necessary
                     WS.AJAX.LIGHTROOM.getSlide(_that.nextSlideUrl, {slide : _that.direction});
                  } else {

                     // re-enable arrow button if no loading needs to be performed
                     _SLIDER.find('button.slick-' + _that.direction).attr({ disabled :false });

                     if (isMobile)
                     {  // re-enable swipe on mobile
                        _SLIDER.slick('slickSetOption','swipe',true);
                     }
                  }
               })
               .on('lazyLoaded', function(event,slick,image,imageSource) { /* console.log(event); */ })
               .on('destroy',    function(event) { /* console.log(event); */ });

            // APPEND SLIDER TO MODAL
            _MODAL
               .find('.modal-body > .inner')
               .empty()
               .append(_SLIDER);

            // MODAL EVENTS
            _MODAL
               .on('show.bs.modal', function()
               {
                  _that.MODAL_READY = true;
                  BODY.addClass('fullscreenmodal-open');
               })
               .on('shown.bs.modal', function()
               {
                  if (isMobile) {
                  // if (true) {
                     _that.lastScrollTop = $(window).scrollTop();
                     PAGE.css({ maxHeight: 0, overflow: 'hidden' });
                  }
                  // INIT SLIDER
                  _SLIDER.slick({
                     dots: false,
                     lazyLoad: 'progressive',
                     touchMove: true,
                     swipe: isMobile,
                     arrows: !isMobile,
                     touchThreshold: 10,
                     infinite: false,
                     speed: 300,
                     slidesToShow: 1,
                     initialSlide: _that.initialSlide,
                     autoplay: false,
                     autoplaySpeed: 5000,
                     fade: false,
                     cssEase: 'ease-in-out'
                  });
                  _SLIDER.slick('setPosition');
               })
               .on('hide.bs.modal', function() {
                  if (_view === 'article') {
                     openURL( _that.linkLevelUp );
                     return false;
                  }
                  WS.AJAX.LIGHTROOM.active = false;
               })
               .on('hidden.bs.modal', function() {

                  // DESTROY EVERETHING
                  _SLIDER.slick('unslick');
                  $(this).find('.modal-body > .inner').empty();
                  $(window).off('slide-loaded');

                  BODY.removeClass('fullscreenmodal-open');
                  WS.AJAX.LIGHTROOM.SLIDER_READY = false;
                  WS.AJAX.LIGHTROOM.MODAL_READY  = false;
                  WS.AJAX.LIGHTROOM.SLIDER       = false;

                  if (isMobile) {
                  // if (true) {
                     PAGE.css({ maxHeight: 'none', overflow: 'auto' });
                     WS.FX.to(_that.lastScrollTop);
                  }
               });

            var _num = 0;

            $(window).on('slide-loaded', function(e, result) {

               _that.linkLevelUp = result.up;

               _that.DATA[result.id] = result;

               if (!_that.SLIDER_READY)
               {
                  // SLIDER not yet initialized
                  _SLIDER
                     .find('.slide-' + result.slide)
                     .attr({ id: result.id })
                     .append(result.content);

                  if (_num == 0) {

                     if (result.next !== null) {
                        var _slide = $('<div class="slide slide-next" />"').attr({ id: result.id });
                        _slide.appendTo(_SLIDER);
                        WS.AJAX.LIGHTROOM.getSlide(result.next,{slide:'next'});
                     } else {
                        _num++;
                     }

                     if (result.prev !== null) {
                        _that.initialSlide = 1;
                        var _slide = $('<div class="slide slide-prev" />"').attr({ id: result.id });
                        _slide.prependTo(_SLIDER);
                        WS.AJAX.LIGHTROOM.getSlide(result.prev,{slide:'prev'});
                     } else {
                        _num++;
                        _that.initialSlide = 0;
                     }
                  }

                  if (_num == 2) {
                     if (!_that.MODAL_READY) { _MODAL.modal('show'); } // -> this also inits the 'slick-slider' (on event: 'shown.bs.modal')
                  } else {
                     _num++;
                  }

               } else {

                  // SLIDER is initialized
                  // Create new slide
                  var _newSlide = $('<div class="slide slide-' + result.slide + '" ></div>').attr({ id: result.id });
                  _newSlide.append(result.content);

                  // Add new slide
                  _SLIDER.slick('slickAdd',_newSlide,undefined,(result.slide === 'prev'));

                  // Prevent Slick-Slider "bug" causing the slider to skip a slide,
                  // when a new slide gets added at index 0 (when clicking '.slick-previous')
                  if (result.slide === 'prev') {
                     _SLIDER.slick('slickGoTo', 1, true);
                  }

                  if (isMobile) {
                     _SLIDER.slick('slickSetOption','swipe',true);
                  }
               }

               WS.Images.swapImagesByBreakpoint(_SLIDER.find('.slide-' + result.slide + ' .figure-img'));

               _SLIDER.find('.slide-' + result.slide).removeClass('slide-' + result.slide);

               // re-enable arrow button when loading is done and slide is available
               _SLIDER.find('button.slick-' + result.slide).attr({ disabled :false });
         	});

            // load the triggered slide
            if (_view === 'blog')
            {
               // WHEN TRIGGERED FROM BLOG-VIEW
               this.getSlide(url, {slide:'current'});
            } else {

               // WHEN TRIGGERED FROM ARTICLE-VIEW
               var _slide  = $('.lightroom-slide > .slide-content') || false,
                   _icons  = $('.lightroom-slider > .share-icons') || false,
                   _id     = _slide.parent().attr('id'),

                   result = {
                     slide:    'current',
                     prev:     _slide.data('prev')    || null,
                     next:     _slide.data('next')    || null,
                     up:       _slide.data('up')      || null,
                     id:       _id,
                     content:  _slide,
                     footer:   _icons
                   };
               $(window).trigger('slide-loaded',[result]);
            }
         },

         /* ===================================================== */
         /* 	LOAD A LIGHTROOM SLIDE
         /* ===================================================== */

         getSlide: function( url, options )
         {
            // console.log('WS.AJAX.LIGHTROOM.getSlide');
            options = options || {};
   			var _that = this,
               opt = {
                  slide: options.slide || 'current'
   				};
   			$.extend( opt, options );

            WS.AJAX.load( url, {
               onSuccess: function(data)
               {
                  var _slide  = $(data).find('.lightroom-slide > .slide-content') || false,
                      _icons  = $(data).find('.lightroom-slider > .share-icons') || false,
                      _id     = _slide.parent().attr('id'),

                      result = {
                        slide:    opt.slide,
                        prev:     _slide.data('prev')    || null,
                        next:     _slide.data('next')    || null,
                        up:       _slide.data('up')      || null,
                        id:       _id,
                        content:  _slide,
                        footer:   _icons
                      };
                  $(window).trigger('slide-loaded',[result]);
               }
            });
         },

         initIcons: function(id) {

            var _icons = this.DATA[id].footer;

            this.MODAL
               .find('.modal-footer > .inner')
               .empty()
               .append(_icons);

            WS.SHARE.init(_icons);

            _icons.addClass('show');
         },

         /* ===================================================== */
         /* 	UPDATE
         /* ===================================================== */

         update: function( scope )
         {
            // console.log('WS.AJAX.LIGHTROOM.update');
            if (scope.SLIDER_READY)
            {
               var __img   = scope.SLIDER.find('.figure-img') || false;

               if (!__img) return false;

               __img.each(function(i,el){
                  var __h = $(el)[0].naturalHeight,
                      __w = $(el)[0].naturalWidth,
                      __ratio = __h / __w,

                      X_OFF   = 30,
                      Y_OFF   = 200;  // ~ (.modal-header height + .modal-footer height)

                  if ((__h + Y_OFF) > h) {
                     scope.imgMaxH = (h - Y_OFF);
                     scope.imgMaxW = Math.floor( scope.imgMaxH / __ratio );
                     scope.imgMaxW = ((w - X_OFF) <= scope.imgMaxW ) ? '100%' : scope.imgMaxW;
                  } else {
                     scope.imgMaxW = '100%';
                     scope.imgMaxH = __h;
                  }
                  $(el).css({ maxWidth: scope.imgMaxW });
               });
            }
         },
      }
   };
});
