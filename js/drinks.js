/*
 * Copyright (c) 2016. GrokSoft LLC All Rights Reserved
 */
"use strict";

(function () {
    var app = angular.module('drinks-directives', []);

    /**
     * The restrict option is typically set to:
     *
     * 'A' - only matches attribute name    <div myAttribute>
     * 'E' - only matches element name      <myDirective>
     * 'C' - only matches class name        <div class="myClass"
     * 'M' - only matches comment           ??????
     */

    app.directive("drink", function () {
        return {
            restrict    : "E",
            templateUrl : "drink.html",
            controller  : ['$scope', function ($scope) {

                /**
                 * Determine if the ingredients for the drink are in stock
                 *
                 * Todo: Make this more efficient by only running once per ingredient list change!
                 * @param selectedDrink
                 * @returns {boolean}
                 */
                this.isInStock = function (selectedDrink) {
                    var ret = true;
                    for (var ingredient in selectedDrink.ingredients) {
                        /** Todo: Add check for hasOwnProperty anywhere I use [ingredient] **/
                        var quantity = selectedDrink.ingredients[ingredient];
                        var available = ingredients[ingredient].quantity;
                        if (available < quantity) {
                            ret = false;
                            break;
                        }
                    }
                    return ret;
                };

                /**
                 * Determine the cost of the drink
                 *
                 * @param selectedDrink
                 * @returns {number} the cost of the drink
                 */
                this.cost = function (selectedDrink) {
                    var ret = 0;
                    for (var ingredient in selectedDrink.ingredients) {
                        ret += (ingredients[ingredient].cost * selectedDrink.ingredients[ingredient]);
                    }
                    return ret;
                };

                /**
                 * Order the drink if there are enough ingredients
                 * This will decrement the quantity in the ingredients data
                 *
                 * @param selectedDrink
                 */
                this.order = function (selectedDrink) {
                    var dispensed = true;
                    for (var ingredient in selectedDrink.ingredients) {
                        var quantity = selectedDrink.ingredients[ingredient];
                        var available = ingredients[ingredient].quantity;
                        if (available >= quantity)
                            ingredients[ingredient].quantity -= quantity;
                        else {
                            // We don't have enough of the ingredient to make the drink
                            /**
                             * Todo: Change this to a angular modal dialog
                             */
                            alert("Sorry, there is not enough " + ingredients[ingredient].name + " to make a " + selectedDrink.name + ". It requires " + quantity
                                + " but there " + (available == 1 ? "is" : "are") + (available == 0 ? " none" : " only " + available) + " in stock!" +
                                "\n\nPlease Restock the ingredients, by pressing the 'Restock' button, located at the bottom of the 'Ingredients in Stock' section of the page.");
                            dispensed = false;
                            break;
                        }
                    }
                    /**
                     * Todo: Change this to a angular modal dialog
                     */
                    if (dispensed) {
                        /** Todo: Change this around so I don't need to call the parent **/
                        $scope.$parent.baristaCtrl.enjoyShow(selectedDrink.name);
                        // Jump to the display of what was dispensed in case we are mobile.
                        window.location.href = "#dispensedGo";
                    }
                    else
                        $scope.$parent.baristaCtrl.enjoyShow("");
                };
            }],
            controllerAs: "drinkCtrl"
        }
    });

    /**
     * Todo: Add a drink description to display next to the image
     */
    app.directive("drinkDescription", function () {
        return {
            restrict   : 'E',
            templateUrl: "drink-description.html"
        };
    });

    app.directive("drinkGallery", function () {
        return {
            restrict    : "E",
            templateUrl : "drink-gallery.html",
            controller  : ['$scope', function ($scope) {
                this.current = 0;
                /**
                 * Todo: Implement image selection when multiple image are available
                 * For now only the first one is show.
                 */
                /*this.setCurrent = function(imageNumber) {
                 this.current = imageNumber || 0;
                 };*/
            }],
            controllerAs: "gallery"
        };
    });

    app.directive("ingredients", function () {
        return {
            restrict    : "E",
            templateUrl : "ingredients.html",
            controller  : ['$scope', function () {
                /**
                 * Return the name for the ingredient passed
                 * @param ingredient
                 * @returns {*}
                 */
                this.getIngredientName = function (ingredient) {
                    return ingredients[ingredient].name;
                }
            }],
            controllerAs: "ingredientCtrl"
        };
    });
})();

