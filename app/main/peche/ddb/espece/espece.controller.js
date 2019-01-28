(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.espece')
        .controller('EspeceController', EspeceController);
    /** @ngInject */
    function EspeceController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
		vm.allespece = [] ;     
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
    vm.table=1;
		vm.espece_column = [{titre:"Code"},{titre:"Nom_locale"},{titre:"Nom_scientifique"}];
		apiFactory.getAll("espece/index").then(function(result) {
			vm.allespece = result.data.response;    
		});
       function ajout(espece,suppression) {
              if (NouvelItem==false) {
                test_existance (espece,suppression); 
              } else {
                insert_in_base(espece,suppression);
              }
        }
        function insert_in_base(espece,suppression) {
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
                code: espece.code,
                nom_locale: espece.nom_locale,
                nom_scientifique: espece.nom_scientifique,
                              
            });
            //factory
            apiFactory.add("espece/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
                    // Update or delete: id exclu                 
                    if(suppression==0) {
						vm.selectedItem.nom_locale = vm.espece.nom_locale;
            vm.selectedItem.nom_scientifique= vm.espece.nom_scientifique;
						vm.selectedItem.code = vm.espece.code;
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};
            vm.table=1;
                    } else {    
						vm.allespece = vm.allespece.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				}  else {
                    var item = {
                        nom_locale: espece.nom_locale,
                         nom_scientifique: espece.nom_scientifique,
                        code: espece.code,
                        id:String(data.response) ,
                    };                
                    vm.allespece.push(item);
                    vm.espece = {} ;                   
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
			if (!vm.allespece) return;
			vm.allespece.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
      //function cache masque de saisie
        vm.ajouter = function () {
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 1 ;
      vm.table=0;
			vm.espece = {} ;
			NouvelItem = true ;
        };
        vm.annuler = function() {
          vm.selectedItem = {} ;
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          vm.table=1;
          NouvelItem = false;
        };
        vm.modifier = function() {
          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.espece.id = vm.selectedItem.id ;
          vm.espece.code = vm.selectedItem.code ;
          vm.espece.nom_locale = vm.selectedItem.nom_locale ;
          vm.espece.nom_scientifique = vm.selectedItem.nom_scientifique ;
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0;
          vm.table=0;  
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
                vm.allespece.forEach(function(reg) {               
					if (reg.id==item.id) {
							insert_in_base(item,suppression);
							vm.affichageMasque = 0 ;
						} else {
							vm.affichageMasque = 0 ;
						}
					}
                )
            }  else
              insert_in_base(item,suppression);
        }
    }
})();
