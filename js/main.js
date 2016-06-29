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
            this.listenTo(this.model, 'change:count_reis', this.render);
        },
        render: function () {
            this.model.save();
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
        ,
        rerender: function () {
            this.model.save();
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var AeroCollection = Backbone.Collection.extend({
        model: AeroModel,
        localStorage: new Backbone.LocalStorage('aeroStorage')
    });

    var AeroCollectionView = Backbone.View.extend({
        el: 'tbody',
        initialize: function (params) {
            this.collection = params.collection;
            this.listenTo(this.collection, 'add', this.addNew);
        },
        addNew: function (model) {
            var view = new AeroItemView({ model: model });
            this.$el.append(view.render().el);
            this.resizeWindowAfterAdd();
        },
        resizeWindowAfterAdd: function () {
            $('.wrapp_page').css('height', 'auto');
        }

    });

    var AeroChoseCollectionView = Backbone.View.extend({
        el: '#reserve',
        initialize: function (params) {
            this.collectionChose = params.collection;
            this.choseReserve();

            this.flotCountry;

            this.listenTo(this.collectionChose, 'add', this.choseReserve);
        },
        events: {
            'change .reserve_flot': 'changeAviaCountry'
        },
        choseReserve: function (model) {
            var aviaCompany = [],
                objReis = {},
                objCountry = {},
                aviareis = [],
                aviaCountry = [],
                model = this.collectionChose.models;

            $(this.el).find('.reserve_flot option').html('');
            $('.reserve_country option').html('');
            $('.reserve_country').prop('disabled', true);
            $('.reserve_country').trigger('chosen:updated'); 

            _.each( model, function (elem, index) {      
                aviaCompany.push(elem.get('flot'));
            }, this );

            _.each( _.uniq(aviaCompany), function (elem) {     
                _.each( model, function (element) {  
                    if ( elem == element.get('flot') ) {
                        aviaCountry.push(element.get('country'));
                    }
                }, this );

                objReis[elem] = _.uniq(aviareis);
                objCountry[elem] = _.uniq(aviaCountry);
                $(this.el).find('.reserve_flot').append('<option value=' + elem + '>'  + elem + '</option>');
                
                aviareis = [];
                aviaCountry = [];
               
                $('.chosen-select.reserve_flot').trigger('chosen:updated');
            }, this );

            this.flotCountry = objCountry;
        },
        changeAviaCountry: function () {
            var selectedElem = $('.reserve_flot option:selected').text();

            $(this.el).find('.reserve_country option').html('');

            for ( var key in this.flotCountry ) {
                if ( selectedElem == key ) {
                    _.each( this.flotCountry[key], function (elem) {
                        $(this.el).find('.reserve_country').append('<option value=' + elem + '>'  + elem + '</option>');
                    }, this );
                }
            }
            $('.chosen-select').prop('disabled', false);
            $('.chosen-select').trigger('chosen:updated');            
        }
    });

    
    var AeroApp = Backbone.View.extend({
        el: 'body',
        events: {
            'click #btn_flot': 'addLine',
            'click #btn_reserve': 'makeReserve',
            'click .curtain_close': 'curtainUp',
            'click .container_header_arrow': 'containerRollUp',
            'click #slider_next': 'curtainSliderNext',
            'click #slider_prev': 'curtainSliderPrev'
        },
        initialize: function () {
            this.collection = new AeroCollection(); //создаем модель коллекции
            this.collectionView = new AeroCollectionView({ collection: this.collection }); //представление 1 коллекции
            this.collection.fetch();

            $('.chosen-select').chosen();
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
            if ( !($('.container_header_arrow').hasClass('rollup')) ) {
                $('.container_header_arrow').trigger('click');
            }
        },
        curtainSliderNext: function (event) {
            var $blockToMove = $('.curtain_slider_container_img_block'),
                $el = $(event.currentTarget);

            if ( this.imgBlockStep < 610 ) {
                $('#slider_prev').removeClass('disabled');
                $el.removeClass('disabled');
            }

            if ( $el.hasClass('disabled') ) return;
            $blockToMove.css('left', '-' + this.imgBlockStep + 'px');
            this.imgBlockStep += 205;
            
            if ( this.imgBlockStep == 610 ) {
                $el.addClass('disabled');
            }
        },
        curtainSliderPrev: function (event) {
            var $blockToMove = $('.curtain_slider_container_img_block'),
                $el = $(event.currentTarget);

            if ( this.imgBlockStep > 0 ) {
                $('#slider_next').removeClass('disabled');
                $el.removeClass('disabled');
            }

            if ( $el.hasClass('disabled') ) return;
            this.imgBlockStep -= 405;
            $blockToMove.css('left', '-' + this.imgBlockStep + 'px');
            
            if ( this.imgBlockStep <= 0 ) {
                $el.addClass('disabled');
            }
            
            this.imgBlockStep += 200;
        },
        containerRollUp: function (event) {
            var $elem = $(event.currentTarget),
                pageHeight,
                windowHeight = window.innerHeight;

            if ( $elem.hasClass('rollup') ) {
                $elem.parent('div').siblings('.container_body').hide();
                $elem.removeClass('rollup');
                this.resizeHeightWindow();
                pageHeight = $('.page').outerHeight()
                if ( pageHeight > windowHeight ) {
                    $('.wrapp_page').height($('.page').outerHeight());
                }

            } else {
                $elem.parent('div').siblings('.container_body').show();
                $elem.addClass('rollup');
                pageHeight = $('.page').outerHeight()
                if ( pageHeight > windowHeight ) {
                    $('.wrapp_page').height($('.page').outerHeight());
                }
            }
            
        },
        addLine: function () {
            if ( !$('#name_flot').val() || !$('#reis_flot').val() ) return; 
            var allCountry = $('.country_box input:checked').val();

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
        makeReserve: function () {
            var reserveCompany = $(this.el).find('.reserve_flot option:selected').val(),
                reserveCountry = $(this.el).find('.reserve_country option:selected').val();

            _.each( this.collection.models, function (elem) {
                if ( (elem.get('flot') ===  reserveCompany) && (elem.get('country') === reserveCountry) ) {
                    elem.set({ count_reis: ( elem.get('count_reis') + 1 ) });
                }
            }, this );
        }
    });

    window.App = new AeroApp;


})();
