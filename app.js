(function () {
    'use strict';
    
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    /* Directive in charge of displaying narrowed list */
    function FoundItems() {
      var ddo = {
        templateUrl: 'menuList.html',
        scope: {
          list: '<',    // attribute pointing to narrowed list
          onRemove: '&' // reference attribute that should point to removeItem in controller
        }
      };
      return ddo;
    }
    
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var menu = this;
      menu.name="narrow";

      /* funtion invoked by search narrowing button that fetches
         whole list, narrows it down accordingly and saves resulting list */ 
      menu.populateList = function(searchedFor) {
        var promise = MenuSearchService.getMenuItems();
        menu.items = [];
        menu.selected = [];        

        promise.then(function (response) {
            menu.items = response.data.menu_items;
            menu.selected = getMatchedMenuItems(menu.searchFor);
            //console.log(menu.items, menu.items.length);
            //console.log(menu.searchFor);
          })
          .catch(function (error) {
            console.log("Something went terribly wrong.");
          });    
      };  
      
      /* Removes item from displayed list */
      menu.removeItem = function(index) {
        if(index >= 0 && index < menu.selected.length)
          menu.selected.splice(index, 1);
      }
      
      /* Returns a list of items that contain the searchFor attribute
         in their description */
      function getMatchedMenuItems(searchedFor) {
        var len = menu.items.length;
        var selected = [];

        if(searchedFor === "" || searchedFor === undefined) {
          selected = menu.items;
        }
        else {
          
          var searched = searchedFor.toLowerCase();
          for(var i = 0; i < len; i++)
          {
            if(menu.items[i].description.toLowerCase().indexOf(searched) !== -1)
              selected.push(menu.items[i]);
          }
        }  

        return selected;     
      }
    }    
    
    /* Remote service that returns the menu */
    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
      var service = this;
    
      service.getMenuItems = function () {
        var response = $http({
          method: "GET",
          url: (ApiBasePath + "/menu_items.json")
        });
    
        return response;
      };
    }
    
})();
    