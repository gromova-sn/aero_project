(function() {
    'use strict';

    var projectAero = new Backbone.Marionette.Application();


    var AeroModel = Backbone.Model.extend({
        defaults: function () {
            return {
                flot: '',
                reis: '',
                country: '',
                count_reis: ''
            };
        }
    });

    var AeroItemView = Marionette.ItemView.extend({ //a view that represents a single item
        tagName: 'tr',
        template: "#layout-view-template"
    });

    var AeroCollection = Backbone.Collection.extend({
        model: AeroModel
    });

    var AeroCollectionView = Marionette.CollectionView.extend({ //render one ItemView per model
        el: 'tbody',
        childView: AeroItemView
    });

    var AeroCompositeView = Marionette.CompositeView.extend({ //use this view to render our collection
        
    });

    var AeroLayoutView = Marionette.LayoutView.extend({  //предназначен для организации иерархий представлений

    });

    
    projectAero.addRegions({
        mainRegions: '.wrapp_page'
    });

    // var aero = [{
    //             flot: 'FlyMSK',
    //             reis: '555 B',
    //             country: 'РОссия',
    //             count_reis: 5
    //         },
    //         {
    //             flot: 'FlyMSK1',
    //             reis: '555 B1',
    //             country: 'РОссия1',
    //             count_reis: 51
    //         }];

    var myAero = new AeroCollection(AeroModel);
    var myAeroView = new AeroCollectionView({collection: myAero});
    myAeroView.render();

    $('tbody').append(myAeroView.el);
    // var layoutView = new AeroItemView({
    //     model: new Backbone.Model({
    //         aero: [{
    //             flot: 'FlyMSK',
    //             reis: '555 B',
    //             country: 'РОссия',
    //             count_reis: 5
    //         }]
    //     })
    // });

    // layoutView.render();


    // var MyApp = new projectAero();
})();