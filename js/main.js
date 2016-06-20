(function() {
    'use strict';

    var AeroModel = Backbone.Model.extend({
        defaults: function () {
            return {
                flot: '',
                reis: ''
            };
        }
    });

    var AeroItemView = Backbone.View.extend({ 
        tagName: 'tr',
        template: _.template($('#layout-view-template').html()),
        // template: "#layout-view-template"
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var AeroCollection = Backbone.Collection.extend({
        model: AeroModel
    });

    var AeroCollectionView = Backbone.View.extend({
        el: 'tbody',
        initialize: function(params) {
            this.collection = params.collection;
            this.listenTo(this.collection, 'add', this.addNew);
        },
        addNew: function(model) {
            console.log(model);
            var view = new AeroItemView({ model: model });
            this.$el.append(view.render().el);
        }

    });

    
    var AeroApp = Backbone.View.extend({
        el: '.wrapper',
        events: {
            'click #btn_flot': 'addLine'
        },
        initialize: function() {
            this.collection = new AeroCollection(); //создаем модель коллекции
            this.collectionView = new AeroCollectionView({ collection: this.collection }); //представление коллекции
        },
        addLine: function() {
            if(!$('#name_flot').val() || !$('#reis_flot').val()) return; 
            var allCountry = [];
            _.each($('.country_box input:checked'), function (elem) {
                allCountry.push($(elem).val());
            }, this);

            var data = {
                flot: $('#name_flot').val(),
                reis: $('#reis_flot').val(),
                country: allCountry,
                count_reis: 0
            };
            this.collection.add(data);

            $('#name_flot').val('');
            $('#reis_flot').val('');
        }
    });

    window.App = new AeroApp;


})();
