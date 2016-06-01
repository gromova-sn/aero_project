(function() {
    'use strict';

    var app = Marionette.Application.extend({
    	initialize: function (options) {
    		console.log(options.test);
    	}
    });


    var MyApp = new app({test: 'test'});
})();