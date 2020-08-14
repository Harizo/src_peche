(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.type_navire')
        .controller('Type_navireController', Type_navireController);
    /** @ngInject */
    function Type_navireController($mdDialog, $scope, apiFactory, $state)  {
		var vm = this;
		vm.ajout        = ajout ;
		var NouvelItem  = false;
		var current_selected_item={};
		vm.selectedItemTypenavire={};
    vm.alltype_navire = []; 
		vm.afficherboutonnouveau = 1 ;
		vm.affichageMasque       = 0 ;
    //affichage md-select
		//style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
		vm.type_navire_column = [{titre:"Libellé"}];		

    apiFactory.getAll("SIP_type_navire/index").then(function(result)
    {
        vm.alltype_navire = result.data.response;
    });
		// DEBUT TYPE NAVIRE
		// Clic sur un enregistrement type navire
        vm.selectionTypenavire= function (item) {     
            vm.selectedItemTypenavire = item;
			current_selected_item = angular.copy(vm.selectedItemTypenavire);
        };
		// $watch pour sélectionner ou désélectionner automatiquement un item du type navire
        $scope.$watch('vm.selectedItemTypenavire', function() {
			if (!vm.alltype_navire) return;
			vm.alltype_navire.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemTypenavire.$selected = true;
        });
        // Ajout d'un nouvel item type navire
        vm.ajouterTypenavire = function () {
            vm.selectedItemTypenavire.$selected = false;
            NouvelItem = true ;
		    var items = {
				$edit: true,
				$selected: true,
				id:'0',
				supprimer:0,
                libelle: '',
			};
			vm.alltype_navire.unshift(items);
		    vm.alltype_navire.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemTypenavire = it;
				}
			});			
        };
		// Annulation modification d'un item type navire
        vm.annulerTypenavire = function() {
			if (NouvelItem) {				
				vm.alltype_navire.shift();
			} else {
				vm.selectedItemTypenavire.$edit = false;
				vm.selectedItemTypenavire.$selected = false;
				vm.selectedItemTypenavire.libelle = current_selected_item.libelle ;
			}
			vm.selectedItemTypenavire = {} ;
       };
	   // Modification d'un item type navire
        vm.modifierTypenavire = function(item) {
			NouvelItem = false ;
			vm.selectedItemTypenavire.$edit = true;
		};
		// Suppression d'un item type navire
        vm.supprimerTypenavire = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(1);
			}, function() {
			});
        }
		// Test existence doublon libelle
        function test_existence (item,suppression) {    
			if(item.libelle.length > 0) {
				var doublon = 0;
				if (suppression!=1) {
					vm.alltype_navire.forEach(function(dispo) {   
						if((dispo.libelle==item.libelle) && dispo.id!=item.id) {
							doublon=1;	
						} 
					});
					if(doublon==1) {
						vm.showAlert('Information !','ERREUR ! : Libellé déjà utilisé')
					} else {
						insert_in_base(item,0);
					}
				} else {
				  insert_in_base(item,suppression);
				}  
			} else {
				vm.showAlert('Erreur',"Veuillez saisir l'intitulé du type de financement !");
			}		
        }
		function ajout(suppression) {
            test_existence (vm.selectedItemTypenavire,suppression);
        }
        function insert_in_base(typenavire,suppression) {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItem==false) {
			   getId = vm.selectedItemTypenavire.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:typenavire.id,      
				libelle: typenavire.libelle,
			});       
			//factory type_navire
			apiFactory.add("SIP_type_navire/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
					// Update or delete: id exclu                   
					if(suppression==0) {
					  vm.selectedItemTypenavire.libelle = typenavire.libelle;
					  vm.selectedItemTypenavire.$selected = false;
					  vm.selectedItemTypenavire.$edit = false;
					  vm.selectedItemTypenavire ={};
					} else {    
						// Suppression type navire
						vm.alltype_navire = vm.alltype_navire.filter(function(obj) {
							return obj.id !== vm.selectedItemTypenavire.id;
						});
						vm.selectedItemTypenavire ={};
					}
				} else {
					typenavire.id=data.response;	
					NouvelItem=false;
					vm.selectedItemTypenavire ={};
				}
				typenavire.$selected=false;
				typenavire.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
	// FIN TYPE NAVIRE	
    vm.showAlert = function(msg,titre)
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
