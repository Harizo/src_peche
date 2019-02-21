(function ()
{
   'use strict';

   angular
   .module('app.peche.ddb.unite_peche')
   .controller('Unite_pecheController', Unite_pecheController);
   /** @ngInject */
   function Unite_pecheController($mdDialog, $scope, apiFactory, $state)  
   {
      var vm                   = this;
      vm.ajout                 = ajout;
      var NouvelItem           = false;
      var currentItem;
      vm.selectedItem          = {};
      vm.allunite_peche        = [];     
      vm.afficherboutonnouveau = 1;      
      vm.affichageMasque       = 0;
      
      vm.dtOptions = 
      {  dom        : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
         pagingType : 'simple',
         autoWidth  : false,
         responsive : true
      };

      vm.unite_peche_column = [          
         {
           titre:"Site d'enquête"
         },
         {
           titre:"Type canoe"
         },
         {
           titre:'Type engin'
         },
         {
           titre:"Libelle"
         }
      ];

      apiFactory.getAll("type_canoe/index").then(function(result)
      {
         vm.alltype_canoe = result.data.response;
      });

      apiFactory.getAll("type_engin/index").then(function(result)
      {
         vm.alltype_engin= result.data.response;
      });
      apiFactory.getAll("site_embarquement/index").then(function(result)
      {
         vm.allsite_embarquement = result.data.response;
    
      });
      apiFactory.getAll("unite_peche/index").then(function(result)
      {
         vm.allunite_peche = result.data.response;
    
      });

      function ajout(unite_peche,suppression)   
      {  if (NouvelItem == false) 
         {
           test_existance (unite_peche,suppression); 
         }
         else
         {          
           insert_in_base(unite_peche,suppression);
         }
      }

      function insert_in_base(unite_peche,suppression)
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
            {  supprimer:             suppression,
               id:                    getId,
               type_canoe_id:         unite_peche.type_canoe_id,
               type_engin_id:         unite_peche.type_engin_id,
               site_embarquement_id:  unite_peche.site_embarquement_id,
               libelle:               unite_peche.libelle                
            });
          
            //factory
            apiFactory.add("unite_peche/index",datas, config).success(function (data)
            {  if (NouvelItem == false) 
               {  //Update or delete: id exclu
                  if(suppression == 0) 
                  { // vm.selectedItem ={};
                     vm.selectedItem.type_canoe_id          = vm.unite_peche.type_canoe_id;
                     vm.selectedItem.type_canoe_nom         = vm.unite_peche.type_canoe_nom;
                     vm.selectedItem.type_engin_id          = vm.unite_peche.type_engin_id;
                     vm.selectedItem.type_engin_nom         = vm.unite_peche.type_engin_nom;
                     vm.selectedItem.site_embarquement_id   = vm.unite_peche.site_embarquement_id;
                     vm.selectedItem.site_embarquement_nom  = vm.unite_peche.site_embarquement_nom;
                     vm.selectedItem.libelle                = vm.unite_peche.libelle;                      
                     vm.afficherboutonModifSupr             = 0 ;
                     vm.afficherboutonnouveau               = 1 ;
                     vm.selectedItem.$selected              = false;                    
                     vm.selectedItem                        ={};                     
                  } 
                  else 
                  {  vm.allunite_peche = vm.allunite_peche.filter(function(obj)
                     {
                        return obj.id !== currentItem.id;
                     });
                  }
               }
               else
               {  var item = {
                     type_canoe_id:           unite_peche.type_canoe_id,
                     type_canoe_nom:          unite_peche.type_canoe_nom,
                     type_engin_id:           unite_peche.type_engin_id,
                     type_engin_nom:          unite_peche.type_engin_nom,
                     site_embarquement_id:    unite_peche.site_embarquement_id,
                     site_embarquement_nom:   unite_peche.site_embarquement_nom,
                     libelle:                 unite_peche.libelle,
                     id:                      String(data.response) 
                  };
        
                  vm.allunite_peche.push(item);                   
                  vm.unite_peche.type_canoe_id        ='';
                  vm.unite_peche.type_engin_id        ='';
                  vm.unite_peche.site_embarquement_id ='';
                  vm.unite_peche.libelle              ='';                
                    
                  NouvelItem                          = false;
               }
               vm.affichageMasque = 0 ;

            }).error(function (data)
               { alert('Error');
               });                
        }

      //*****************************************************************

      //selection sur la liste
      vm.selection= function (item)
      {  vm.selectedItem            = item;
         vm.nouvelItem              = item;
         currentItem                = JSON.parse(JSON.stringify(vm.selectedItem));
         vm.afficherboutonModifSupr = 1 ;
         vm.affichageMasque         = 0 ;
         vm.afficherboutonnouveau   = 1 ;          
      };

      $scope.$watch('vm.selectedItem', function()
      {  if (!vm.allunite_peche) return;
         vm.allunite_peche.forEach(function(item)
         {
            item.$selected = false;
         });
         vm.selectedItem.$selected = true;
      });

      vm.ajouter = function () 
      {  vm.selectedItem.$selected           = false;
         vm.affichageMasque                  = 1 ;
         vm.unite_peche.type_canoe_id        ='';
         vm.unite_peche.type_engin_id        ='';
         vm.unite_peche.site_embarquement_id ='';
         vm.unite_peche.libelle              ='';
         NouvelItem                          = true ;
      };

      vm.annuler = function() 
      {  vm.selectedItem            = {} ;
         vm.selectedItem.$selected  = false;
         vm.affichageMasque         = 0 ;
         vm.afficherboutonnouveau   = 1 ;
         vm.afficherboutonModifSupr = 0 ;
         NouvelItem                 = false;
      };

      vm.modifier = function() 
      {  NouvelItem             = false ;
         vm.affichageMasque     = 1 ;
         vm.unite_peche.id      = vm.selectedItem.id;       
         vm.unite_peche.libelle = vm.selectedItem.libelle;

         vm.alltype_canoe.forEach(function(typec)
         {  if(typec.id==vm.selectedItem.type_canoe_id)
            { vm.unite_peche.type_canoe_id  = typec.id;
              vm.unite_peche.type_canoe_nom = typec.nom;
            }
         });
         vm.alltype_engin.forEach(function(type_e)
         {  if(type_e.id==vm.selectedItem.type_engin_id)
            { vm.unite_peche.type_engin_id  = type_e.id;
              vm.unite_peche.type_engin_nom = type_e.libelle;              
            }
         });
         vm.allsite_embarquement.forEach(function(site)
         {if(site.id==vm.selectedItem.site_embarquement_id)
            { vm.unite_peche.site_embarquement_id  = site.id;
              vm.unite_peche.site_embarquement_nom = site.libelle;
            }
         });          
         vm.afficherboutonModifSupr = 0;
         vm.afficherboutonnouveau   = 0; 
      };

      vm.supprimer = function() 
      {  vm.afficherboutonModifSupr = 0;
         vm.affichageMasque         = 0;
         var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

         $mdDialog.show(confirm).then(function()
         {
            ajout(vm.selectedItem,1);
         }, function() {
            //alert('rien');
          });
      };

      vm.modifiertype_canoe = function (item)
      {  vm.alltype_canoe.forEach(function(type_c)
         {  if(type_c.id==item.type_canoe_id)
            {  item.type_canoe_id  = type_c.id; 
               item.type_canoe_nom = type_c.nom;
            }
         });
      }
      
      vm.modifiertype_engin = function (item)
      {  vm.alltype_engin.forEach(function(type_e)
         {  if(type_e.id==item.type_engin_id)
            {  item.type_engin_id  = type_e.id; 
               item.type_engin_nom = type_e.libelle;                 
            }
         });
      }
      vm.modifiersite_embarquement = function (item)
      {  vm.allsite_embarquement.forEach(function(site)
         {  if(site.id==item.site_embarquement_id)
            {  item.site_embarquement_id  = site.id; 
               item.site_embarquement_nom = site.libelle;               
            }
         });
      }

      function test_existance (item,suppression) 
      {  if (suppression!=1) 
         {  vm.allunite_peche.forEach(function(unite_p)
            {  if (unite_p.id==item.id) 
               {  if((unite_p.site_embarquement_id!=item.site_embarquement_id)
                    ||(unite_p.type_canoe_id!=item.type_canoe_id)
                    ||(unite_p.type_engin_id!=item.type_engin_id)
                    ||(unite_p.libelle!=item.libelle))                    
                  { insert_in_base(item,suppression);
                     vm.affichageMasque = 0;
                  }
                  else
                  {
                     vm.affichageMasque = 0;
                  }
               }
            });
         }
         else
            insert_in_base(item,suppression);
      }

   }
})();