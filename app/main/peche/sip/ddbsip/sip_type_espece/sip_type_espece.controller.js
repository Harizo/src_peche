(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_type_espece')
        .controller('Type_especeController', Type_especeController)      

    /** @ngInject */
    function Type_especeController($mdDialog, $scope, apiFactory, $state)  
    {
      var vm                    = this;
      vm.ajout                  = ajout ; 
      var currentItem;
      var NouvelItem            = false;
      vm.selectedItem           = {} ;
      vm.allsip_type_espece     = [] ;
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
      vm.sip_type_espece_column = [{titre:"libelle"}];

      apiFactory.getAll("sip_type_espece/index").then(function(result)
      { vm.allsip_type_espece = result.data.response;
        vm.affiche_load           = false ;
      });


      function ajout(sip_type_espece,suppression)
      {
        if (NouvelItem==false)
        {
          test_existance (sip_type_espece,suppression); 
        } 
        else
        {
          insert_in_base(sip_type_espece,suppression);
        }
      }

      //add     
      function insert_in_base(sip_type_espece,suppression) 
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
          libelle: sip_type_espece.libelle
                                    
        });

          //factory
        apiFactory.add("sip_type_espece/index",datas, config).success(function (data)
        {
          if (NouvelItem == false)
          {
           // Update or delete: id exclu                 
            if(suppression==0)
            {
              vm.selectedItem.id         = vm.sip_type_espece.id;
              vm.selectedItem.libelle    = vm.sip_type_espece.libelle;
              vm.afficherboutonModifSupr = 0 ;
              vm.afficherboutonnouveau   = 1 ;
              vm.selectedItem.$selected  = false;
              vm.selectedItem ={};
            } 
            else
            {    
              vm.allsip_type_espece = vm.allsip_type_espece.filter(function(obj)
              {
                return obj.id !== currentItem.id;
              });
            }
          } 
          else 
          {
            var item =
            {
              libelle: sip_type_espece.libelle,              
              id:      String(data.response)                       
            };              
            vm.allsip_type_espece.unshift(item);
            vm.sip_type_espece  = {} ;                   
            NouvelItem          =false;
          }
          vm.affichageMasque    = 0 ;
          vm.affiche_load           = false ;
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
        if (!vm.allsip_type_espece) return;
        vm.allsip_type_espece.forEach(function(item) 
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
        vm.sip_type_espece        = {} ;
        NouvelItem                = true ;
        vm.titrepage              ="Ajout du type espèces"
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
          vm.sip_type_espece.id      = vm.selectedItem.id ;
          vm.sip_type_espece.libelle = vm.selectedItem.libelle ;     
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau   = 0;
          vm.titrepage="modification du type d'espèces"  
      };
       
        vm.supprimer = function()
        {
          vm.affichageMasque         = 0 ;
          vm.afficherboutonModifSupr = 0 ;
          vm.affiche_load           = true ;
          var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent("")
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');
            apiFactory.getParamsDynamic("sip_espece/index?id_type_espece="+ vm.selectedItem.id+"").then(function (result) {
              vm.especes = result.data.response.length;
              vm.affiche_load           = false ;
              if ( vm.especes>0) 
              {
                console.log("misy Dialog");
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
    
        };

        function test_existance (item,suppression)
        {          
          if (suppression!=1)
          {   
            var re = vm.allsip_type_espece.filter(function(obj)
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
     dg.nbr1 = vm.especes;
      
      dg.titre_column = [{titre:"Nombre d'espèces"}]; 
        
      dg.cancel = function()
      {
        $mdDialog.hide('ok');
        console.log('cancel');
      };

    }
  }

})();
