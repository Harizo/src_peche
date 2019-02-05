(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.espece')
        .controller('EspeceController', EspeceController);
    /** @ngInject */
    function EspeceController($mdDialog, $scope, apiFactory, $state,cookieService)  {
		var vm = this;
		vm.ajout = ajout ;
    vm.ajoutEspece_capture = ajoutEspece_capture ;
		var NouvelItem=false;
    var NouvelItemEspece_capture=false;
		var currentItem;
    var currentItemEspece_capture;
		vm.selectedItem = {} ;
    vm.selectedItemEspece_capture = {};
		vm.allespece = [] ; 
    vm.allespece_capture = [] ;     
		//variale affichage bouton nouveau
		vm.afficherboutonnouveau = 1 ;
    vm.afficherboutonnouveauEspece_capture = 0 ;
		//variable cache masque de saisie
		vm.affichageMasque = 0 ;
    vm.affichageMasqueEspece_capture = 0 ;
		//style
		vm.dtOptions = {
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			responsive: true
		};
		//col table
    
		vm.espece_column = [{titre:"Code"},{titre:"Nom local"},{titre:"Nom scientifique"}];
		apiFactory.getAll("espece/index").then(function(result) {
			vm.allespece = result.data.response;

		});
    apiFactory.getAll("fiche_echantillonnage_capture/index").then(function(result) {
      vm.allfiche_echantillonnage_capture = result.data.response;    
    });
    apiFactory.getAll("echantillon/index").then(function(result) {
      vm.allechantillon = result.data.response;    
    });

    vm.espece_capture_column = [{titre:"Fiche Echantillonnage"},{titre:"Echantillon"},{titre:"Capture"},{titre:"Prix"},{titre:"User"},{titre:"Date creation"},{titre:"Date modification"}];
   


       function ajout(espece,suppression) {
              if (NouvelItem==false) {
                test_existance (espece,suppression); 
              } else {
                insert_in_base(espece,suppression);
              }
        }

        function ajoutEspece_capture(espece_capture,suppression) {
              if (NouvelItemEspece_capture==false) {
                test_existanceEspece_capture (espece_capture,suppression); 
              } else {
                insert_in_baseEspece_capture(espece_capture,suppression);
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
                nom_local: espece.nom_local,
                nom_scientifique: espece.nom_scientifique,
                              
            });
            //factory
            apiFactory.add("espece/index",datas, config).success(function (data) {
				if (NouvelItem == false) {
                    // Update or delete: id exclu                 
                    if(suppression==0) {
						vm.selectedItem.nom_local = vm.espece.nom_local;
            vm.selectedItem.nom_scientifique= vm.espece.nom_scientifique;
						vm.selectedItem.code = vm.espece.code;
						vm.afficherboutonModifSupr = 0 ;
						vm.afficherboutonnouveau = 1 ;
						vm.selectedItem.$selected = false;
						vm.selectedItem ={};
            
                    } else {    
						vm.allespece = vm.allespece.filter(function(obj) {
							return obj.id !== currentItem.id;
						});
                    }
				}  else {
                    var item = {
                        nom_local: espece.nom_local,
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

  //*****************************************************************

     function insert_in_baseEspece_capture(espece_capture,suppression)
        {
           
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var getIdEspece_capture = 0;

            if (NouvelItemEspece_capture==false) 
            {
               getIdEspece_capture = vm.selectedItemEspece_capture.id; 
               
            } 
            var datas = $.param(
            {
                supprimer:                        suppression,
                id:                               getIdEspece_capture,
                espece_id:                        vm.selectedItem.id,
                fiche_echantillonnage_capture_id:  espece_capture.fiche_echantillonnage_capture_id,
                echantillon_id:                    espece_capture.echantillon_id,
                capture:                           espece_capture.capture,
                prix:                              espece_capture.prix,
                user_id:                           cookieService.get("id")
                
            });
          
            //factory
            apiFactory.add("espece_capture/index",datas, config)
                .success(function (data) {

                  if (NouvelItemEspece_capture == false) 
                  {
                    // Update or delete: id exclu
                    var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
                    if(suppression==0) 
                    { // vm.selectedItem ={};                    
                      vm.selectedItemEspece_capture.fiche_echantillonnage_capture_id = vm.espece_capture.fiche_echantillonnage_capture_id;
                      vm.selectedItemEspece_capture.fiche_echantillonnage_capture_nom = vm.espece_capture.fiche_echantillonnage_capture_nom;
                      vm.selectedItemEspece_capture.echantillon_id  = vm.espece_capture.echantillon_id;
                      vm.selectedItemEspece_capture.echantillon_nom  = vm.espece_capture.echantillon_nom;

                      vm.selectedItemEspece_capture.capture = vm.espece_capture.capture;
                      vm.selectedItemEspece_capture.prix = vm.espece_capture.prix;
                      
                      vm.selectedItemEspece_capture.user_id  = cookieService.get("id");
                      vm.selectedItemEspece_capture.user_nom = cookieService.get("nom");
                      
                      vm.selectedItemEspece_capture.date_creation = vm.espece_capture.date_creation;
                      vm.selectedItemEspece_capture.date_modification = current_date;
                      
                      vm.afficherboutonModifSuprEspece_capture = 0 ;
                      vm.afficherboutonnouveauEspece_capture = 1 ;
                      vm.selectedItemEspece_capture.$selected = false;
                      
                      vm.selectedItemEspece_capture ={};
                       
                      //console.log(vm.espece_capture);
                    } 
                    else 
                    {    
                      vm.allespece_capture = vm.allespece_capture.filter(function(obj) {

                        return obj.id !== currentItemEspece_capture.id;
                      });
                    }
                  }
                  else
                  {   /*var today = new Date();
                      var date = today.getDate();
                      var month = today.getMonth()+1;
                      var year = today.getFullYear();
                      var current_date = year+'-'+month+'-'+date; */
                      var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");

                    var item = {
                        fiche_echantillonnage_capture_id: espece_capture.fiche_echantillonnage_capture_id,
                        fiche_echantillonnage_capture_nom:espece_capture.fiche_echantillonnage_capture_nom,
                        echantillon_id:                   espece_capture.echantillon_id,
                        echantillon_nom:                  espece_capture.echantillon_nom,
                        capture:                          espece_capture.capture,
                        prix:                             espece_capture.prix,                        
                        user_id:                          cookieService.get("id"),
                        user_nom:                         cookieService.get("nom"),
                        date_creation:                    current_date,
                        date_modification:                current_date,
                        id:                   String(data.response) 
                    };
        
                    vm.allespece_capture.push(item);

                    vm.espece_capture.fiche_echantillonnage_capture_id='';
                    vm.espece_capture.echantillon_id='';
                    vm.espece_capture.capture='';
                    vm.espece_capture.prix='';
                    vm.espece_capture.user_id='';
                    vm.espece_capture.user_nom='';                    
                    vm.espece_capture.date_creation='';
                    vm.espece_capture.date_modification='';                  
                    
                    NouvelItemEspece_capture=false;
                  }

                  vm.affichageMasqueEspece_capture = 0 ;

                })
                .error(function (data) {
                    alert('Error');
                });
                
        }

      //*****************************************************************

		vm.selection= function (item) {
			vm.selectedItem = item;
			vm.nouvelItem = item;
			currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
			vm.afficherboutonModifSupr = 1 ;
			vm.affichageMasque = 0 ;
			vm.afficherboutonnouveau = 1 ;
      vm.afficherboutonnouveauEspece_capture = 1 ;
      vm.allespece_capture = [];
          apiFactory.getFils("espece_capture/index",item.id).then(function(result)
          {
            vm.allespece_capture = result.data.response;
          
          });
		};
		$scope.$watch('vm.selectedItem', function() {
			if (!vm.allespece) return;
			vm.allespece.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});


    vm.selectionEspece_capture= function (item) {
  //      vm.modifiercategorie(item);
        
          vm.selectedItemEspece_capture = item;
          vm.nouvelItemEspece_capture = item;
          currentItemEspece_capture = JSON.parse(JSON.stringify(vm.selectedItemEspece_capture));
          vm.afficherboutonModifSuprEspece_capture = 1 ;
          vm.affichageMasqueEspece_capture = 0 ;
         //console.log(item);           
      };

      $scope.$watch('vm.selectedItemEspece_capture', function() {
        if (!vm.allespece_capture) return;
        vm.allespece_capture.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItemEspece_capture.$selected = true;
      });
      //function cache masque de saisie
        vm.ajouter = function () {
  			vm.selectedItem.$selected = false;
  			vm.affichageMasque = 1 ;
        
  			vm.espece = {} ;
  			NouvelItem = true ;
        };
        //function cache masque de saisie
        vm.ajouterEspece_capture = function () {
        vm.selectedItemEspece_capture.$selected = false;
        vm.affichageMasqueEspece_capture = 1 ;
        
        vm.espece_capture = {} ;
        NouvelItemEspece_capture = true ;
        };
        vm.annuler = function() {
          vm.selectedItem = {} ;
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          
          NouvelItem = false;
        };
         vm.annulerEspece_capture = function() {
          vm.selectedItemEspece_capture = {} ;
          vm.selectedItemEspece_capture.$selected = false;
          vm.affichageMasqueEspece_capture = 0 ;
          vm.afficherboutonnouveauEspece_capture = 1 ;
          vm.afficherboutonModifSuprEspece_capture = 0 ;
          
          NouvelItem = false;
        };
        vm.modifier = function() {
          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.espece.id = vm.selectedItem.id ;
          vm.espece.code = vm.selectedItem.code ;
          vm.espece.nom_local = vm.selectedItem.nom_local ;
          vm.espece.nom_scientifique = vm.selectedItem.nom_scientifique ;
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0;
            
        };

         vm.modifierEspece_capture = function() {
          NouvelItemEspece_capture = false ;
          vm.affichageMasqueEspece_capture = 1 ;
          vm.espece_capture.id = vm.selectedItemEspece_capture.id ;
          vm.espece_capture.id_espece=vm.selectedItemEspece_capture.espece_id ;
          vm.espece_capture.capture=vm.selectedItemEspece_capture.capture;
          vm.espece_capture.prix=vm.selectedItemEspece_capture.prix;
          vm.espece_capture.id_user=vm.selectedItemEspece_capture.user_id;
          vm.espece_capture.date_creation=vm.selectedItemEspece_capture.date_creation;
         // vm.espece_capture.date_modification=vm.selectedItemEspece_capture.date_modification;
          vm.afficherboutonModifSuprEspece_capture = 0;
          vm.afficherboutonnouveauEspece_capture = 0; 

          vm.allfiche_echantillonnage_capture.forEach(function(fiche) {
            if(fiche.id==vm.selectedItemEspece_capture.fiche_echantillonnage_capture_id) {
              vm.espece_capture.fiche_echantillonnage_capture_id = fiche.id ;
              vm.espece_capture.fiche_echantillonnage_capture_nom = fiche.code_unique ;
            }
          });

          vm.allechantillon.forEach(function(echan) {
            if(echan.id==vm.selectedItemEspece_capture.echantillon_id) {
              vm.espece_capture.echantillon_id = echan.id ;
              vm.espece_capture.echantillon_nom = echan.unique_code ;
            }
          });

        };

        vm.modifierfiche_echantillonnage_capture=function(item)
         {
          vm.allfiche_echantillonnage_capture.forEach(function(ech) {
              if(ech.id==item.fiche_echantillonnage_capture_id) {
                 item.fiche_echantillonnage_capture_id = ech.id;
                 item.fiche_echantillonnage_capture_nom = ech.code_unique; 
                 
              }
          });
        }

        vm.modifierechantillon=function(item)
         {
          vm.allechantillon.forEach(function(ech) {

              if(ech.id==item.echantillon_id) {
                 item.echantillon_id = ech.id;
                 item.echantillon_nom = ech.unique_code; 
                 //console.log("nom" +item.echantillon_nom);
              }
          });
        }
        
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

        vm.supprimerEspece_capture = function() {
          vm.affichageMasqueEspece_capture = 0 ;
          vm.afficherboutonModifSuprEspece_capture = 0 ;
         var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');
          $mdDialog.show(confirm).then(function() {
            vm.ajoutEspece_capture(vm.selectedItemEspece_capture,1);
          }, function() {
            //alert('rien');
          });
        };
        function test_existance (item,suppression) {          
            if (suppression!=1) {
                vm.allespece.forEach(function(esp) {               
					if (esp.id==item.id) {
							 if((esp.code!=item.code)
                    ||(esp.echantillon_id!=item.echantillon_id)
                    ||(esp.nom_local!=item.nom_local)
                    ||(esp.nom_scientifique!=item.nom_scientifique))
                    
                    {
                      insert_in_base(item,suppression);
                      vm.affichageMasque = 0 ;
                    }
                    else
                    {
                      vm.affichageMasque = 1 ;
                    }
						}
					}
                );
            }  else
              insert_in_base(item,suppression);
        }

          function test_existanceEspece_capture (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allespece_capture.forEach(function(esp) {
                
                  if (esp.id==item.id) 
                  {
                    if((esp.fiche_echantillonnage_capture_id!=item.fiche_echantillonnage_capture_id)
                    ||(esp.echantillon_id!=item.echantillon_id)
                    ||(esp.capture!=item.capture)
                    ||(esp.prix!=item.prix))

                    
                    {
                      insert_in_baseEspece_capture(item,suppression);
                      vm.affichageMasqueEspece_capture = 0 ;
                    }
                    else
                    {
                      vm.affichageMasqueEspece_capture = 1 ;
                    }
                  }
                });
            }
            else
              insert_in_baseEspece_capture(item,suppression);
        }
    }
})();
