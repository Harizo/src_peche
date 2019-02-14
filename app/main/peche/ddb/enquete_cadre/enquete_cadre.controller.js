(function ()
{
   'use strict';

   angular
   .module('app.peche.ddb.enquete_cadre')
   .controller('Enquete_cadreController', Enquete_cadreController);
   /** @ngInject */
   function Enquete_cadreController($mdDialog, $scope, apiFactory, $state)  
   {
      var vm = this;
    
      var NouvelItem=false;
      var currentItem;
      vm.selectedItem = {} ;
      vm.allenquete_cadre = [] ;     
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
