(function() {
    'use strict';

    // var projectAero = new Marionette.Application.extend({

    // });

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
        itemView: AeroItemView
    });

    var AeroLayoutView = Marionette.LayoutView.extend({  //предназначен для организации иерархий представлений
        el: '.wrapp_page',
        events: {
            'click #btn_flot': 'testAlert'
        },
        testAlert: function () {
            console.log(this.model); //this.model - undefind
            // this.model.set({
            //     flot: this.$el.find('#name_flot').val(),
            //     reis: this.$el.find('#reise_flot').val()
            // });
            console.log('testAlert');
        }
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

    var myAeroLayoutView = new AeroLayoutView();
    var myAero = new AeroCollection(AeroModel);
    var myAeroView = new AeroCollectionView({collection: myAero});
    myAeroView.render();

    $('tbody').append(myAeroView.el);



    // var MyApp = new projectAero({});
})();