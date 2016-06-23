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
        initialize: function () {
            // console.log(this.model);
            // this.listenTo(this.model, 'change', this.render);
        },
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
        el: 'body',
        events: {
            'click #btn_flot': 'addLine',
            'click #btn_bron': 'makeBron',
            'click .curtain_close': 'curtainUp',
            'click .container_header_arrow': 'containerRollUp',
            'click #slider_next': 'curtainSliderNext',
            'click #slider_prev': 'curtainSliderPrev'
        },
        initialize: function() {
            this.collection = new AeroCollection(); //создаем модель коллекции
            this.collectionView = new AeroCollectionView({ collection: this.collection }); //представление 1 коллекции
            this.collection.fetch();

            $(".chosen-select").chosen();
            this.collectionChoseView = new AeroChoseCollectionView({ collection: this.collection }); //представление 1 коллекции
        
            this.curtainDown();
            this.resizeHeightWindow();

            this.imgBlockStep = 200;
        },
        resizeHeightWindow: function () {
            $('.wrapp_page').height(window.innerHeight);
        },
        curtainDown: function () {
            setTimeout(function () {
                    $('.curtain').addClass('curtain_down');
                    $('.curtain').removeClass('curtain_up');
                }, 5000);
        },
        curtainUp: function () {
            $('.curtain').removeClass('curtain_down');
            $('.curtain').addClass('curtain_up');
        },
        curtainSliderNext: function (event) {
            var $blockToMove = $('.curtain_slider_container_img_block'),
                $el = $(event.currentTarget);

            if(this.imgBlockStep < 610) {
                $el.removeClass('disabled');
            }

            if($el.hasClass('disabled')) return;
            $blockToMove.css('left', '-' + this.imgBlockStep + 'px');
            this.imgBlockStep += 205;
            
            if(this.imgBlockStep == 610) {
                $el.addClass('disabled');
            }
        },
        curtainSliderPrev: function (event) {
            var $blockToMove = $('.curtain_slider_container_img_block'),
                $el = $(event.currentTarget);

            if(this.imgBlockStep > 0) {
                $el.removeClass('disabled');
            }

            if($el.hasClass('disabled')) return;
            this.imgBlockStep -= 405;
            $blockToMove.css('left', '-' + this.imgBlockStep + 'px');
            
            if(this.imgBlockStep <= 0) {
                $el.addClass('disabled');
            }
            
            this.imgBlockStep += 200;
        },
        containerRollUp: function (event) {
            var $elem = $(event.currentTarget),
                pageHeight,
                windowHeight = window.innerHeight;

            if($elem.hasClass('rollup')) {
                $elem.parent('div').siblings('.container_body').hide();
                $elem.removeClass('rollup');
            } else {
                $elem.parent('div').siblings('.container_body').show();
                $elem.addClass('rollup');
                pageHeight = $('.page').outerHeight()
                if(pageHeight > windowHeight) {
                    $('.wrapp_page').height($('.page').outerHeight());
                }
            }
            
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
            _.each(this.collection.models, function (elem) {
                elem.attributes.count_reis = '22';
            }, this);
            console.log(this.collection);
            // this.model.change(dataBron);
        }
    });

    window.App = new AeroApp;


})();
