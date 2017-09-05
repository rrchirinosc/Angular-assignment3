(function () {
    'use strict';
    
    angular.module('NarrowMenuApp', [])
    .controller('SelectedMenuItemsController', SelectedMenuItemsController)
    .service('SelectedMenuItemsService', SelectedMenuItemsService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
    
    
    SelectedMenuItemsController.$inject = ['SelectedMenuItemsService'];
    function SelectedMenuItemsController(SelectedMenuItemsService) {
      var menu = this;

      menu.populateList = function(searchedFor) {
        var promise = SelectedMenuItemsService.getMenuItems();
        menu.items = [];
        menu.selected = [];        
        
          promise.then(function (response) {
            menu.items = response.data.menu_items;
            menu.selected = getSelected(menu.searchFor);
            //console.log(menu.items, menu.items.length);
            //console.log(menu.searchFor);
          })
          .catch(function (error) {
            console.log("Something went terribly wrong.");
          });    
      };  
      
      menu.removeItem = function(index) {
        if(index >= 0 && index < menu.selected.length)
          menu.selected.splice(index, 1);
      }
      
      function getSelected(searchedFor)
      {
        var len = menu.items.length;
        var selected = [];
        var searched = searchedFor.toLowerCase();
        for(var i = 0; i < len; i++)
        {
          if(menu.items[i].description.toLowerCase().indexOf(searched) !== -1)
            selected.push(menu.items[i]);
        }  

        return selected;     
      }
    }


    
    
    SelectedMenuItemsService.$inject = ['$http', 'ApiBasePath'];
    function SelectedMenuItemsService($http, ApiBasePath) {
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
    