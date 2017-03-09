/*!
 * WEIGELSTEIN
 *
 * @name			   fx.js
 * @desc			   special fx, animations, etc.
 *
 * @client			tba.
 * @author 			Ansgar Hiller <ansgar@weigelstein.de>
 * @since			01-2017
*/
// weigelstein namespace
var WS = WS || {},
	APP;

jQuery(document).ready(function ($) { 'use strict';

	$(window).on('application-start', function(e,app) {
		console.log('START FX.JS');
		APP = app;

      // INIT FX
      WS.FX.init();

      // TO TOP FNC
      $('#to-top').on('click', function() {
         WS.FX.to(0);
      });
	});

   WS.FX = {

      TRIGGER: false,
		SCRL: false,

		init: function (ratio) {

         var _ratio = ratio || HERO_RATIO_DEFAULT;

         var tweens = [],
             scenes = [];

         var scrollSpeed = 0.00007;

         WS.FX.initLazyloadTrigger();

         // init infinite-scroll on 'flexbox-items'
         if($('.item.fade').length) {
            $('.item.fade').each( function(i,el) {
               $(el).addClass('show');
            });
         }

         if ($('.infinite-more-link').length) {
            var infinite = new Waypoint.Infinite({
               element: $('.flexblog-items')[0],
               onBeforePageLoad: function(){
                  // console.log('onBeforePageLoad');
               },
               onAfterPageLoad: function(items){
                  // console.log('onAfterPageLoad');
                  items.each( function(i,el) {
                     $(el).addClass('show');
                     WS.FX.lazyloadTrigger($(el).find('img[data-lazy]'));
                  });
                  // var lazy = items.find('img[data-lazy]');
                  // WS.FX.initLazyloadTrigger(lazy);
                  APP.initTouchClickItems();
               }
            });
         }

         // init controller
		   if (!this.SCRL) { this.SCRL = new ScrollMagic.Controller(); }

         this.SCRL.scrollTo(function ( newpos ) {
   			newpos = Math.ceil( newpos );
   			var _duration = Math.abs( $(document).scrollTop() - newpos ) * scrollSpeed;
            console.log($(document).scrollTop());
   			TweenMax.to($(window),_duration,{scrollTo:{y:newpos, roundProps:'y', autoKill:false, ease: Sine.easeInOut }});
   		});

         // HERO SLIDER SCROLL ANIMATIONS
         if ( $('.hero-container').length ) {
   		   tweens[0] = TweenMax.to(".hero-container", 1, {
                  y: - APP.getHeroHeight(_ratio),
                  ease: Linear.easeNone
               });
            scenes[0] = new ScrollMagic.Scene ({
                  duration: Math.ceil(APP.getHeroHeight(_ratio) * 2.5 )
               })
               .setTween(tweens[0])
               .addTo(this.SCRL);

            tweens[1] = TweenMax.fromTo(".hero-container .hero-layer", 1, {
                  y: 50,
               },{
                  y: - APP.getHeroHeight(_ratio) * 0.3,
                  ease: Linear.easeNone
               });
            scenes[1] = new ScrollMagic.Scene ({
                  duration: Math.ceil(APP.getHeroHeight(_ratio) * 2.5 )
               })
               .setTween(tweens[1])
               .addTo(this.SCRL);

            tweens[2] = TweenMax.fromTo(".hero-container .slick-list", 1, {
                  opacity: 1,
               },{
                  opacity: 0,
                  ease: Linear.easeNone
               });
            scenes[2] = new ScrollMagic.Scene ({
                  duration: Math.ceil(APP.getHeroHeight(_ratio) * 0.25 ),
                  offset: (h * 0.25)
               })
               .setTween(tweens[2])
               .addTo(this.SCRL);
         }

         // LAYER IN PARALLAX HEADER
         if ($('.imageHolder > .layer').length) {
            tweens[3] = TweenMax.fromTo(".imageHolder > .layer", 1, {
                  y: 0,
                  opacity: 1
               },{
                  y: $('.layer').outerHeight(),
                  opacity: 0.3,
                  ease: Linear.easeNone
               });
            scenes[3] = new ScrollMagic.Scene ({
                  duration: Math.ceil(APP.getHeroHeight(_ratio) * 1 )
               })
               .setTween(tweens[3])
               .addTo(this.SCRL);
         }

         // LAYER IN CATEGORY-IMAGE
         if ($('.category-image-holder').length) {
            tweens[3] = TweenMax.to(".category-image-holder", 1, {
                  y: - APP.getHeroHeight(_ratio),
                  opacity: 0,
                  ease: Linear.easeNone
               });
            scenes[3] = new ScrollMagic.Scene ({
                  duration: Math.ceil(APP.getHeroHeight(_ratio) * 2.5 )
               })
               .setTween(tweens[3])
               .addTo(this.SCRL);
            tweens[4] = TweenMax.to(".category-image-holder .category-image > .layer", 1, {
                  y: - 800,
                  ease: Linear.easeNone
               });
            scenes[4] = new ScrollMagic.Scene ({
                  duration: Math.ceil(APP.getHeroHeight(_ratio) * 3.0 )
               })
               .setTween(tweens[4])
               .addTo(this.SCRL);
         }

         if ($('.mod-container.quicklinks').length) {
            /*
            tweens[5] = TweenMax.to(".mod-container.quicklinks", 1, {
                  y: $('.mod-container.quicklinks').height() * 1.5,
                  opacity: 0,
                  ease: Linear.easeNone
               });
            scenes[5] = new ScrollMagic.Scene ({
                  duration: APP.getWindowHeight() * .75,
                  offset: 200
               })
               .setTween(tweens[5])
               .addTo(this.SCRL);
            */
            /*
            tweens[6] = TweenMax.to(".category-image-holder .category-image > .layer", 1, {
                  y: - 800,
                  ease: Linear.easeNone
               });
            scenes[6] = new ScrollMagic.Scene ({
                  duration: Math.ceil(APP.getHeroHeight(_ratio) * 3.0 )
               })
               .setTween(tweens[6])
               .addTo(this.SCRL);
            */
         }
		},

      initLazyloadTrigger: function(_target) {
         var triggers = [],
             target = _target || $('img[data-lazy]');
         if ( target.length ) {
            target.each(function(i,el){
               triggers[i] = WS.FX.lazyloadTrigger($(el));
            });
         }
      },

      lazyloadTrigger: function(target, _direction)
      {
         var opt = {
             direction : _direction || 'down',
             trigger:    false
         }

         if ( target.length )
         {
            TweenMax.set(target.closest('.item'),{alpha:0});
            opt.trigger = new Waypoint({
   				element: target,
   				handler: function(direction) {
   					if ( direction === opt.direction ) {
                     if (!this.element.hasClass('done')) {
                        WS.Images.swapImagesByBreakpoint(this.element);
                     }
                     TweenMax.to(target.closest('.item'),0.3,{alpha:1});
   					}
   				},
   				offset: (APP.getWindowHeight( $(this.element).height()) )
   			});

            $(window).on('breakpointchange',function() {
               WS.Images.swapImagesByBreakpoint(target);
            });
         }
         return opt.trigger;
      },

      to: function(_target) {
         // init controller
		   if (!this.SCRL) { this.SCRL = new ScrollMagic.Controller(); }
         this.SCRL.scrollTo(_target);
      }
   };

});
