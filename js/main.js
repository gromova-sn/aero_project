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
        render: function () {
            this.model.save();
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var AeroCollection = Backbone.Collection.extend({
        model: AeroModel,
        localStorage: new Backbone.LocalStorage("aeroStorage")
    });

    var AeroCollectionView = Backbone.View.extend({
        el: 'tbody',
        initialize: function(params) {
            this.collection = params.collection;
            this.listenTo(this.collection, 'add', this.addNew);
        },
        addNew: function(model) {
            var view = new AeroItemView({ model: model });
            this.$el.append(view.render().el);
        }

    });

    var AeroChoseCollectionView = Backbone.View.extend({
        el: '#bron',
        initialize: function(params) {
            this.collectionChose = params.collection;
            this.choseBron(this.collectionChose.models);
        },
        choseBron: function (model) {
            var aviaCompany = [],
                aviareis = [],
                aviaCountry = [];

            _.each(model, function (elem) {                
                $(this.el).find('.bron_flot').append('<option value=' + elem.attributes.flot + '>'  + elem.attributes.flot + '</option>');

                $(this.el).find('.bron_reis').append('<option value=' + elem.attributes.reis + '>'  + elem.attributes.reis + '</option>');
                
                $(this.el).find('.bron_country').append('<option value=' + elem.attributes.country[0] + '>'  + elem.attributes.country[0] + '</option>');

                $('.chosen-select').trigger("chosen:updated");
            }, this);
        }
        

    });

    
    var AeroApp = Backbone.View.extend({
        el: '.wrapper',
        events: {
            'click #btn_flot': 'addLine',
            'click #btn_bron': 'makeBron'
        },
        initialize: function() {
            this.collection = new AeroCollection(); //создаем модель коллекции
            this.collectionView = new AeroCollectionView({ collection: this.collection }); //представление 1 коллекции
            this.collection.fetch();

            $(".chosen-select").chosen();

            this.collectionChoseView = new AeroChoseCollectionView({ collection: this.collection }); //представление 1 коллекции
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
                count_reis: 0,
                places: 360
            };
            this.collection.add(data);

            $('#name_flot').val('');
            $('#reis_flot').val('');
            $('.country_box input:checked').attr('checked', false);
        },
        makeBron: function () {
            var data = {
                //выбранные пункты
            };
            
            console.log(this.collectionChoseView);

        }
    });

    window.App = new AeroApp;


})();
