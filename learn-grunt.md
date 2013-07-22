##grunt学习笔记
----

###About
  grunt 为基于node的前端或者node项目构建工具， 整合了jsLint, cssmin, uglify， concact 等等等等工具， 只需要一个配置文件就可以自动的完成文件压缩， 文件合并
单元测试。

----
###Install
  * sudo npm install -g grunt-cli
  * sudo npm install -g grunt-init
  * sudo npm install -g grunt --save-dev

----
###Hello World
  * 需求: 将一个文件压缩编译压缩到指定目录
  * mkdir hello-grunt 
  * cd hello-grunt
  * npm init... 问答方式完package.json的配置
  配置结果:

  ```JavaScript
	{
	    "name": "calendar",
	    "version": "1.2.0",
	    "devDependencies": {
		"grunt-contrib-uglify": "~0.2.0",
		"grunt": "~0.4.1",
		"grunt-kmc": "~0.1.1",
		"grunt-contrib-cssmin": "~0.6.0"
	    }
	}
  ```
  * 项目目录结构：
    |---0.0.0
          |---src
                 |---index.js
          |---build
                 |---index.min.js
    package.json
    Gruntfile.js
    README.md
	  
  * 写Gruntfile.js or Gruntfile.coffee
  
  ```JavaScript
	module.exports = function(grunt) {
	  // Project configuration.
	  grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    uglify: {
	      options: {
		banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	      },
	      build: {
		src: '<%= pkg.version %>/src/<%= pkg.scripts.index %>',
		dest: '<%= pkg.version %>/build/<%= pkg.name %>.min.js'
	      }
	    }
	  });
	  // Load the plugin that provides the "uglify" task.
	  grunt.loadNpmTasks('grunt-contrib-uglify');
	  // Default task(s).
	  grunt.registerTask('default', ['uglify']);
	};
  ```
   * npm install
   * grunt
   ok, 这样就完成了， 讲src下面的index.js 压缩成为index.min.js






  
