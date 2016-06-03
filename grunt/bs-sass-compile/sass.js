// Compile Bootstrap with [Ruby Sass][1] using [grunt-contrib-sass][2]
// [1]: https://github.com/sass/sass
// [2]: https://github.com/gruntjs/grunt-contrib-sass
module.exports = function configureRubySass(grunt) {
	var options = {
		loadPath: ['scss'],
		precision: 6,
		sourcemap: 'auto',
		style: 'expanded',
		trace: true,
		bundleExec: true
  	};
  	grunt.config.merge({
		sass: {
	  		core: {
				options: options,
				files: { 
					'public/css/<%= pkg.client %>.css': 'scss/<%= pkg.client %>.scss' 
				}
	  		},
	  		extras: {
				options: options,
				files: {
		  			'public/css/<%= pkg.client %>-flex.css': 'scss/<%= pkg.client %>-flex.scss',
		  			'public/css/<%= pkg.client %>-grid.css': 'scss/<%= pkg.client %>-grid.scss',
		  			'public/css/<%= pkg.client %>-reboot.css': 'scss/<%= pkg.client %>-reboot.scss'
				}
	  		}
		}
  	});
  	grunt.loadNpmTasks('grunt-contrib-sass');
};
