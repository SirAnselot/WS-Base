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

   var BODY  = $('body'),
		HTML 	 = $('html');

	$(window).on('application-start', function(e,app) {
		// console.log('START SLICK.JS');
		APP = app;
      if ( WS.isSlick ) {
         WS.SLICK.init();
      }
	});

   WS.SLICK = {

		SELECTOR_DEFAULT : '.slick',

		SLIDER_MIN_HEIGHT : HERO_MIN_HEIGHT,

		SCRL : false,

		SLIDER : false,

      TRIGGER : false,

      FSS_MODAL : false,

		init : function (element) {

			if (element === undefined ) element = $(this.SELECTOR_DEFAULT);
         // if (ratio === undefined ) ratio = HERO_RATIO_DEFAULT;
			if (!element.length    ) return false;

			var _that = this,
				_SLICK = element,
            _RATIO;

			if (!this.SLIDER) this.SLIDER = Array();

			_SLICK.each(function(i, el) {

				_that.SLIDER[i] = $(el);

				var	 _type   = _that.SLIDER[i].data('type') 		|| 'default',
					_settings 	= _that.SLIDER[i].data('settings') 	|| { };

            _settings.fade = _that.SLIDER[i].hasClass('fade-slides');

            _RATIO = (_that.SLIDER[i].find('img').first().data('ratio')) ? _that.SLIDER[i].find('img').first().data('ratio') : HERO_RATIO_DEFAULT;

            _that.SLIDER[i].attr('data-ratio', _RATIO);

            _that.SLIDER[i]
					.on('init setPosition', function(event,slick,direction)
					{
                  var _holder = slick.$slider.parent(),
                      __w, __h;
                  if (_type === 'hero')
                  {
                     __h  = APP.getHeroHeight(_RATIO);

                     slick.$slider.css({ height: __h });
		               slick.$slider.find('.slide').css({ height: __h });
                     _holder.css({ height: __h });
                  } else {
                     __w = slick.slideWidth;
                     __h = (__w * _RATIO);
                  }
                  slick.$slider.find('.slick-dots').css({ top: (__h - 30) });
                  slick.$slider.find('.slick-arrow').css({ height: __h });
					})
               .on('lazyLoaded', function(event,slick,direction) {
                  WS.Images.swapImagesByBreakpoint( slick.$slider.find('img.figure-img'));
               });

				if (typeof _that.SLIDER[i].slick === 'function')
				{
					switch( _type ) {
						case 'default':
							_that.SLIDER[i].slick({
								dots: true,
                        lazyLoad: 'progressive',
                        arrows: (!APP.useSmallScreenBehavior()),
								infinite: true,
								speed: 500,
								slidesToShow: 1,
								autoplay: true,
			 				 	autoplaySpeed: 5000,
			 				 	fade: false,
			 				 	cssEase: 'ease-in-out'
							});
                     _that.initAutoplayTrigger( _that.SLIDER[i] );
                     _that.initFullscreenModal();
						break;

						//	HERO-SLIDER
						// (mod_djimageslider.hero)
						case 'hero' :
							_that.SLIDER[i].slick({
								dots: false,
								arrows: (!APP.useSmallScreenBehavior()),
								infinite: true,
			  					speed: 1500,
			  					autoplay: true,
			  					autoplaySpeed: 5000,
			  					fade: true,
			  					cssEase: 'linear',
                        pauseOnHover: false
							});
                     _that.initAutoplayTrigger(_that.SLIDER[i]);
						break;

                  //	RESPONSIVE-SLIDER
						// (mod_djimageslider.responsive)
						case 'responsive' :
							_that.SLIDER[i].slick({
								dots: true,
                        arrows: (!APP.useSmallScreenBehavior()),
								infinite: true,
								speed: 500,
								slidesToShow: 1,
								autoplay: false,
			 				 	autoplaySpeed: 5000,
			 				 	fade: false,
			 				 	cssEase: 'ease-in-out'
							});
                     _that.initAutoplayTrigger(_that.SLIDER[i]);
						break;
					}
               return $(_that.SLIDER[i]);
				}
			});
		},

      initAutoplayTrigger: function( _target )
      {
         var _triggerDown  = false,
             _triggerUp    = false,
             _that         = this;

         if ( _target.length )
         {
            _triggerDown = new Waypoint({
   				element: _target,
   				handler: function(direction) {
   					if ( direction === 'down' ) {   //console.log('down');
                     this.element
                        .addClass('playing')
                        .slick('slickPlay');
   					}
                  if ( direction === 'up' ) {     //console.log('up');
                     this.element
                        .removeClass('playing')
                        .slick('slickPause');
   					}
   				},
   				offset: ( APP.getWindowHeight( $(this.element).height()) )
   			});
            _triggerUp = new Waypoint({
   				element: _target,
   				handler: function(direction) {
   					if ( direction === 'down' ) { // console.log('down');
                     this.element
                        .removeClass('playing')
                        .slick('slickPause');
   					}
                  if (direction === 'up') {     //console.log('up');
                     this.element
                        .addClass('playing')
                        .slick('slickPlay');
   					}
                  // console.log($(this.element).height());
   				},
   				offset: - ( $(this.element).height() + 50 )
   			});
         }
      },
	};
});
