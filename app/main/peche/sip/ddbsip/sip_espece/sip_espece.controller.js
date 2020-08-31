(function ()
{
   'use strict';

   angular
   .module('app.peche.sip.ddbsip.sip_espece')
   .controller('Sip_especeController', Sip_especeController);
   /** @ngInject */
   function Sip_especeController($mdDialog, $scope, apiFactory, $state)  
   {
      var vm                   = this;
      vm.ajout                 = ajout;
      var NouvelItem           = false;
      vm.titrepage             ='';
      var currentItem;
      vm.selectedItem          = {};
      vm.allsip_espece         = [];     
      vm.allsip_type_espece    = [];
      vm.afficherboutonnouveau = 1;      
      vm.affichageMasque       = 0;
      vm.dtOptions = 
      {  dom        : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
         pagingType : 'simple',
         autoWidth  : false,
         responsive : true
      };
 
      vm.sip_espece_column = [    
                  { titre:"Code" },
                  { titre:"Nom"},
                  { titre:"Nom local" },
                  { titre:"Nom scientifique"},
                  { titre:"Nom française"},
                  { titre:'Famille'},
                  { titre:'Type espece'}
       ];

   
      apiFactory.getAll("sip_espece/index").then(function(result)
      {
         vm.allsip_espece = result.data.response;
      });
 
      apiFactory.getAll("sip_type_espece/index").then(function(result)
      {
         vm.allsip_type_espece= result.data.response;
      });
     
      apiFactory.getAll("sip_famille/index").then(function(result)
      {
         vm.allfamille= result.data.response;
      });

      function ajout(sip_espece,suppression)   
      {  
        if (NouvelItem == false) 
         {
           test_existance (sip_espece,suppression); 
         }
         else
         {          
           insert_in_base(sip_espece,suppression);
         }
      } 


      function insert_in_base(sip_espece,suppression)
      {
           
        //add
        var config = 
        {
           headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
        };

        var getId = 0;

        if (NouvelItem == false) 
        {
           getId = vm.selectedItem.id; 
        } 
        var datas = $.param(
        {  supprimer:           suppression,
           id:                  getId, 
           typ_esp_id:          sip_espece.typ_esp_id,
           id_famille:          sip_espece.id_famille,
           nom_local:           sip_espece.nom_local,
           nom_scientifique:    sip_espece.nom_scientifique,
           nom_francaise:       sip_espece.nom_francaise,
           nom:                 sip_espece.nom,
           code:                sip_espece.code
        });
      
        apiFactory.add("sip_espece/index",datas, config).success(function (data)
        {  

           var tpe = vm.allsip_type_espece.filter(function(obj)
           {
              return obj.id == vm.sip_espece.typ_esp_id;
           });
           var fml = vm.allfamille.filter(function(obj)
           {
              return obj.id == vm.sip_espece.id_famille;
           });

           if (NouvelItem == false) 
           {  //Update or delete: id exclu
              if(suppression == 0) 

              { 
                vm.selectedItem.typ_esp_id        = vm.sip_espece.typ_esp_id;
                vm.selectedItem.type_lib          = tpe[0].libelle;
                vm.selectedItem.id_famille        = vm.sip_espece.id_famille;
                vm.selectedItem.libelle_famille   = fml[0].libelle;
                vm.selectedItem.code              = vm.sip_espece.code;       
                vm.selectedItem.nom               = vm.sip_espece.nom;
                vm.selectedItem.nom_scientifique  = vm.sip_espece.nom_scientifique;       
                vm.selectedItem.nom_local         = vm.sip_espece.nom_local;
                vm.selectedItem.nom_francaise     = vm.sip_espece.nom_francaise;
                vm.afficherboutonModifSupr        = 0 ;
                vm.afficherboutonModif            = 0 ;
                vm.afficherboutonnouveau          = 1 ;
                vm.selectedItem.$selected         = false;                    
                vm.selectedItem                   = {};                    
              } 
              else 
              {  
                 vm.allsip_espece = vm.allsip_espece.filter(function(obj)
                 {
                    return obj.id !== currentItem.id;
                 });
              }
           }

           else
           { 
              var item = {
                typ_esp_id:             sip_espece.typ_esp_id,
                 type_lib :             tpe[0].libelle,                    
                 id_famille:            sip_espece.id_famille,
                 libelle_famille :      fml[0].libelle,                    
                 nom :                  sip_espece.nom,
                 code :                 sip_espece.code,
                 nom_local :            sip_espece.nom_local,
                 nom_francaise :        sip_espece.nom_francaise,
                 nom_scientifique :     sip_espece.nom_scientifique,
                 id :                   String(data.response) 
              };
              vm.allsip_espece.push(item);              
                
              NouvelItem  = false;
           }
           vm.affichageMasque = 0 ;

        }).error(function (data)
           { 
              alert('Error');
           });                
               
      }

      //selection sur la liste
      vm.selection= function (item)
      {  vm.selectedItem            = item;
         vm.nouvelItem              = item;
         currentItem                = JSON.parse(JSON.stringify(vm.selectedItem));
         vm.afficherboutonModifSupr = 1 ;
         vm.afficherboutonModif     = 1 ;
         vm.affichageMasque         = 0 ;
         vm.afficherboutonnouveau   = 1 ;   

            
      };

      $scope.$watch('vm.selectedItem', function()
      {  if (!vm.allsip_espece) return;
         vm.allsip_espece.forEach(function(item)
         {
            item.$selected = false;
         });
         vm.selectedItem.$selected = true;
      });

      vm.ajouter = function () 
      {  vm.selectedItem.$selected  = false;
         vm.affichageMasque         = 1 ;
         vm.sip_espece              = {} ;
         NouvelItem                 = true ;
         vm.afficherboutonModifSupr = 0;
         vm.afficherboutonModif     = 0 ;
         vm.afficherboutonnouveau   = 1;
      };

      vm.annuler = function() 
      {  vm.selectedItem            = {} ;
         vm.selectedItem.$selected  = false;
         vm.affichageMasque         = 0 ;
         vm.afficherboutonnouveau   = 1 ;
         vm.afficherboutonModifSupr = 0 ;
         vm.afficherboutonModif     = 0 ;
         NouvelItem                 = false;
      };
//******************************************************************
//**********************************************:::::::::::
      vm.modifier = function() 
      {  

         NouvelItem                       = false ;
        vm.affichageMasque                = 1 ;
        vm.sip_espece.id                  = vm.selectedItem.id;       
        vm.sip_espece.code                = vm.selectedItem.code;
        vm.sip_espece.nom                 = vm.selectedItem.nom;
        vm.sip_espece.nom_local           = vm.selectedItem.nom_local;
        vm.sip_espece.nom_francaise       = vm.selectedItem.nom_francaise;
        vm.sip_espece.nom_scientifique    = vm.selectedItem.nom_scientifique;
        vm.sip_espece.typ_esp_id          = vm.selectedItem.typ_esp_id ;
        vm.sip_espece.id_famille          = vm.selectedItem.id_famille ;
        vm.afficherboutonModifSupr        = 0 ;
        vm.afficherboutonModif            = 1 ;
        vm.afficherboutonnouveau          = 0 ; 
      };

      vm.supprimer = function() 
      {  
        vm.afficherboutonModifSupr = 0;
        vm.affichageMasque         = 0;
        var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');
            apiFactory.getParamsDynamic("sip_permis/index?id_espece="+vm.selectedItem.id+"").then(function (resultat) {
              vm.permis = resultat.data.response.length;

              apiFactory.getParamsDynamic("sip_sortie_peche_artisanale/index?id_espece="+vm.selectedItem.id+"").then(function (resultat) {
                vm.sortie_peche_artisanale = resultat.data.response.length;

                apiFactory.getParamsDynamic("sip_commercialisation_crevette/index?id_espece="+vm.selectedItem.id+"").then(function (resultat) {
                  vm.comerce_crevette = resultat.data.response.length;
             
                  if(( vm.sortie_peche_artisanale>0)||( vm.permis>0)||( vm.comerce_crevette>0)) 
                    vm.dialog();
                  else 
                  {
                    $mdDialog.show(confirm).then(function(result)
                    {
                        ajout(vm.selectedItem,1);
                      
                    }, function() {
                      //alert('rien');
                    });
                  }
                });
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


          }, function(){//alert('rien');
          });

        }

          function DialogController($mdDialog, $scope, apiFactory, $state)  
          {
            var dg=$scope ;
            //style
            dg.tOptions = {
              dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
              pagingType: 'simple',
              autoWidth: false          
            };

            dg.titre_column  = [
                        {titre:"Nombre permis"},
                        {titre:"Sortie pêche artisanale"},
                        {titre: "Commercialisation crevette"}
            ]; 
            
               dg.nbr1 = vm.permis;
               dg.nbr2 = vm.sortie_peche_artisanale;
               dg.nbr3 = vm.comerce_crevette;
            dg.cancel = function()
            {
              $mdDialog.hide('ok');
              console.log('cancel');
            };
          }

      vm.set_libelle = function()
      {
         if ((vm.sip_espece.typ_esp_id)||(vm.sip_espece.id_famille))
         {
 
            var tpe = vm.allsip_type_espece.filter(function(obj)
              {
               return obj.id == vm.sip_espece.typ_esp_id;
            });
            var fml = vm.allfamille.filter(function(obj)
              {
               return obj.id == vm.sip_espece.id_famille;
            });

         }
      };

      function test_existance (item,suppression) 
      { 
         if (suppression!=1) 
         {  
            var up = vm.allsip_espece.filter(function(obj)
            {
               return obj.id == item.id;
            });
            {
               if((up[0].code!=item.code)
                    ||(up[0].nom!=item.nom)
                    ||(up[0].nom_local!=item.nom_local)
                    ||(up[0].nom_francaise!=item.nom_francaise)
                    ||(up[0].nom_scientifique!=item.nom_scientifique)
                    ||(up[0].type_espece!=item.typ_esp_id)
                    ||(up[0].id_famille!=item.id_famille))                    
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