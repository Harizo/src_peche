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
      vm.ajout = ajout;
      var NouvelItem=false;
      var currentItem;
      vm.selectedItem = {} ;
      vm.allenquete_cadre = [] ;
      vm.allsite_embarquement= [];
      vm.allunite_peche=[]; 
      vm.currentunite_peche= [];   
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

      //col table enqueteur_cadre   
      vm.enquete_cadre_column =
      [
         {titre:"Site d'enqueteur"},
         {titre:"Region"},
         {titre:"District"},
         {titre:"unite de pêche"},
         {titre:"nombre d'unite de pêche"},
      ];
   
      apiFactory.getAll("site_embarquement/index").then(function(result)
     {vm.allsite_embarquement = result.data.response;});
      
      apiFactory.getAll("district/index").then(function(result)
      {vm.alldistrict = result.data.response; vm.allcurrentdistrict=vm.alldistrict;});

      apiFactory.getAll("region/index").then(function(result)
      {vm.allregion= result.data.response;});

      apiFactory.getAll("enquete_cadre/index").then(function(result)
      {vm.allenquete_cadre= result.data.response;});

      apiFactory.getAll("unite_peche_site/index").then(function(result)
      {vm.allunite_peche_site= result.data.response;
      vm.currentunite_peche_site= vm.allunite_peche_site;});


      
      vm.selection= function (item)
      {
         vm.selectedItem = item;
         vm.nouvelItem = item;
         currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
         vm.afficherboutonModifSupr = 1 ;
         vm.affichageMasque = 0 ;
         vm.afficherboutonnouveau = 1 ;
      };
      $scope.$watch('vm.selectedItem', function()
      {
         if (!vm.allenquete_cadre) return;
         vm.allenquete_cadre.forEach(function(item) 
         {
            item.$selected = false;
         });
         vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
      vm.ajouter = function ()
      {
         vm.selectedItem.$selected = false;
         vm.affichageMasque = 1 ;
         vm.enquete_cadre = {} ;
         NouvelItem = true ;
      };
      vm.annuler = function()
      {
        vm.selectedItem = {} ;
        vm.selectedItem.$selected = false;
        vm.affichageMasque = 0 ;
        vm.afficherboutonnouveau = 1 ;
        vm.afficherboutonModifSupr = 0 ;
        NouvelItem = false;
      };
      vm.modifiersite_embarquement = function (item)
      {
        var site = vm.allsite_embarquement.filter(function(obj)
        {
            return obj.id == item.site_embarquement_id;
        });
        item.region_id= site[0].region.id;
        item.district_id= site[0].district.id;
        apiFactory.getFils("unite_peche_site/index",item.site_embarquement_id).then(function(result)
         {
            vm.currentunite_peche_site = result.data.response;
            console.log(vm.currentunite_peche);
         });     
      }
      vm.modifier = function() 
      {
          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.enquete_cadre.id              = vm.selectedItem.id ;
          vm.enquete_cadre.region_id       = vm.selectedItem.region.id ;
          vm.enquete_cadre.district_id     = vm.selectedItem.district.id ;
          vm.enquete_cadre.unite_peche_id  = vm.selectedItem.unite_peche.id ;
          vm.enquete_cadre.site_embarquement_id = vm.selectedItem.site_embarquement.id ;
          vm.enquete_cadre.nbr_unite_peche = parseInt(vm.selectedItem.nbr_unite_peche) ;
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau   = 0;
          apiFactory.getFils("unite_peche_site/index",vm.selectedItem.site_embarquement.id).then(function(result)
         {
            vm.currentunite_peche_site = result.data.response;
         });  

      };
      function ajout(enquete_cadre,suppression)   
      {
         if (NouvelItem==false) 
         {
           test_existance (enquete_cadre,suppression); 
         }
         else
         {
           insert_in_base(enquete_cadre,suppression);
         }
      }

   vm.supprimer = function() 
    {
        vm.afficherboutonModifSupr = 0 ;
        vm.affichageMasque = 0 ;
        var confirm = $mdDialog.confirm().title('Etes-vous sûr de supprimer cet enregistrement ?')
                                .textContent('')
                                .ariaLabel('Lucky day')
                                .clickOutsideToClose(true)
                                .parent(angular.element(document.body))
                                .ok('ok')
                                .cancel('annuler');

        $mdDialog.show(confirm).then(function()
        {
            ajout(vm.selectedItem,1);
        }, function()
            {
              //alert('rien');
            });
    };
    
      function test_existance (item,suppression) 
      {
           if (suppression!=1) 
           {
               vm.allenquete_cadre.forEach(function(ec)
               {
                   if (ec.id==item.id) 
                   {
                     if((ec.site_embarquement.id!=item.site_embarquement_id)
                       ||(ec.region.id!=item.region_id)
                       ||(ec.district.id!=item.district_id)
                       ||(ec.unite_peche.id!=item.unite_peche_id)
                       ||(ec.nbr_unite_peche!=item.nbr_unite_peche))
                     {
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0 ;
                     }
                     else
                     {
                         vm.affichageMasque = 1 ;
                     }
                   }
               });
           }
           else
               insert_in_base(item,suppression);
      }

      function insert_in_base(enquete_cadre,suppression)
      {
           
//add
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }};

        var getId = 0;

        if (NouvelItem==false) 
        {
          getId = vm.selectedItem.id; 
        }

        var datas = $.param(
        {
          supprimer:            suppression,
          id:                   getId,
          id_site_embarquement: enquete_cadre.site_embarquement_id,
          id_unite_peche:       enquete_cadre.unite_peche_id,
          id_district:          enquete_cadre.district_id,
          id_region:            enquete_cadre.region_id,
          nbr_unite_peche:      enquete_cadre.nbr_unite_peche
                    
        });
             
    //factory
        apiFactory.add("enquete_cadre/index",datas, config).success(function (data)
        {
            //vm.allcurrentdistrict=vm.alldistrict;

            var site_emba = vm.allsite_embarquement.filter(function(obj)
            {return obj.id == vm.enquete_cadre.site_embarquement_id;});

            var ups = vm.allunite_peche_site.filter(function(obj)
            {return obj.unite_peche.id == vm.enquete_cadre.unite_peche_id;});

            var reg = vm.allregion.filter(function(obj)
            {return obj.id == vm.enquete_cadre.region_id;});

            var dist = vm.alldistrict.filter(function(obj)
            {return obj.id == vm.enquete_cadre.district_id;});

            if (NouvelItem == false) 
              {
                // Update or delete: id exclu
               
                if(suppression==0) 
                  { // vm.selectedItem ={};                    
                    vm.selectedItem.nbr_unite_peche   = vm.enquete_cadre.nbr_unite_peche;
                    vm.selectedItem.unite_peche       = ups[0].unite_peche;
                    vm.selectedItem.site_embarquement = site_emba[0];                              
                    
                    vm.selectedItem.region        = reg[0];
                    vm.selectedItem.district      = dist[0];                              
                    
                    vm.afficherboutonModifSupr = 0 ;
                    vm.afficherboutonnouveau = 1 ;
                    vm.selectedItem.$selected = false;
                    vm.selectedItem ={};
                  } 
                  else 
                  {    
                    vm.allenquete_cadre = vm.allenquete_cadre.filter(function(obj)
                    {
                      return obj.id !== currentItem.id;
                    });
                  }
              }
              else
              { 
               
                var item = 
                {
                  nbr_unite_peche:      enquete_cadre.nbr_unite_peche,
                  site_embarquement:    site_emba[0], 
                  unite_peche:          ups[0].unite_peche, 
                  district:             dist[0], 
                  region:               reg[0],
                  id:                   String(data.response) 
                };
                
                vm.allenquete_cadre.push(item);
                vm.enquete_cadre={};
                            
                NouvelItem=false;
              }
              vm.affichageMasque = 0 ;
              })
                .error(function (data)
                {
                alert('Error');
                });
                
    }  

   }
})();
