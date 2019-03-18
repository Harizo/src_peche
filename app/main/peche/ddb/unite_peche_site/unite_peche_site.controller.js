(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.unite_peche_site')
        .controller('Unite_peche_siteController', Unite_peche_siteController);
    /** @ngInject */
    function Unite_peche_siteController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
    vm.unite_peche_site={};
		vm.allunite_peche_site = [] ;     
		//variale affichage bouton nouveau
		vm.afficherboutonnouveau = 1 ;
		//variable cache masque de saisie
		vm.affichageMasque = 0 ;
		//style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.unite_peche_site_column = [{titre:"Site d'embarquement"},{titre:"unite de peche"},{titre:"nombre d'echantillon"}];		

    apiFactory.getAll("site_embarquement/index").then(function(result)
    {
        vm.allsite_embarquement = result.data.response;
    });
    apiFactory.getAll("unite_peche/index").then(function(result)
    {
        vm.allunite_peche = result.data.response;
    });

    apiFactory.getAll("unite_peche_site/index").then(function(result)
    {
      vm.allunite_peche_site = result.data.response;
    });

    function ajout(unite_peche_site,suppression)
    {
        if (NouvelItem==false)
        {
            test_existance (unite_peche_site,suppression); 
        } 
        else 
        {
            insert_in_base(unite_peche_site,suppression);
        }
    }
    
    function insert_in_base(unite_peche_site,suppression)
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
                supprimer:suppression,
                id:getId,      
                site_embarquement_id: unite_peche_site.site_embarquement_id,
                unite_peche_id: unite_peche_site.unite_peche_id,
                nbr_echantillon: unite_peche_site.nbr_echantillon              
        });
        
        //factory
        apiFactory.add("unite_peche_site/index",datas, config).success(function (data)
        {
          var site = vm.allsite_embarquement.filter(function(obj)
          {
              return obj.id == vm.unite_peche_site.site_embarquement_id;
          });

          var up = vm.allunite_peche.filter(function(obj)
          {
              return obj.id == vm.unite_peche_site.unite_peche_id;
          });
				  if (NouvelItem == false)
          {               
              if(suppression==0)
              {
      						vm.selectedItem.site_embarquement = site[0];
                  vm.selectedItem.unite_peche= up[0];
                  vm.selectedItem.nbr_echantillon=vm.unite_peche_site.nbr_echantillon;
      						vm.afficherboutonModifSupr = 0 ;
      						vm.afficherboutonnouveau = 1 ;
      						vm.selectedItem.$selected = false;
      						vm.selectedItem ={};

              } 
              else
              {    
						      vm.allunite_peche_site = vm.allunite_peche_site.filter(function(obj) 
                  {
							         return obj.id !== currentItem.id;
						      });
              }
				  } 
          else
          {
              var item = 
              {
                  id:String(data.response) ,
                  site_embarquement: site[0],
                  unite_peche: up[0],
                  nbr_echantillon:vm.unite_peche_site.nbr_echantillon 
              };                
                  vm.allunite_peche_site.push(item);
                  vm.unite_peche_site={};                 
                  NouvelItem=false;
				  }
					vm.affichageMasque = 0 ;
        }).error(function (data) {
                    alert('Error');
          });                
    }
		
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
  			if (!vm.allunite_peche_site) return;
  			vm.allunite_peche_site.forEach(function(item)
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
        vm.unite_peche_site={}; 
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
    
    vm.modifier = function()
    {
        NouvelItem = false ;
        vm.affichageMasque = 1 ;
          
        vm.unite_peche_site.id = vm.selectedItem.id ;
        vm.unite_peche_site.site_embarquement_id = vm.selectedItem.site_embarquement.id ;
        vm.unite_peche_site.unite_peche_id = vm.selectedItem.unite_peche.id ; 
        vm.unite_peche_site.nbr_echantillon = parseInt(vm.selectedItem.nbr_echantillon) ;
        vm.afficherboutonModifSupr = 0;
        vm.afficherboutonnouveau = 0;
    };
    
    vm.supprimer = function()
    {
        vm.affichageMasque = 0 ;
        vm.afficherboutonModifSupr = 0 ;
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
            vm.allunite_peche_site.forEach(function(site)
            {               
                if (site.id==item.id)
                {
                    if((site.site_embarquement.id!=item.site_embarquement_id) 
                      || (site.unite_peche.id!=item.unite_peche_id)
                      || (site.nbr_echantillon!=item.nbr_echantillon))
                    {
                        insert_in_base(item,suppression);
                        vm.affichageMasque = 0 ;
        						} 
                    else 
                    {
        							vm.affichageMasque = 0 ;
        						}
                }
            });
        }  else
              insert_in_base(item,suppression);
    }
  }
})();
