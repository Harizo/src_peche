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

    apiFactory.getAll("site_enqueteur/index").then(function(result) {
      vm.allsite_enqueteur = result.data.response;

    });
       function ajout(site_enqueteur,suppression) {
              if (NouvelItem==false) {
                test_existance (site_enqueteur,suppression); 
              } else {
                insert_in_base(site_enqueteur,suppression);
              }
        }
        function insert_in_base(site_enqueteur,suppression) {
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
                site_embarquement_id: site_enqueteur.site_embarquement_id,
                enqueteur_id: site_enqueteur.enqueteur_id             
            });
            //console.log(site_enqueteur.pays_id);
            //factory
            apiFactory.add("site_enqueteur/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
                    // Update or delete: id exclu                 
                    if(suppression==0) {
						vm.selectedItem.site_embarquement_id = vm.site_enqueteur.site_embarquement_id;
            vm.selectedItem.site_embarquement_nom = vm.site_enqueteur.site_embarquement_nom;
            vm.selectedItem.enqueteur_id = vm.site_enqueteur.enqueteur_id;
            vm.selectedItem.enqueteur_nom = vm.site_enqueteur.enqueteur_nom;
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};

                    } else {    
						vm.allsite_enqueteur = vm.allsite_enqueteur.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				}  else {
                    var item = {
                        id:String(data.response) ,
                       site_embarquement_id: site_enqueteur.site_embarquement_id,
                        site_embarquement_nom: site_enqueteur.site_embarquement_nom,
                       enqueteur_id: site_enqueteur.enqueteur_id,
                        enqueteur_nom: site_enqueteur.enqueteur_nom, 
                    };                
                    vm.allsite_enqueteur.push(item);
                    vm.site_enqueteur.site_embarquement_id='';
                    vm.site_enqueteur.enqueteur_id='';                 
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
			if (!vm.allsite_enqueteur) return;
			vm.allsite_enqueteur.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});
      //function cache masque de saisie
        vm.ajouter = function () {
			vm.selectedItem.$selected = false;
			vm.affichageMasque = 1 ;
      vm.site_enqueteur={}; 
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
          
          vm.site_enqueteur.id = vm.selectedItem.id ;
          
          vm.allsite_embarquement.forEach(function(site) {
            if(site.id==vm.selectedItem.site_embarquement_id) {
              vm.site_enqueteur.site_embarquement_id = site.id ;
              vm.site_enqueteur.site_embarquement_nom = site.libelle ;
            }
          });
          vm.allenqueteur.forEach(function(enque) {
            if(enque.id==vm.selectedItem.enqueteur_id) {
              vm.site_enqueteur.enqueteur_id = enque.id ;
              vm.site_enqueteur.enqueteur_nom = enque.nom ;

            }
          
          }); 

          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0; 
          //console.log(vm.site_enqueteur); 
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

        vm.modifiersite_embarquement = function (item) 
        {
          vm.allsite_embarquement.forEach(function(site) {
              if(site.id==item.site_embarquement_id) {
                 item.site_embarquement_id = site.id; 
                 item.site_embarquement_nom = site.libelle;
                 
              }
          });
        }
        vm.modifierenqueteur = function (item) 
        {
          vm.allenqueteur.forEach(function(enque) {
              if(enque.id==item.enqueteur_id) {
                 item.enqueteur_id = enque.id; 
                 item.enqueteur_nom = enque.nom;
                 
              }
          });
        }
        function test_existance (item,suppression) {          
            if (suppression!=1) {
                vm.allsite_enqueteur.forEach(function(site) {               
					if (site.id==item.id) {
						 if((site.site_embarquement_id!=item.site_embarquement_id) || (site.enqueteur_id!=item.enqueteur_id)) {
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
