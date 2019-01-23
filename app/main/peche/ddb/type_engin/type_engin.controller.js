(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.type_engin')
        .controller('Type_enginController', Type_enginController);
    /** @ngInject */
    function Type_enginController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		/*vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
		vm.alltype_engin = [] ;     
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
		vm.type_engin_column = [{titre:"Code"},{titre:"Nom"},{titre:"superficie(km2)"}];
		apiFactory.getAll("type_engin/index").then(function(result) {
			vm.alltype_engin = result.data.response;    
		});
       function ajout(type_engin,suppression) {
              if (NouvelItem==false) {
                test_existance (type_engin,suppression); 
              } else {
                insert_in_base(type_engin,suppression);
              }
        }
        function insert_in_base(type_engin,suppression) {
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
                code: type_engin.code,
                nom: type_engin.nom,
                surface:type_engin.surface,               
            });
            //factory
            apiFactory.add("type_engin/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
                    // Update or delete: id exclu                 
                    if(suppression==0) {
						vm.selectedItem.nom = vm.type_engin.nom;
						vm.selectedItem.code = vm.type_engin.code;
						vm.selectedItem.surface = vm.type_engin.surface;
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};
                    } else {    
						vm.alltype_engin = vm.alltype_engin.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				}  else {
                    var item = {
                        nom: type_engin.nom,
                        code: type_engin.code,
                        id:String(data.response) ,
                        surface:type_engin.surface 
                    };                
                    vm.alltype_engin.push(item);
                    vm.type_engin = {} ;                   
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
			if (!vm.alltype_engin) return;
			vm.alltype_engin.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
      //function cache masque de saisie
        vm.ajouter = function () {
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 1 ;
			vm.type_engin = {} ;
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
          vm.type_engin.id = vm.selectedItem.id ;
          vm.type_engin.code = vm.selectedItem.code ;
          vm.type_engin.nom = vm.selectedItem.nom ;
		  if(vm.selectedItem.surface) {
			vm.type_engin.surface = parseInt(vm.selectedItem.surface) ;
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
        function test_existance (item,suppression) {          
            if (suppression!=1) {
                vm.alltype_engin.forEach(function(reg) {               
					if (reg.id==item.id) {
						// if((reg.nom!=item.nom) || (reg.code!=item.code) || (reg.surface!=item.surface)) {
							insert_in_base(item,suppression);
							vm.affichageMasque = 0 ;
					/*	} else {
							vm.affichageMasque = 0 ;
						}
					}
                });
            }  else
              insert_in_base(item,suppression);
        }*/
    }
})();
