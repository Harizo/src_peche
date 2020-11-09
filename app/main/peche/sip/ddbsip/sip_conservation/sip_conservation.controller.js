(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_conservation')
        .controller('Sip_conservationController', Sip_conservationController);
    
    /** @ngInject */
    function Sip_conservationController($mdDialog, $scope, apiFactory, $state)  
    {
  		var vm                    = this;
  		vm.ajout                  = ajout ;
  		var currentItem;
      var NouvelItem            = false;
  		vm.selectedItem           = {} ;
  		vm.allsip_conservation    = [] ;
      vm.affichageMasque        = 0 ;          //variable cache masque de saisie
  		vm.afficherboutonnouveau  = 1 ;    //variale affichage bouton nouveau 	
      vm.titrepage              ='';
      vm.affiche_load           = true ;
      
      //style
       vm.dtOptions =
      {
         dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
         pagingType: 'simple_numbers',
         order:[] 
      };
 
      //col table
      vm.sip_conservation_column = [{titre:"Libelle"}];


      apiFactory.getAll("SIP_conservation/index").then(function(result)
      { vm.allsip_conservation = result.data.response;   
 
      vm.affiche_load           = false ; 

      });

      function ajout(sip_conservation,suppression)
      {
        vm.affiche_load           = true ;
        if (NouvelItem==false)
        {
          test_existance (sip_conservation,suppression); 
        } 
        else
        {
          insert_in_base(sip_conservation,suppression);
        }
      }
 
 //add     
      function insert_in_base(sip_conservation,suppression) 
      {        
        var config =
        {
          headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
        };
        var getId = 0;
        if (NouvelItem==false)
        {
          getId = vm.selectedItem.id; 
        } 
        var datas = $.param(
        {
          supprimer:suppression,
          id:getId, 
          libelle: sip_conservation.libelle                            
        });
          //factory
        apiFactory.add("SIP_conservation/index",datas, config).success(function (data)
        {
          if (NouvelItem == false)
          {
           // Update or delete: id exclu                 
            if(suppression==0)
            {
              vm.selectedItem.libelle     = vm.sip_conservation.libelle;
              vm.selectedItem.id          = vm.sip_conservation.id;					
              vm.afficherboutonModifSupr  = 0 ;
              vm.afficherboutonnouveau    = 1 ;
              vm.selectedItem.$selected   = false;
              vm.selectedItem             ={};
            } 
            else
            {    
            	vm.allsip_conservation = vm.allsip_conservation.filter(function(obj)
              {
            		return obj.id !== currentItem.id;
            	});
            }
          } 
          else 
          {
            var item =
            {
              libelle: sip_conservation.libelle,
              id:      String(data.response)                       
            };              
            vm.allsip_conservation.unshift(item);
            vm.sip_conservation = {} ;                   
            NouvelItem      =false;
          }
          vm.affichageMasque = 0 ;
          vm.affiche_load           = false ;
        }).error(function (data) {alert('Error');});                
      }
  	
      vm.selection= function (item)
      {
  			vm.selectedItem = item;
  			vm.nouvelItem   = item;
  			currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
  			vm.afficherboutonModifSupr = 1 ;
  			vm.affichageMasque         = 0 ;
  			vm.afficherboutonnouveau   = 1 ;
  		};
  		
      $scope.$watch('vm.selectedItem', function()
      {
  			if (!vm.allsip_conservation) return;
  			vm.allsip_conservation.forEach(function(item) 
        {
  				item.$selected = false;
  			});
  			vm.selectedItem.$selected = true;
  		});
      
      //function cache masque de saisie
      vm.ajouter = function ()
      {
  			vm.selectedItem.$selected = false;
  			vm.affichageMasque        = 1 ;
  			vm.sip_conservation       = {} ;
  			NouvelItem                = true ;
        vm.titrepage              ="Ajout d'une conservation"
      };
      
      vm.annuler = function()
      {
        NouvelItem                 = false;
        vm.selectedItem            = {} ;        
        vm.affichageMasque         = 0 ;
        vm.selectedItem.$selected  = false;        
        vm.afficherboutonnouveau   = 1 ;
        vm.afficherboutonModifSupr = 0 ;        
      };
       
      vm.modifier = function()
      {
          NouvelItem                 = false ;
          vm.affichageMasque         = 1 ;
          vm.sip_conservation.id     = vm.selectedItem.id ;
          vm.sip_conservation.libelle= vm.selectedItem.libelle ;		 
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau   = 0;
          vm.titrepage="modification d'une conservation"  
      };

        vm.supprimer = function()
        {
          vm.affichageMasque              = 0 ;
          vm.afficherboutonModifSupr      = 0 ;
          vm.affiche_load           = true ;
          var commerce_marine             ;
          var commerce_eau_douce          ;
          var saisie_collecte_halieutique ;
          var saisie_vente_poissonnerie   ;
         var confirm                      = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');
        apiFactory.getParamsDynamic("SIP_saisie_vente_poissonnerie/index?id_conservation="+vm.selectedItem.id+"").then(function (resultat) {
          vm.saisie_vente_poissonnerie = resultat.data.response.length;

          apiFactory.getParamsDynamic("SIP_saisie_collecte_halieutique/index?id_conservation="+vm.selectedItem.id+"").then(function (resultat) {
            vm.saisie_collecte_halieutique = resultat.data.response.length;
            
            apiFactory.getParamsDynamic("SIP_commercialisation_marine/index?id_conservation="+vm.selectedItem.id+"").then(function (resultat) {
              vm.commerce_marine = resultat.data.response.length;
            
              apiFactory.getParamsDynamic("SIP_commercialisation_eau_douce/index?id_conservation="+vm.selectedItem.id+"").then(function (resultat) {
                vm.commerce_eau_douce = resultat.data.response.length;

                apiFactory.getParamsDynamic("SIP_commercialisation_crevette/index?id_conservation="+vm.selectedItem.id+"").then(function (resultat) {
                  vm.commerce_crevette = resultat.data.response.length;

                  apiFactory.getParamsDynamic("SIP_exportation_crevette/index?id_conservation="+vm.selectedItem.id+"").then(function (resultat) {
                    vm.export_crevette = resultat.data.response.length;

                    vm.affiche_load           = false ;

                    if ( (vm.saisie_vente_poissonnerie>0) ||(vm.saisie_collecte_halieutique>0) ||(vm.commerce_eau_douce>0)|| (vm.commerce_marine>0)|| (vm.commerce_crevette>0)|| (vm.export_crevette>0)) 
                    {
                      vm.dial();
                    }
                    else
                    {
                      $mdDialog.show(confirm).then(function() {
                      
                        ajout(vm.selectedItem,1);
                      
                      }, function() {
                        //alert('rien');
                      });
                    }
                  });
                }); 
            
              }); 

            });
            
          });

        }); 
          
        };

       
         
        

    function test_existance (item,suppression)
    {          
        if (suppression!=1)
        {   
          var dc = vm.allsip_conservation.filter(function(obj)
            {
               return obj.id == item.id;
            });
            if(dc[0])
            {
               if((dc[0].id!=item.id)
                    ||(dc[0].libelle!=item.libelle))                    
                  { 
                     insert_in_base(item,suppression);
                     vm.affichageMasque = 0;
                  }
                  else
                  {  
                     vm.affichageMasque = 0;
                  }
            }
        }  else
          insert_in_base(item,suppression);
    }

    vm.dial = function (ev)
    {
      var confirm = $mdDialog.confirm({
        controller : ControlDialog,
        templateUrl: 'app/main/peche/sip/ddbsip/dialogue/dialog_Fils.html',
        parent     : angular.element(document.body),
        targetEvent: ev, 
      
      })
      $mdDialog.show(confirm).then(function(resultat)
      {
      }, function(){//alert('rien');
      });
    }
    function ControlDialog($mdDialog, $scope, apiFactory, $state)  
    {
      var dg  =$scope;
      //style
      dg.tOptions = {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false          
      };
         dg.nbr1 = vm.commerce_eau_douce ;
         dg.nbr2 = vm.commerce_marine ;
         dg.nbr3 = vm.saisie_collecte_halieutique ;
         dg.nbr4 = vm.saisie_vente_poissonnerie ;
         dg.nbr5 = vm.commerce_crevette ;
         dg.nbr6 = vm.export_crevette ;
        
     dg.titre_column = [
               
                {titre:"Commercialisation eau douce"},
                {titre:"Commercialisation marine"},
                {titre:"Saisie collecte halieutique"},
                {titre:"Saisie vente poissonnerie"},
                {titre:"Commercialisation crevette"},
                {titre:"Exportation crevette"} 

      ]; 

      dg.cancel = function()
      {
        $mdDialog.hide();
      };

    }
}
})();