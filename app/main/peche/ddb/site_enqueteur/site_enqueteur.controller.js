(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.site_enqueteur')
        .controller('Site_enqueteurController', Site_enqueteurController);
    /** @ngInject */
    function Site_enqueteurController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
    vm.site_enqueteur={};
		vm.allsite_enqueteur = [] ;     
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
		vm.site_enqueteur_column = [{titre:"Site d'embarquement"},{titre:"Enqueteur"}];		

    apiFactory.getAll("site_embarquement/index").then(function(result)
    {
        vm.allsite_embarquement = result.data.response;
    });
    apiFactory.getAll("enqueteur/index").then(function(result)
    {
        vm.allenqueteur = result.data.response;
    });

    apiFactory.getAll("site_enqueteur/index").then(function(result)
    {
      vm.allsite_enqueteur = result.data.response;      
    });

    function ajout(site_enqueteur,suppression)
    {
        if (NouvelItem==false)
        {
            test_existance (site_enqueteur,suppression); 
        } 
        else 
        {
            insert_in_base(site_enqueteur,suppression);
        }
    }
    
    function insert_in_base(site_enqueteur,suppression)
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
                site_embarquement_id: site_enqueteur.site_embarquement_id,
                enqueteur_id: site_enqueteur.enqueteur_id             
        });
        
        //factory
        apiFactory.add("site_enqueteur/index",datas, config).success(function (data)
        {
          var site = vm.allsite_embarquement.filter(function(obj)
          {
              return obj.id == vm.site_enqueteur.site_embarquement_id;
          });

          var enq = vm.allenqueteur.filter(function(obj)
          {
              return obj.id == vm.site_enqueteur.enqueteur_id;
          });
				  if (NouvelItem == false)
          {               
              if(suppression==0)
              {
      						vm.selectedItem.site_embarquement = site[0];
                  vm.selectedItem.enqueteur = enq[0];
      						vm.afficherboutonModifSupr = 0 ;
      						vm.afficherboutonnouveau = 1 ;
      						vm.selectedItem.$selected = false;
      						vm.selectedItem ={};

              } 
              else
              {    
						      vm.allsite_enqueteur = vm.allsite_enqueteur.filter(function(obj) 
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
                  enqueteur: enq[0], 
              };                
                  vm.allsite_enqueteur.push(item);
                  vm.site_enqueteur={};                 
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
  			if (!vm.allsite_enqueteur) return;
  			vm.allsite_enqueteur.forEach(function(item)
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
        vm.site_enqueteur={}; 
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
          
        vm.site_enqueteur.id = vm.selectedItem.id ;
        vm.site_enqueteur.site_embarquement_id = vm.selectedItem.site_embarquement.id ;
        vm.site_enqueteur.enqueteur_id = vm.selectedItem.enqueteur.id ; 

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
           var site_e = vm.allsite_enqueteur.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(site_e[0])
                {
                   if((site_e[0].site_embarquement.id!=item.site_embarquement_id) 
                      || (site_e[0].enqueteur.id!=item.enqueteur_id))                    
                      { 
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0;
                      }
                      else
                      {  
                         vm.affichageMasque = 0;
                      }
                }
           /* vm.allsite_enqueteur.forEach(function(site)
            {               
                if (site.id==item.id)
                {
                    if((site.site_embarquement.id!=item.site_embarquement_id) 
                      || (site.enqueteur.id!=item.enqueteur_id))
                    {
                        insert_in_base(item,suppression);
                        vm.affichageMasque = 0 ;
        						} 
                    else 
                    {
        							vm.affichageMasque = 0 ;
        						}
                }
            });*/
        }  else
              insert_in_base(item,suppression);
    }
  }
})();
