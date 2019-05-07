(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.nbr_jrs_mois_unite_peche')
        .controller('Nbr_jrs_mois_unite_pecheController', Nbr_jrs_mois_unite_pecheController);
    /** @ngInject */
    function Nbr_jrs_mois_unite_pecheController($mdDialog, $scope, apiFactory, $state)  {
		var vm          = this;
		vm.ajout        = ajout ;
		var NouvelItem  = false;
		var currentItem;
		vm.selectedItem = {} ;
    vm.unite_peche  = [];
		vm.afficherboutonnouveau = 1 ;
		vm.affichageMasque       = 0 ;
		//style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.nbr_jrs_mois_unite_peche_column = [{titre:"unite de peche"},{titre:"Max jours de pêche"}];		

    apiFactory.getAll("nbr_jrs_mois_unite_peche/index").then(function(result)
    {
        vm.allnbr_jrs_mois_unite_peche = result.data.response;
    });

    apiFactory.getAll("unite_peche/index").then(function(result)
    {
        vm.allunite_peche = result.data.response;
    });

    function ajout(nbr_jrs_mois_unite_peche,suppression)
    {
        if (NouvelItem==false)
        {
            test_existance (nbr_jrs_mois_unite_peche,suppression); 
        } 
        else 
        {
            insert_in_base(nbr_jrs_mois_unite_peche,suppression);
        }
    }
    
    function insert_in_base(nbr_jrs_mois_unite_peche,suppression)
    {
        //add
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
        };
        
        var getId = 0;
        if (NouvelItem==false)
        {
            getId = vm.selectedItem.id; 
        } 
        
        var datas = $.param({
                supprimer:      suppression,
                id:             getId,
                unite_peche_id: nbr_jrs_mois_unite_peche.unite_peche_id,
                max_jrs_peche:  nbr_jrs_mois_unite_peche.max_jrs_peche              
        });
        
        //factory
        apiFactory.add("nbr_jrs_mois_unite_peche/index",datas, config).success(function (data)
        {

          var up = vm.allunite_peche.filter(function(obj)
          {
              return obj.id == vm.nbr_jrs_mois_unite_peche.unite_peche_id;
          });

				  if (NouvelItem == false)
          {               
              if(suppression==0)
              {
                  vm.selectedItem.unite_peche   = up[0];
                  vm.selectedItem.max_jrs_peche = vm.nbr_jrs_mois_unite_peche.max_jrs_peche;
      						vm.afficherboutonModifSupr    = 0 ;
                  vm.afficherboutonModif        = 0 ;
      						vm.afficherboutonnouveau      = 1 ;
      						vm.selectedItem.$selected     = false;
      						vm.selectedItem               = {};

              } 
              else
              {    
						      vm.allnbr_jrs_mois_unite_peche = vm.allnbr_jrs_mois_unite_peche.filter(function(obj) 
                  {
							         return obj.id !== currentItem.id;
						      });
              }
				  } 
          else
          {
              var item = 
              {
                  id:            String(data.response) ,
                  unite_peche:   up[0],
                  max_jrs_peche: vm.nbr_jrs_mois_unite_peche.max_jrs_peche 
              };                
                  vm.allnbr_jrs_mois_unite_peche.push(item);
                  vm.nbr_jrs_mois_unite_peche = {};                 
                  NouvelItem = false;
				  }
					vm.affichageMasque = 0 ;
        }).error(function (data) {
                    alert('Error');
          });                
    }
		
    vm.selection= function (item)
    {
  			vm.selectedItem = item;
  			vm.nouvelItem   = item;
  			currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
  			vm.afficherboutonModifSupr = 1 ;
        vm.afficherboutonModif     = 1 ;
  			vm.affichageMasque         = 0 ;
  			vm.afficherboutonnouveau   = 1 ;
		};
		$scope.$watch('vm.selectedItem', function()
    {
  			if (!vm.allnbr_jrs_mois_unite_peche) return;
  			vm.allnbr_jrs_mois_unite_peche.forEach(function(item)
        {
  				  item.$selected = false;
        });
			 vm.selectedItem.$selected = true;
		});
      //function cache masque de saisie
    
    vm.ajouter = function ()
    {
  			vm.selectedItem.$selected   = false;
  			vm.affichageMasque          = 1 ;
        vm.nbr_jrs_mois_unite_peche = {}; 
  			NouvelItem                  = true ;
        vm.afficherboutonnouveau    = 1 ;
        vm.afficherboutonModifSupr  = 0 ;
        vm.afficherboutonModif      = 0 ;
    };
    
    vm.annuler = function()
    {
        vm.selectedItem             = {} ;
        vm.selectedItem.$selected   = false;
        vm.affichageMasque          = 0 ;
        vm.afficherboutonnouveau    = 1 ;
        vm.afficherboutonModifSupr  = 0 ;
        vm.afficherboutonModif      = 0 ;
        NouvelItem                  = false;
    };
    
    vm.modifier = function()
    {
        NouvelItem         = false ;
        vm.affichageMasque = 1 ;
          
        vm.nbr_jrs_mois_unite_peche.id             = vm.selectedItem.id ;
        vm.nbr_jrs_mois_unite_peche.unite_peche_id = vm.selectedItem.unite_peche.id ; 
        vm.nbr_jrs_mois_unite_peche.max_jrs_peche  = parseInt(vm.selectedItem.max_jrs_peche) ;
        vm.afficherboutonModifSupr                 = 0;
        vm.afficherboutonModif                     = 1;
        vm.afficherboutonnouveau                   = 0;
    };
    
    vm.supprimer = function()
    {
        vm.affichageMasque         = 0 ;
        vm.afficherboutonModifSupr = 0 ;
        vm.afficherboutonModif     = 0 ;
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
            vm.ajout(vm.selectedItem,1);
          }, function() {
            //alert('rien');
          });
    };

    function test_existance (item,suppression)
    {          
        if (suppression!=1)
        {
           var nbr = vm.allnbr_jrs_mois_unite_peche.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(nbr[0])
                {
                   if((nbr[0].unite_peche.id!=item.unite_peche_id)
                      || (nbr[0].max_jrs_peche!=item.max_jrs_peche))                    
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
