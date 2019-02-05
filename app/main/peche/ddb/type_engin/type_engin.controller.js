(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.type_engin')
        .controller('Type_enginController', Type_enginController);
    /** @ngInject */
    function Type_enginController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		vm.ajout = ajout ;
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
    vm.table=1;
		vm.type_engin_column = [{titre:"Code"},{titre:"libelle"}];
    
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
                libelle: type_engin.libelle,
                              
            });
            //factory
            apiFactory.add("type_engin/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
                    // Update or delete: id exclu                 
                    if(suppression==0) {
						vm.selectedItem.libelle = vm.type_engin.libelle;
						vm.selectedItem.code = vm.type_engin.code;
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
                        libelle: type_engin.libelle,
                        code: type_engin.code,
                        id:String(data.response) ,
                    };                
                    vm.alltype_engin.push(item);
                    vm.type_engin = {} ;                   
                    NouvelItem=false;
				}  vm.table=1;
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
      vm.table=0;
			vm.type_engin = {} ;
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
          vm.type_engin.id = vm.selectedItem.id ;
          vm.type_engin.code = vm.selectedItem.code ;
          vm.type_engin.libelle = vm.selectedItem.libelle ;
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
                vm.alltype_engin.forEach(function(reg) {               
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
