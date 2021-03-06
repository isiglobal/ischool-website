module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		meta: {
			copyright: 'Copyright (c) 2013 Brandon Thomas <bt@brand.io>',
			notifyCmd: 'notify-send -i ' +
						'/usr/share/icons/gnome/32x32/emotes/face-laugh.png ' +
						'-t 500 ',
		},

		neuter: {
			production: {
				options: {
					filepathTransform: function(fp) {
						return './js/' + fp;
					},
					includeSourceURL: false,
					//template: '(function){ {%= src %} })();',
					template: '{%= src %}', // For now. Eventually: wrap.frag.
				},
				files: [{
					src: 'js/main.js',
					dest: 'static/script.out.js',
				}],
			},
			/*development: {
				options: {
					filepathTransform: function(fp) {
						return 'src/' + fp;
					},
					includeSourceURL: true,
					//template: '(function){ {%= src %} })();',
					template: '{%= src %}',
				},
				files: [{
					src: 'src/main.js',
					dest: 'leadstep.dev.js',
				}],
			},*/
		},

		uglify: {
			options: {
				banner: '/*! ' +
					'<%= pkg.name %> // v<%= pkg.version %> // ' +
					'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
					'<%= meta.copyright %> ' +
					'*/\n',
			},
			production: {
				files: [{
					src: 'static/script.out.js',
					dest: 'static/script.out.min.js',
				}],
			},
		},

		less: {
			main: {
				src: 'less/main.less',
				dest: 'static/design.out.css',
				options: {
					yuicompress: true,
				},
			},
		},

		watch: {
			script: {
				files: ['js/*.js'],
				tasks: [
					'neuter:production', 
					'uglify:production', 
					'shell:alert',
				],
			},
			style: {
				files: [
					'less/*.less',
					'less/lib/*.css',
				],
				tasks: [
					'less', 
					'shell:alert',
				],
			},
		},

		shell: {
			alert: {
				command: '<%= meta.notifyCmd%> "Grunt" ' +
						 '"Yay, compiled!"',
				options: {
					stdout: false,
				},
			},
		},
	});
 
	// Bower for jQuery, Backbone, etc. dependencies
	// TODO: jslint, build tests, etc.
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-neuter');

	// watch for changes
	grunt.registerTask('default', ['neuter:production', 'less', 'watch']);

	// 'build' task, eg. for pre-commit hook
	grunt.registerTask('build', ['neuter:production', 'less']);
};
