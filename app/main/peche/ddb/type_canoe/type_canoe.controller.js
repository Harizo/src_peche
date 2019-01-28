(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.type_canoe')
        .controller('Type_canoeController', Type_canoeController);
    /** @ngInject */
    function Type_canoeController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
		vm.alltype_canoe = [] ;     
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
		vm.type_canoe_column = [{titre:"Code"},{titre:"nom"}];
		apiFactory.getAll("type_canoe/index").then(function(result) {
			vm.alltype_canoe = result.data.response;    
		});
       function ajout(type_canoe,suppression) {
              if (NouvelItem==false) {
                test_existance (type_canoe,suppression); 
              } else {
                insert_in_base(type_canoe,suppression);
              }
        }
        function insert_in_base(type_canoe,suppression) {
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
                code: type_canoe.code,
                nom: type_canoe.nom,
                              
            });
            //factory
            apiFactory.add("type_canoe/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
                    // Update or delete: id exclu                 
                    if(suppression==0) {
						vm.selectedItem.nom = vm.type_canoe.nom;
						vm.selectedItem.code = vm.type_canoe.code;
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};
            vm.table=1;
                    } else {    
						vm.alltype_canoe = vm.alltype_canoe.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				}  else {
                    var item = {
                        nom: type_canoe.nom,
                        code: type_canoe.code,
                        id:String(data.response) ,
                    };                
                    vm.alltype_canoe.push(item);
                    vm.type_canoe = {} ;                   
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
			if (!vm.alltype_canoe) return;
			vm.alltype_canoe.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
      //function cache masque de saisie
        vm.ajouter = function () {
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 1 ;
      vm.table=0;
			vm.type_canoe = {} ;
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
          vm.type_canoe.id = vm.selectedItem.id ;
          vm.type_canoe.code = vm.selectedItem.code ;
          vm.type_canoe.nom = vm.selectedItem.nom ;
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
                vm.alltype_canoe.forEach(function(reg) {               
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
