(function ()
{
   'use strict';

   angular
   .module('app.peche.ddb.unite_peche')
   .controller('Unite_pecheController', Unite_pecheController);
   /** @ngInject */
   function Unite_pecheController($mdDialog, $scope, apiFactory, $state)  
   {
      var vm = this;
    
      var NouvelItem=false;
      var currentItem;
      vm.selectedItem = {} ;
      vm.allunite_peche = [] ;     
      //variale affichage bouton nouveau
      vm.afficherboutonnouveau = 1 ;
      //variable cache masque de saisie
      vm.affichageMasque = 0 ;
      //style
      vm.dtOptions = 
      {
         dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
         pagingType: 'simple',
         autoWidth: false,
         responsive: true
      };

   }
})();
