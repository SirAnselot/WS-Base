/*!
 * WEIGELSTEIN
 *
 * @name			   share.js
 * @desc			   social share/like (fb, tw, plus)
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
		console.log('START SHARE.JS');
		APP = app;
      WS.SHARE.init();
	});

   WS.SHARE = {

 TARGET_DEFAULT : $('body'),
	 FBShareBtn : '.fb-button-share',
     FBLikeBtn : '.fb-button',
	   GPlusBtn : '.gplus-button',
	GP_ENDPOINT : 'https://plus.google.com/share',
	 TwitterBtn :  '.twitter-button',
	TW_ENDPOINT : 'https://twitter.com/share',

		    init: function (target) {

				var _target = target || this.TARGET_DEFAULT,
				 	_that = this,
					_fbShare = _target.find(this.FBShareBtn),
               _fbLike = _target.find(this.FBLikeBtn),
					_tw = _target.find(this.TwitterBtn),
					_gp = _target.find(this.GPlusBtn);

				_fbShare.on('click', function (e) {
					var _data = $(this).data();
					_that.FBShare( _data );
					return false;
				});

            _fbLike.on('click', function (e) {
					var _data = $(this).data();
					_that.FBLike( _data );
					return false;
				});

				_gp.on('click', function (e) {
					var _data = $(this).data();
					_that.GPlusShare(_data);
					return false;
				});

				_tw.on('click', function (e) {
					var _data = $(this).data();
					_that.TwitterShare( _data );
					return false;
				});

			},

	 	FBShare: function (data) {

         FB.ui({
			  	method: 'share',
				href: data.url,
			}, function(response) {
				console.log(response);
			});
		},

      FBLike: function (data) {
			FB.ui({
			  	method: 'share_open_graph',
				action_type: 'og.likes',
				action_properties: JSON.stringify({
				   object: data.url,
				})
			}, function(response) {
				console.log(response);
			});
		},

		GPlusShare: function (data) {
			var width  = 600,
		      	height = 600,
		      	left   = ($(window).width()  - width)  / 2,
		      	top    = ($(window).height() - height) / 2,
		      	url    = this.GP_ENDPOINT + '?url=' + data.url + '&text=' + data.text,
		      	opts   =
		      		'menubar=no' +
		      		',toolbar=no' +
		      		',resizable=yes' +
		      		',scrollbars=no' +
		           	',width='  + width  +
		           	',height=' + height +
		           	',top='    + top    +
		           	',left='   + left;
		    window.open(url, 'google', opts);
		},

		TwitterShare: function (data) {
			var width  = 575,
		      	height = 400,
		      	left   = ($(window).width()  - width)  / 2,
		      	top    = ($(window).height() - height) / 2,
		      	url    = this.TW_ENDPOINT + '?url=' + data.url + '&text=' + data.text,
		      	opts   =
		      		'status=1' +
		           	',width='  + width  +
		           	',height=' + height +
		           	',top='    + top    +
		           	',left='   + left;
		    window.open(url, 'twitter', opts);
		}
	}
});
