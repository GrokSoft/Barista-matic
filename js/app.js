/*
 * Copyright (c) 2016. GrokSoft LLC All Rights Reserved
 */
"use strict";

var INGREDENTMAX = 10;
/**
 * The ingredients for all drinks
 */
var ingredients  = {
    coffee      : {
        name    : "Coffee",
        cost    : .75,
        quantity: 10
    },
    decaf       : {
        name    : "Decaf Coffee",
        cost    : .75,
        quantity: 10
    },
    sugar       : {
        name    : "Sugar",
        cost    : .25,
        quantity: 10
    },
    cream       : {
        name    : "Cream",
        cost    : .25,
        quantity: 10
    },
    steamedMilk : {
        name    : "Steamed Milk",
        cost    : .35,
        quantity: 10
    },
    foamedMilk  : {
        name    : "Foamed Milk",
        cost    : .35,
        quantity: 10
    },
    espresso    : {
        name    : "Espresso",
        cost    : 1.10,
        quantity: 10
    },
    cocoa       : {
        name    : "Cocoa",
        cost    : .90,
        quantity: 10
    },
    whippedCream: {
        name    : "Whipped Cream",
        cost    : 1.00,
        quantity: 10
    }
};

/**
 * All the drinks available, and there ingredient lists
 */
var drinks = {
    coffee    : {
        name       : "Coffee",
        ingredients: {
            "coffee": 3,
            "sugar" : 1,
            "cream" : 1
        },
        images     : [
            "images/coffee.png"
        ]
    },
    decaf     : {
        name       : "Decaf Coffee",
        ingredients: {
            "decaf": 3,
            "sugar": 1,
            "cream": 1
        },
        images     : [
            "images/decaf.png"
        ]
    },
    latte     : {
        name       : "Caffe Latte ",
        ingredients: {
            "espresso"   : 2,
            "steamedMilk": 1
        },
        images     : [
            "images/latte.png"
        ]
    },
    americano : {
        name       : "Americano",
        ingredients: {
            "espresso": 3
        },
        images     : [
            "images/americano.png"
        ]
    },
    mocha     : {
        name       : "Caffe Mocha",
        ingredients: {
            "espresso"    : 1,
            "cocoa"       : 1,
            "steamedMilk" : 1,
            "whippedCream": 1
        },
        images     : [
            "images/mocha.png"
        ]
    },
    Cappuccino: {
        name       : "Cappuccino",
        ingredients: {
            "espresso"   : 2,
            "steamedMilk": 1,
            "foamedMilk" : 1
        },
        images     : [
            "images/cappuccino.png"
        ]
    }
};


(function () {
    var app = angular.module('barista', ['drinks-directives']);

    app.controller('BaristaController', ['$http', function ($http) {
        var barista = this;

        // Just using local data for now
        this.drinks      = drinks;
        this.ingredients = ingredients;

        /**
         * Todo: Put the data in json files and uncomment this and delete the vars above
         */
        // Initialize to an empty arrays
        /*barista.drinks = [];
         barista.ingredients = [];

         // Get the data for the drinks
         $http.get('drinks.json').success(function (data) {
         barista.drinks = data;
         });

         // Get the data for the ingredients
         $http.get('ingredients.json').success(function (data) {
         barista.ingredients = data;
         });*/

        /**
         * Show the dispensed drink
         * @param drink
         */
        this.enjoyShow = function (drink) {
            var text = "Sorry, unable to dispense your drink!";
            if (drink != "")
                text = "You dispensed a " + drink + ", Enjoy!";
            $('#dispensed').text(text);
        };
    }]);

    app.directive("baristaJumbo", function () {
        return {
            restrict    : "E",   // By Attribute <div project-specs>
            templateUrl : "barista-jumbo.html",
            controller  : function () {
                // Init the carousel
                new Carousel('#topCarousel');
            },
            controllerAs: "jumboCtrl"
        };
    });

    app.directive("ingredientsList", function () {
        return {
            restrict    : "E",
            templateUrl : "ingredientsAll.html",
            controller  : ['$scope', function ($scope) {
                /**
                 * Restock the ingredients to there max value
                 */
                this.restock = function () {
                    for (var curIngredient in ingredients) {
                        ingredients[curIngredient].quantity = INGREDENTMAX;
                    }
                };
            }],
            controllerAs: "ingredientsCtrl"
        };
    });

    // Misc helper functions

    /**
     * Create a bootstrap carousel slightly delayed from the last one created.
     *
     * @param aId
     * @param aInc
     * @param aInterval
     * @constructor
     */
    var Carousel = function (aId, aInc, aInterval) {
        var theId = aId;
        Object.defineProperties(this, {
            carId: {
                value: $(aId)
            },

            inc: {
                value     : typeof aInc !== 'undefined' ? aInc : 2000,
                enumerable: true
            },

            carInterval: {
                value     : typeof aInterval !== 'undefined' ? aInterval : 10000,
                enumerable: true
            }
        });

        // See if the ID passed is really a carousel
        //   if( !$(this.carId).is(".carousel") ) {
        //       throw new Error("Id passed is NOT a carousel!");
        //   }

        //
        // Set the carousels to start slightly delayed from each other, so they are not all moving at the same time by default.
        //

        // Set up the Carousel's listeners. But only do this the first time.
        if (Carousel.first === undefined || Carousel.first === true) {
            // Create the Static vars that is NOT inherited by instantiated classes and needed to keep track of timing.
            Carousel.first    = false;
            Carousel.carDelay = 0;  // The delay between each carousel sliding.
            Carousel.running  = true;

            // Make the carousel pause when hovered over.
            $(document).on('mouseleave', '.carousel', function () {
                if (Carousel.running == true)
                    $(this).carousel('cycle');
            });
            $(document).on('mouseenter', '.carousel', function () {
                $(this).carousel('pause');
            });
        }

        // Setup the Carousel's initial state and create the timeout function to start it cycling
        this.carId.carousel({interval: this.carInterval});
        this.carId.carousel("pause");
        Carousel.carDelay += this.inc;

        // After timeout, start the carousel cycling
        setTimeout(function () {
            $(theId).carousel('cycle');
        }, Carousel.carDelay);
    };


})();