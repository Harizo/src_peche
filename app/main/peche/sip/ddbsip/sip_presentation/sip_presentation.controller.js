(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_presentation')
        .controller('PresentationController', PresentationController);
          //  IRETO DAHOLO NY TABLE MAMPIASA AZY ROA misy ny "id_presentation" sy "id_conservation" ato am :
          //sip_commercialisation_eau_douce, 
          //commercialisation_marine, 
          //sip_exportation_crevette, 
          //sip_saisie_collecte_halieutiques, 
          //sip_saisie_vent_poissonnerie  


    /** @ngInject */
    function PresentationController($mdDialog, $scope, apiFactory, $state)  
    {
      var vm   = this;
       vm.dtOptions =
      {
         dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
         pagingType: 'simple_numbers',
         order:[] 
      };
      vm.ajout = ajout ;
      var currentItem;
      var NouvelItem     = false;
      vm.selectedItem    = {} ;
      vm.allsip_presentation = [] ;
      vm.affichageMasque = 0 ;          //variable cache masque de saisie
      vm.afficherboutonnouveau = 1 ;    //variale affichage bouton nouveau  
      vm.titrepage='';
      //style
 
      //col table
      vm.sip_presentation_column = [{titre:"Libelle"}];

      apiFactory.getAll("SIP_presentation/index").then(function(result)
      { vm.allsip_presentation = result.data.response;    
      });

      function ajout(sip_presentation,suppression)
      { 
        if (NouvelItem==false)
        {
          test_existance (sip_presentation,suppression); 
        } 
        else
        {
          insert_in_base(sip_presentation,suppression);
        }
      }
 
        //add     
      function insert_in_base(sip_presentation,suppression) 
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
            libelle: sip_presentation.libelle,
          });
          //factory
        apiFactory.add("SIP_presentation/index",datas, config).success(function (data)
        {
          if (NouvelItem == false)
          {
           // Update or delete: id exclu                 
            if(suppression==0)
            {
              vm.selectedItem.libelle    = vm.sip_presentation.libelle;
              vm.selectedItem.id       = vm.sip_presentation.id;          
              vm.afficherboutonModifSupr = 0 ;
              vm.afficherboutonnouveau   = 1 ;
              vm.selectedItem.$selected  = false;
              vm.selectedItem ={};
            } 
            else
            {    
              vm.allsip_presentation = vm.allsip_presentation.filter(function(obj)
              {
                return obj.id !== currentItem.id;
              });
            }
          } 
          else 
          {
            var item =
            {
              libelle: sip_presentation.libelle,
              id:      String(data.response)                       
            };              
            vm.allsip_presentation.unshift(item);
            vm.sip_presentation = {} ;                   
            NouvelItem      =false;
          }
          vm.affichageMasque = 0 ;
        }).error(function (data) {
          alert(datas);
          
        });
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
        if (!vm.allsip_presentation) return;
        vm.allsip_presentation.forEach(function(item) 
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
        vm.sip_presentation           = {} ;
        NouvelItem                = true ;
        vm.titrepage="Ajout d'une présentation"
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
          vm.sip_presentation.id         = vm.selectedItem.id ;
          vm.sip_presentation.libelle    = vm.selectedItem.libelle ;     
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau   = 0;
          vm.titrepage="modification d'une présentation"  
      };
      vm.supprimer = function()
      {
        var commerce_marine  ;
        var commerce_eau_douce  ;
        var saisie_collecte_halieutique  ;
        var saisie_vente_poissonnerie  ;
        vm.affichageMasque         = 0 ;
        vm.afficherboutonModifSupr = 0 ;
        var confirm = $mdDialog.confirm()
              .title('Etes-vous sûr de supprimer cet enregistrement "'+vm.selectedItem.libelle+'" ?')
              .textContent("")
              .ariaLabel('Lucky day')
              .clickOutsideToClose(true)
              .parent(angular.element(document.body))
              .ok('ok')
              .cancel('annuler');

            apiFactory.getParamsDynamic("SIP_saisie_vente_poissonnerie/index?id_presentation="+ vm.selectedItem.id+"").then(function (resultat) {
              vm.saisie_vente_poissonnerie = resultat.data.response.length;
             
              apiFactory.getParamsDynamic("SIP_saisie_collecte_halieutique/index?id_presentation="+ vm.selectedItem.id+"").then(function (resultat) {
                vm.saisie_collecte_halieutique = resultat.data.response.length;
               
                apiFactory.getParamsDynamic("SIP_commercialisation_marine/index?id_presentation="+ vm.selectedItem.id+"").then(function (resultat) {
                  vm.commerce_marine = resultat.data.response.length;
                
                  apiFactory.getParamsDynamic("SIP_commercialisation_eau_douce/index?id_presentation="+ vm.selectedItem.id+"").then(function (resultat) {
                    vm.commerce_eau_douce = resultat.data.response.length;

                    apiFactory.getParamsDynamic("SIP_commercialisation_crevette/index?id_conservation="+vm.selectedItem.id+"").then(function (resultat) {
                      vm.commerce_crevette = resultat.data.response.length;

                      apiFactory.getParamsDynamic("SIP_exportation_crevette/index?id_conservation="+vm.selectedItem.id+"").then(function (resultat) {
                        vm.export_crevette = resultat.data.response.length;

                        if ( (vm.saisie_vente_poissonnerie>0) ||(vm.saisie_collecte_halieutique>0) ||(vm.commerce_eau_douce>0)|| (vm.commerce_marine>0)|| (vm.commerce_crevette>0)|| (vm.export_crevette>0)) 
                        {
                          vm.dial();
                        }
                        else{
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

      function test_existance (item,suppression)
      {          
          if (suppression!=1)
          {   
            var dc = vm.allsip_presentation.filter(function(obj)
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
          }  
          else
            insert_in_base(item,suppression);
      }
    }
})();
