(function() {
    'use strict';

    // var app = Marionette.Application.extend({
    // 	initialize: function () {
    // 		console.log(1);
    // 	}
    // });

    var AeroLayoutView = Marionette.LayoutView.extend({
        el: 'tr.template_place',
        template: "#layout-view-template"

        // regions: {
        //     flot: '#flot',
        //     reis: '#reis',
        //     country: '#country',
        //     count_reis: '#count_reis'
        // }
    });

    var layoutView = new AeroLayoutView({
        model: new Backbone.Model({
            aero: [{
                flot: 'FlyMSK',
                reis: '555 B',
                country: 'РОссия',
                count_reis: 5
            }]
        })
    });

    layoutView.render();


    // var MyApp = new app();
})();