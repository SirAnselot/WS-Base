module.exports = function (grunt) {
	'use strict';
	
	var SASS_COMPILER_DEFAULT = 'libsass'; // oder 'sass' (viel langsamer)

	// Force use of Unix newlines
  	grunt.util.linefeed = '\n';

  	RegExp.quote = function (string) {
    	return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  	};

  	var fs = require('fs');
  	var path = require('path');
  	var glob = require('glob');

	var mq4HoverShim = require('mq4-hover-shim');
	var autoprefixer = require('autoprefixer')({
		browsers: [
		  //
		  // Official browser support policy:
		  // http://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
		  //
		  'Chrome >= 35', // Exact version number here is kinda arbitrary
		  // Rather than using Autoprefixer's native "Firefox ESR" version specifier string,
		  // we deliberately hardcode the number. This is to avoid unwittingly severely breaking the previous ESR in the event that:
		  // (a) we happen to ship a new Bootstrap release soon after the release of a new ESR,
		  //     such that folks haven't yet had a reasonable amount of time to upgrade; and
		  // (b) the new ESR has unprefixed CSS properties/values whose absence would severely break webpages
		  //     (e.g. `box-sizing`, as opposed to `background: linear-gradient(...)`).
		  //     Since they've been unprefixed, Autoprefixer will stop prefixing them,
		  //     thus causing them to not work in the previous ESR (where the prefixes were required).
		  'Firefox >= 31', // Current Firefox Extended Support Release (ESR)
		  // Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
		  // NOT the Edge app version shown in Edge's "About" screen.
		  // For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
		  // See also https://github.com/Fyrd/caniuse/issues/1928
		  'Edge >= 12',
		  'Explorer >= 9',
		  // Out of leniency, we prefix these 1 version further back than the official policy.
		  'iOS >= 8',
		  'Safari >= 8',
		  // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
		  'Android 2.3',
		  'Android >= 4',
		  'Opera >= 12'
		]
	});
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
            	' * WSUX v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            	' * Copyright 2016-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            	' */\n',
		// JS build configuration
		lineremover: {
		  	es6Import: {
				files: {
					'<%= concat.core.dest %>': '<%= concat.core.dest %>',
					'<%= concat.vendor.dest %>': '<%= concat.vendor.dest %>'
				},
				options: {
			  		exclusionPattern: /^(import|export)/g
				}
		  	}
		},
		
		stamp: {
	      	options: {
	        	banner: '<%= banner %>\n'
	      	},
	      	core: {
	        	files: {
	          		src: '<%= concat.core.dest %>'
	        	}
	      	}
	    },

		concat: {
	      	options: {
	        	stripBanners: false
	      	},
	      	core: {
	        	src:  '<%= pkg.app %>',
	        	dest: '<%= pkg.dist %>/js/<%= pkg.client %>.js'
	      	},
	      	vendor: {
	        	src:  '<%= pkg.vendor %>',
	        	dest: '<%= pkg.dist %>/js/vendor/vendor.js'
	      	}
	    },

	    uglify: {
		    options: {
		        compress: {
		         	warnings: false
		        },
		        mangle: true,
		        preserveComments: /^!|@preserve|@license|@cc_on/i
		   	},
		    core: {
	        	src:  '<%= concat.core.dest %>',
	        	dest: '<%= pkg.dist %>/js/<%= pkg.client %>.min.js'
	      	},
	      	vendor: {
	        	src: '<%= concat.vendor.dest %>',
	        	dest: '<%= pkg.dist %>/js/vendor/vendor.min.js'
	      	}
    	},

		sass: {
			compile: {
				files: {
					'<%= pkg.dist %>/css/<%= pkg.client %>.css': '<%= pkg.scss %>/<%= pkg.client %>.scss',
				}
			},
			sourceMap: {
				options: {
					sourceMap: '<%= pkg.dist %>/css/<%= pkg.client %>.map'
				},
				files: {
					'<%= pkg.dist %>/css/<%= pkg.client %>.css': '<%= pkg.scss %>/<%= pkg.client %>.scss'
				}
			},
			precision: {
				options: {
					precision: 10
				},
				files: {
					'<%= pkg.dist %>/css/precision.css': '<%= pkg.scss %>/precision.scss'
				}
			}
		},
		postcss: {
			core: {
				options: {
					map: true,
					processors: [
						mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.bs-true-hover ' }),
						autoprefixer
					]
				},
				src: '<%= pkg.dist %>/css/*.css'
			},
		},
		cssmin: {
			options: {
				compatibility: 'ie9',
				keepSpecialComments: '*',
				sourceMap: true,
				advanced: false
			},
			core: {
				files: [
					{
						expand: true,
						cwd: '<%= pkg.dist %>/css',
						src: ['*.css', '!*.min.css'],
						dest: '<%= pkg.dist %>/css',
						ext: '.min.css'
					}
				]
			}
		},
		watch: {
			sass: {
				files: ['<%= pkg.scss %>/**/*.scss','scss/*.scss'],
				tasks: 'dist-css'
			},
			js: {
				files: ['<%= pkg.dist %>/js/app/**/*.js','<%= pkg.dist %>/js/app/*.js'],
				tasks: 'core'
			}
		}
	});
	require('load-grunt-tasks')(grunt, { 
		scope: 'devDependencies', 
		pattern: [
			'grunt-*', 
			'!grunt-sass', 
			'!grunt-contrib-sass'
		]
	});
	require('time-grunt')(grunt);

	// JS distribution task.
	grunt.registerTask('vendor', ['concat:vendor','uglify:vendor']);
	grunt.registerTask('core', ['concat:core','lineremover','stamp']);
  	grunt.registerTask('dist-js', ['concat','lineremover','stamp','uglify:vendor']);

	// CSS distribution task.
	// Supported Compilers: sass (Ruby) and libsass.
	(function (sassCompiler) {
		require('./grunt/bs-sass-compile/' + sassCompiler + '.js')(grunt);
	})(SASS_COMPILER_DEFAULT);

	grunt.registerTask('default', ['dist-css', 'concat:core', 'stamp']);
	grunt.registerTask('sass-compile', ['sass:core']);
	grunt.registerTask('dist-css', ['sass-compile', 'postcss:core', 'cssmin:core']);

	// Full distribution task.
  	grunt.registerTask('dist', ['dist-css', 'dist-js']);
};

