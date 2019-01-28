(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.region')
        .controller('RegionController', RegionController);
    /** @ngInject */
    function RegionController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
		vm.allregion = [] ;     
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
		vm.region_column = [{titre:"Code"},{titre:"Nom"},{titre:"Pays"}];		

    apiFactory.getAll("pays/index").then(function(result)
    {
      vm.allpays = result.data.response;
    });

    apiFactory.getAll("region/index").then(function(result) {
      vm.allregionss = result.data.response; 

      for (var i = 0; i < vm.allregionss.length; i++) 
          {
            var item = {
                    id: vm.allregionss[i].id,
                    code: vm.allregionss[i].code,
                    nom: vm.allregionss[i].nom,
                    pays_id: vm.allregionss[i].pays_id,
                    pays_nom: vm.allregionss[i].pays.nom                   
                };
                
                vm.allregion.push(item);             
          }


    });
       function ajout(region,suppression) {
              if (NouvelItem==false) {
                test_existance (region,suppression); 
              } else {
                insert_in_base(region,suppression);
              }
        }
        function insert_in_base(region,suppression) {
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var getId = 0;
            if (NouvelItem==false) {
               getId = vm.selectedItem.id; 
            } 
            var datas = $.param({
                supprimer:suppression,
                id:getId,      
                code: region.code,
                nom: region.nom,
                pays_id: region.pays_id               
            });
            //console.log(region.pays_id);
            //factory
            apiFactory.add("region/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
                    // Update or delete: id exclu                 
                    if(suppression==0) {
						vm.selectedItem.nom = vm.region.nom;
						vm.selectedItem.code = vm.region.code;
						vm.selectedItem.pays_id = vm.region.pays_id;
            vm.selectedItem.pays_nom = vm.region.pays_nom;
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};
                    } else {    
						vm.allregion = vm.allregion.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				}  else {
                    var item = {
                        nom: region.nom,
                        code: region.code,
                        id:String(data.response) ,
                       pays_id: region.pays_id,
                        pays_nom: region.pays_nom, 
                    };                
                    vm.allregion.push(item);
                    vm.region.code='';
                    vm.region.nom='';
                    vm.region.pays_id='';                
                    NouvelItem=false;
				}
					vm.affichageMasque = 0 ;
                }).error(function (data) {
                    alert('Error');
                });                
        }
		vm.selection= function (item) {
			vm.selectedItem = item;
			vm.nouvelItem = item;
			currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
			vm.afficherboutonModifSupr = 1 ;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
		};
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.allregion) return;
			vm.allregion.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
      //function cache masque de saisie
        vm.ajouter = function () {
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 1 ;
			vm.region.code='';
      vm.region.nom='';
      vm.region.pays_id='';
			NouvelItem = true ;
        };
        vm.annuler = function() {
          vm.selectedItem = {} ;
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          NouvelItem = false;
        };
        vm.modifier = function() {
          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.region.id = vm.selectedItem.id ;
          vm.region.code = vm.selectedItem.code ;
          vm.region.nom = vm.selectedItem.nom ;
          vm.allpays.forEach(function(pay) {
            if(pay.id==vm.selectedItem.pays_id) {
              vm.region.pays_id = pay.id ;
              vm.region.pays_nom = pay.nom ;
            }
          });


		  if(vm.selectedItem.surface) {
			vm.region.surface = parseInt(vm.selectedItem.surface) ;
		  }
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0;  
        };
        vm.supprimer = function() {
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
          $mdDialog.show(confirm).then(function() {
            vm.ajout(vm.selectedItem,1);
          }, function() {
            //alert('rien');
          });
        };

        vm.modifierpays = function (item) 
        {
          vm.allpays.forEach(function(pay) {
              if(pay.id==item.pays_id) {
                 item.pays_id = pay.id; 
                 item.pays_nom = pay.nom;
                 
              }
          });
        }
        function test_existance (item,suppression) {          
            if (suppression!=1) {
                vm.allregion.forEach(function(reg) {               
					if (reg.id==item.id) {
						 if((reg.nom!=item.nom) || (reg.code!=item.code) || (dist.pays_id!=item.pays_id)) {
							insert_in_base(item,suppression);
							vm.affichageMasque = 0 ;
						} else {
							vm.affichageMasque = 0 ;
						}
					}
                });
            }  else
              insert_in_base(item,suppression);
        }
    }
})();
