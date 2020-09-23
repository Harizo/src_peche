(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.base_geo')
        .controller('base_geoController', base_geoController)      

    /** @ngInject */
    function base_geoController($mdDialog, $scope, apiFactory, $state)  
    {
      var vm                    = this;
      vm.ajout                  = ajout ; 
      var currentItem;
      var NouvelItem            = false;
      vm.selectedItem           = {} ;
      vm.all_base_geo     = [] ;
      vm.affichageMasque        = 0 ;          //variable cache masque de saisie
      vm.afficherboutonnouveau  = 1 ;    //variale affichage bouton nouveau  
      vm.titrepage              ='';
        //style
       vm.dtOptions =
      {
         dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
         pagingType: 'simple_numbers',
         order:[] 
      };

      //col table 
      vm.base_geo_column = [{titre:"libelle"}];

      apiFactory.getAll("sip_base_geo/index").then(function(result)
      { vm.all_base_geo = result.data.response;
      });


      function ajout(bs_geo,suppression)
      {
        if (NouvelItem==false)
        {
          test_existance (bs_geo,suppression); 
        } 
        else
        {
          insert_in_base(bs_geo,suppression);
        }
      }

      //add     
      function insert_in_base(bs_geo,suppression) 
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
          libelle: bs_geo.libelle
                                    
        });

          //factory
        apiFactory.add("sip_base_geo/index",datas, config).success(function (data)
        {
          if (NouvelItem == false)
          {
           // Update or delete: id exclu                 
            if(suppression==0)
            {
              vm.selectedItem.id         = vm.bs_geo.id;
              vm.selectedItem.libelle    = vm.bs_geo.libelle;
              vm.afficherboutonModifSupr = 0 ;
              vm.afficherboutonnouveau   = 1 ;
              vm.selectedItem.$selected  = false;
              vm.selectedItem ={};
            } 
            else
            {    
              vm.all_base_geo = vm.all_base_geo.filter(function(obj)
              {
                return obj.id !== currentItem.id;
              });
            }
          } 
          else 
          {
            var item =
            {
              libelle: bs_geo.libelle,              
              id:      String(data.response)                       
            };              
            vm.all_base_geo.unshift(item);
            vm.bs_geo  = {} ;                   
            NouvelItem          =false;
          }
          vm.affichageMasque    = 0 ;
        }).error(function (data) 
            {
              //alert('Error');
        
            });                
      }
      
      vm.selection= function (item)
      {
        vm.selectedItem            = item;
        vm.nouvelItem              = item;
        currentItem                = JSON.parse(JSON.stringify(vm.selectedItem));
        vm.afficherboutonModifSupr = 1 ;
        vm.affichageMasque         = 0 ;
        vm.afficherboutonnouveau   = 1 ;
      };
      
      $scope.$watch('vm.selectedItem', function()
      {
        if (!vm.all_base_geo) return;
        vm.all_base_geo.forEach(function(item) 
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
        vm.bs_geo        = {} ;
        NouvelItem                = true ;
        vm.titrepage              ="Ajout de la base Géo"
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
          vm.bs_geo.id      = vm.selectedItem.id ;
          vm.bs_geo.libelle = vm.selectedItem.libelle ;     
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau   = 0;
          vm.titrepage="modification de la base Géo"  
      };
       
      vm.supprimer = function()
      {
        vm.affichageMasque         = 0 ;
        vm.afficherboutonModifSupr = 0 ;
        var confirm = $mdDialog.confirm()
              .title('Etes-vous sûr de supprimer cet enregistrement ?')
              .textContent("")
              .ariaLabel('Lucky day')
              .clickOutsideToClose(true)
              .parent(angular.element(document.body))
              .ok('ok')
              .cancel('annuler');
              apiFactory.getParamsDynamic("sip_societe_crevette/index?base_geo="+vm.selectedItem.libelle+"").then(function (resultat) {
                vm.societe_crevette = resultat.data.response.length;
                if (vm.societe_crevette>0) 
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
          
        };

      function test_existance (item,suppression)
      {          
        if (suppression!=1)
        {   
          var re = vm.all_base_geo.filter(function(obj)
            {
               return obj.id == item.id;
            });
            if(re[0])
            {
             if((re[0].libelle!=item.libelle))                    
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
           dg.nbr1 = vm.societe_crevette ;
          
       dg.titre_column = [
                 
                  {titre:"Société crevette"}
        ]; 

        dg.cancel = function()
        {
          $mdDialog.hide();
        };

      }        
    }
})();
