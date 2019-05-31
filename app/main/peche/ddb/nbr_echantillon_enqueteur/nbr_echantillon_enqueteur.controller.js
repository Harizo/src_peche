(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.nbr_echantillon_enqueteur')
        .controller('Nbr_echantillon_enqueteurController', Nbr_echantillon_enqueteurController);
    /** @ngInject */
    function Nbr_echantillon_enqueteurController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		vm.ajout        = ajout ;
		var NouvelItem  = false;
		var currentItem;
		vm.selectedItem = {} ;
    vm.allsite_embarquement = []; 
    vm.allenqueteur         = [];
    vm.allunite_peche       = []; 
    vm.allnbr_echantillon_enqueteur = [];
		vm.afficherboutonnouveau = 1 ;
		vm.affichageMasque       = 0 ;
    //affichage md-select
    vm.site_embarquement     =false;
    vm.unite_peche           =false;
    vm.max_nbEchantillon     =0;
		//style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.nbr_echantillon_enqueteur_column = [{titre:"Equeteur"},{titre:"Site d'embarquement"},{titre:"unite de peche"},{titre:"nombre d'echantillon"}];		

    apiFactory.getAll("unite_peche/index").then(function(result)
    {
        vm.allunite_peche = result.data.response;
    });
    apiFactory.getAll("nbr_echantillon_enqueteur/index").then(function(result)
    {vm.allnbr_echantillon_enqueteur = result.data.response;});
    
    apiFactory.getAll("enqueteur/index").then(function(result)
    {vm.allenqueteur = result.data.response;});

    function ajout(nbr_echantillon_enqueteur,suppression)
    {
        if (NouvelItem==false)
        {
            test_existance (nbr_echantillon_enqueteur,suppression); 
        } 
        else 
        {
            insert_in_base(nbr_echantillon_enqueteur,suppression);
        }
    }
    
    function insert_in_base(nbr_echantillon_enqueteur,suppression)
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
                site_embarquement_id: nbr_echantillon_enqueteur.site_embarquement_id,
                enqueteur_id:         nbr_echantillon_enqueteur.enqueteur_id,
                unite_peche_id:       nbr_echantillon_enqueteur.unite_peche_id,
                nbr_max_echantillon:  nbr_echantillon_enqueteur.nbr_max_echantillon              
        });
        
        //factory
        apiFactory.add("nbr_echantillon_enqueteur/index",datas, config).success(function (data)
        {
          var site = vm.allsite_embarquement.filter(function(obj)
          {
              return obj.id == vm.nbr_echantillon_enqueteur.site_embarquement_id;
          });

          var up = vm.allunite_peche.filter(function(obj)
          {
              return obj.id == vm.nbr_echantillon_enqueteur.unite_peche_id;
          });

          var enq = vm.allenqueteur.filter(function(obj)
          {
              return obj.id == vm.nbr_echantillon_enqueteur.enqueteur_id;
          });
          
				  if (NouvelItem == false)
          {               
              if(suppression==0)
              {
      						vm.selectedItem.site_embarquement = site[0];
                  vm.selectedItem.unite_peche = up[0];
                  vm.selectedItem.enqueteur   = enq[0];
                  vm.selectedItem.nbr_max_echantillon = vm.nbr_echantillon_enqueteur.nbr_max_echantillon;
      						vm.afficherboutonModifSupr = 0 ;
                  vm.afficherboutonModif     = 0 ;
      						vm.afficherboutonnouveau   = 1 ;
      						vm.selectedItem.$selected  = false;
      						vm.selectedItem            = {};

              } 
              else
              {    
						      vm.allnbr_echantillon_enqueteur = vm.allnbr_echantillon_enqueteur.filter(function(obj) 
                  {
							         return obj.id !== currentItem.id;
						      });
              }
				  } 
          else
          {
              var item = 
              {
                  id:                 String(data.response) ,
                  site_embarquement:  site[0],
                  unite_peche:        up[0],
                  enqueteur:          enq[0],
                  nbr_max_echantillon:vm.nbr_echantillon_enqueteur.nbr_max_echantillon 
              };                
                  vm.allnbr_echantillon_enqueteur.push(item);
                  vm.nbr_echantillon_enqueteur={};                 
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
  			vm.nouvelItem   = item;
  			currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
  			vm.afficherboutonModifSupr = 1 ;
        vm.afficherboutonModif     = 1 ;
  			vm.affichageMasque         = 0 ;
  			vm.afficherboutonnouveau   = 1 ;
		};
		$scope.$watch('vm.selectedItem', function()
    {
  			if (!vm.allnbr_echantillon_enqueteur) return;
  			vm.allnbr_echantillon_enqueteur.forEach(function(item)
        {
  				  item.$selected = false;
        });
			 vm.selectedItem.$selected = true;
		});
      //function cache masque de saisie
    
    vm.ajouter = function ()
    {
  			vm.selectedItem.$selected    = false;
  			vm.affichageMasque           = 1 ;
        vm.nbr_echantillon_enqueteur ={}; 
  			NouvelItem = true ;
        vm.afficherboutonModifSupr = 0;
        vm.afficherboutonModif     = 0;
        vm.afficherboutonnouveau   = 1;
        vm.site_embarquement       = false;
        vm.unite_peche             = false;
        vm.enableUnite_peche       = false;
    };
    
    vm.annuler = function()
    {
        vm.selectedItem            = {} ;
        vm.selectedItem.$selected  = false;
        vm.affichageMasque         = 0 ;
        vm.afficherboutonnouveau   = 1 ;
        vm.afficherboutonModifSupr = 0 ;
        vm.afficherboutonModif     = 0 ;
        NouvelItem                 = false;
    };
    
    vm.modifier = function()
    {
        NouvelItem           = false ;
        vm.affichageMasque   = 1 ;
        vm.site_embarquement = true;
        vm.unite_peche       = true;
        vm.enableUnite_peche = true;  
        vm.nbr_echantillon_enqueteur.id = vm.selectedItem.id ;
        vm.nbr_echantillon_enqueteur.site_embarquement_id = vm.selectedItem.site_embarquement.id ;
        vm.nbr_echantillon_enqueteur.unite_peche_id       = vm.selectedItem.unite_peche.id ;
        vm.nbr_echantillon_enqueteur.enqueteur_id         = vm.selectedItem.enqueteur.id ; 
        vm.nbr_echantillon_enqueteur.nbr_max_echantillon  = parseInt(vm.selectedItem.nbr_max_echantillon) ;
        vm.afficherboutonModifSupr = 0;
        vm.afficherboutonModif     = 1;
        vm.afficherboutonnouveau   = 0;
        apiFactory.getFils("site_enqueteur/index",vm.selectedItem.enqueteur.id).then(function(result)
        {
            vm.allsite_embarquement = result.data.response;
        });
        apiFactory.getFils("unite_peche_site/index",vm.selectedItem.site_embarquement.id).then(function(result)
        {
            vm.allunite_peche_site = result.data.response;
        });

        apiFactory.getAPIgeneraliserREST("nbr_echantillon_enqueteur/index","menus","nbr_echantillon",
          "id_unite_peche",vm.selectedItem.unite_peche.id,"id_site_embarquement",
          vm.selectedItem.site_embarquement.id).then(function(result)
      {
        var nbr_predefini = parseInt(result.data.response.nbr_echantillon_predefini);           
        vm.max_nbEchantillon = nbr_predefini;          
      });
    };
    
    vm.supprimer = function()
    {
        vm.affichageMasque = 0 ;
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
            var ups = vm.allnbr_echantillon_enqueteur.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(ups[0])
                {
                   if((ups[0].site_embarquement.id!=item.site_embarquement_id) 
                      || (ups[0].unite_peche.id!=item.unite_peche_id)
                      || (ups[0].enqueteur.id!=item.enqueteur_id)
                      || (ups[0].nbr_max_echantillon!=item.nbr_max_echantillon))                    
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

    vm.modifierenqueteur = function (item)
    {
        if(item.enqueteur_id)
        {
            vm.site_embarquement=true;
            apiFactory.getFils("site_enqueteur/index",item.enqueteur_id).then(function(result)
            {
                vm.allsite_embarquement = result.data.response;
               // console.log(vm.allsite_embarquement);
            });
        }          
    }
    vm.modifiersite_embarquement= function (item)
    {
        if(item.site_embarquement_id)
        {
            vm.unite_peche=true;
          apiFactory.getFils("unite_peche_site/index",item.site_embarquement_id).then(function(result)
          {
              vm.allunite_peche_site = result.data.response;
          });
        }          
    }

    vm.modifierunite_peche = function (item)
    {
        var unite_peche_recent = 0;
        if (vm.selectedItem.$selected) 
        {
          unite_peche_recent = vm.selectedItem.unite_peche.id;
        }
        if(unite_peche_recent!=item.unite_peche_id)
        { 
          var unite_peche_exist = vm.allnbr_echantillon_enqueteur.filter(function(obj)
            {
              return obj.unite_peche.id == item.unite_peche_id;
            });
            
          if (unite_peche_exist[0]) 
          {
            vm.enableUnite_peche = false;
            var msg = 'Cet unité de peche exist déjà'
            var titre = 'Selection impossible'
            vm.dialog(msg,titre);
            
          }
          else
          {
            vm.enableUnite_peche = true;
          }
            
        }
        else
        {
          vm.enableUnite_peche = true;
        }

      apiFactory.getAPIgeneraliserREST("nbr_echantillon_enqueteur/index","menus","nbr_echantillon",
          "id_unite_peche",item.unite_peche_id,"id_site_embarquement",
      item.site_embarquement_id).then(function(result)
      {
        var nbr_predefini = parseInt(result.data.response.nbr_echantillon_predefini);           
        vm.max_nbEchantillon = nbr_predefini;        
                  
      });
    }

    vm.dialog = function(msg,titre)
      {
        $mdDialog.show(
                    $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title(titre)
                      .textContent(msg)
                      .ariaLabel('Offscreen Demo')
                      .parent(angular.element(document.body))
                      .ok('Fermer')
                      // Or you can specify the rect to do the transition from
                      .openFrom({
                        top: -50,
                        width: 30,
                        height: 80
                      })
                      .closeTo({
                        left: 1500
                      })
                  );
      }
  }
})();
