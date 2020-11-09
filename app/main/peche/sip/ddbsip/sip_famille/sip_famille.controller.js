(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_famille')
        .controller('Sip_familleController', Sip_familleController)      

    /** @ngInject */
    function Sip_familleController($mdDialog, $scope, apiFactory, $state)  
    {
      var vm                    = this;
      vm.ajout                  = ajout ; 
      var currentItem;
      var NouvelItem            = false;
      vm.selectedItem           = {} ;
      vm.allsip_famille     = [] ;
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
      vm.sip_famille_column = [{titre:"libelle"}];

      apiFactory.getAll("SIP_famille/index").then(function(result)
      { vm.allsip_famille = result.data.response;
      });


      function ajout(sip_famille,suppression)
      {
        if (NouvelItem==false)
        {
          test_existance (sip_famille,suppression); 
        } 
        else
        {
          insert_in_base(sip_famille,suppression);
        }
      }

      //add     
      function insert_in_base(sip_famille,suppression) 
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
          libelle: sip_famille.libelle
                                    
        });

          //factory
        apiFactory.add("SIP_famille/index",datas, config).success(function (data)
        {
          if (NouvelItem == false)
          {
           // Update or delete: id exclu                 
            if(suppression==0)
            {
              vm.selectedItem.id         = vm.sip_famille.id;
              vm.selectedItem.libelle    = vm.sip_famille.libelle;
              vm.afficherboutonModifSupr = 0 ;
              vm.afficherboutonnouveau   = 1 ;
              vm.selectedItem.$selected  = false;
              vm.selectedItem ={};
            } 
            else
            {    
              vm.allsip_famille = vm.allsip_famille.filter(function(obj)
              {
                return obj.id !== currentItem.id;
              });
            }
          } 
          else 
          {
            var item =
            {
              libelle: sip_famille.libelle,              
              id:      String(data.response)                       
            };              
            vm.allsip_famille.unshift(item);
            vm.sip_famille  = {} ;                   
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
        if (!vm.allsip_famille) return;
        vm.allsip_famille.forEach(function(item) 
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
        vm.sip_famille        = {} ;
        NouvelItem                = true ;
        vm.titrepage              ="Ajout famille"
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
          vm.sip_famille.id      = vm.selectedItem.id ;
          vm.sip_famille.libelle = vm.selectedItem.libelle ;     
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau   = 0;
          vm.titrepage="modification du type d'espèces"  
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

            apiFactory.getParamsDynamic("SIP_espece/index?id_famille="+vm.selectedItem.id+"").then(function(res) {
            vm.esp = res.data.response.length;
           apiFactory.getParamsDynamic("SIP_Saisie_vente_poissonnerie/index?famille_rh="+vm.selectedItem.id+"").then(function (result) {
              vm.Saisie_VP = result.data.response.length;
              if (( vm.Saisie_VP>0)||( vm.esp>0)) 
              {
                vm.dialog();
              } 

              else 
              { 
                $mdDialog.show(confirm).then(function(result) {           
                  ajout(vm.selectedItem,1);
                }, function() {
                  //alert('rien'); annuler
                });
              }
            }); 
          });
              
    
        };

        vm.dialog = function (ev)
        {
          var confirm = $mdDialog.confirm({
          controller: DialogController,
          templateUrl: 'app/main/peche/sip/ddbsip/dialogue/dialog_Fils.html',
          parent: angular.element(document.body),
          targetEvent: ev, 
          
          })
          $mdDialog.show(confirm).then(function(data)
          {
            //ato no mapifandray ny controller roa ireo

            console.log(data) ;
            
          }, function(){//alert('rien');
        });

        }


     function DialogController($mdDialog, $scope, apiFactory, $state)  
    {
      var dg=$scope;
      //style
      dg.tOptions = {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false          
      };
      
      dg.nbr1 = vm.Saisie_VP;
      dg.nbr2 = vm.esp ; 
      dg.titre_column = [
              {titre:"Nombre saisie vente poissonnerie"},
              {titre:"Nombre espèces"}
      ]; 
        
      dg.cancel = function()
      {
        $mdDialog.hide('ok');
        console.log('cancel');
      };

    }

    function test_existance (item,suppression)
    {          
      if (suppression!=1)
      {   
        var re = vm.allsip_famille.filter(function(obj)
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
  }

})();
