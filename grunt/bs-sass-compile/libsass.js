// Compile Bootstrap with [libsass][1] using [grunt-sass][2]
// [1]: https://github.com/sass/libsass
// [2]: https://github.com/sindresorhus/grunt-sass
module.exports = function configureLibsass(grunt) {
	grunt.config.merge({
		sass: {
			options: {
				includePaths: ['scss'],
				precision: 6,
				sourceComments: false,
				sourceMap: true,
				outputStyle: 'expanded'
			},
			core: {
				files: {
					'public/css/<%= pkg.client %>.css':'scss/<%= pkg.client %>.scss'
				}
			},
			extras: {
				files: {
		  			'public/css/<%= pkg.client %>-flex.css': 'scss/<%= pkg.client %>-flex.scss',
		  			'public/css/<%= pkg.client %>-grid.css': 'scss/<%= pkg.client %>-grid.scss',
		  			'public/css/<%= pkg.client %>-reboot.css': 'scss/<%= pkg.client %>-reboot.scss'
				}
	  		}
		}
	});
	grunt.loadNpmTasks('grunt-sass');
};
