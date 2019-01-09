(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.fokontany')
        .controller('FokontanyController', FokontanyController);

    /** @ngInject */
    function FokontanyController($mdDialog, $scope, $location, apiFactory, $cookieStore)
    {
      var vm = this;
      vm.ajout = ajout ;
      var NouvelItem=false;
      var currentItem;

      vm.selectedItem = {} ;
      vm.allfokontany = [] ;
      vm.listefokontany = [] ;
      //apina commune 
        vm.allcommune = [];
        vm.listecommune = [] ;
        vm.alldistrict = [] ;
        vm.listedistrict = [] ;
        vm.allregion = [] ;
		vm.coderegion='';
		vm.codedistrict='';
      

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
    vm.fokontany_column = [{titre:"Code"},{titre:"Nom"},{titre:"Commune"}];
    
    // apiFactory.getAll("commune/index").then(function(result)  {
      // vm.allcommune = result.data.response;
    // });
     //fakana commune
    apiFactory.getAPIgeneraliser("commune/index","id_district","'TOUT'","id_region","'TOUT'").then(function(result) {
        vm.allcommune= result.data.response;
        vm.listecommune= result.data.response;
        apiFactory.getAll("district/index").then(function(result) {
            vm.alldistrict= result.data.response;
            vm.listedistrict= result.data.response;
            apiFactory.getAll("region/index").then(function(result) {
                vm.allregion= result.data.response;
            });
        });
    });
    apiFactory.getAll("fokontany/index").then(function(result){
      vm.allfokontanyss = result.data.response;
	  vm.allfokontany=result.data.response;
    /*      for (var i = 0; i < vm.allfokontanyss.length; i++) 
          {
            var item = {
                    id: vm.allfokontanyss[i].id,
                    nom: vm.allfokontanyss[i].nom,
                    code: vm.allfokontanyss[i].code,
                    id_commune: vm.allfokontanyss[i].id_commune,
                    commune: vm.allfokontanyss[i].commune.nom,
                   
                };
                
                vm.allfokontany.push(item);             
          } */
		  vm.listefokontany =vm.allfokontany
    });
    
     
        function ajout(fokontany,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (fokontany,suppression); 
              }
              else
              {
                insert_in_base(fokontany,suppression);
              }
               
                
            
        }

        function insert_in_base(fokontany,suppression)
        {
           
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var getId = 0;

            if (NouvelItem==false) 
            {
               getId = vm.selectedItem.id; 
            } 
            var datas = $.param(
            {
                supprimer:suppression,
                id:getId,      
                code: fokontany.code,
                nom: fokontany.nom,
                id_commune:fokontany.id_commune,
                commune:fokontany.commune
                
            });
        
            //factory
            apiFactory.add("fokontany/index",datas, config)
                .success(function (data) {

                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    
                    if(suppression==0) 
                    {
                      vm.selectedItem.nom = vm.fokontany.nom;
                      vm.selectedItem.code = vm.fokontany.code;
                      vm.selectedItem.id_commune = vm.fokontany.id_commune;
                      vm.selectedItem.commune = vm.fokontany.commune;
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItem.$selected = false;
                      vm.selectedItem ={};
                    } 
                    else 
                    {    
                      vm.allfokontany = vm.allfokontany.filter(function(obj) {

                        return obj.id !== currentItem.id;
                      });
                    }
                  }
                  else
                  {
                    var item = {
                        nom: fokontany.nom,
                        code: fokontany.code,
                        id:String(data.response),
                        id_commune:fokontany.id_commune,
                        commune:fokontany.commune 
                    };
        
                    vm.allfokontany.push(item);
                    vm.fokontany.code='';
                    vm.fokontany.nom='';
                    vm.fokontany.commune='';
             
                    NouvelItem=false;
                  }

                  vm.affichageMasque = 0 ;

                })
                .error(function (data) {
                    alert('Error');
                });
            }
                

      //*****************************************************************

     

      //selection sur la liste
      vm.selection= function (item) {
  //      vm.modifiercategorie(item);
        
          vm.selectedItem = item;
          vm.nouvelItem = item;
          currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
          vm.afficherboutonModifSupr = 1 ;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
      };

      $scope.$watch('vm.selectedItem', function() {
        if (!vm.allfokontany) return;
        vm.allfokontany.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 1 ;
          vm.fokontany.code='';
          vm.fokontany.nom='';
          vm.fokontany.commune='';
          vm.fokontany.id_commune='';
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
          vm.fokontany.id = vm.selectedItem.id ;
          vm.fokontany.code = vm.selectedItem.code ;
          vm.fokontany.nom = vm.selectedItem.nom ;        
          vm.allcommune.forEach(function(comm) {
            if(comm.id==vm.selectedItem.id_commune) {
				vm.fokontany.id_commune = comm.id ;
				vm.fokontany.commune = comm ;
				vm.id_district = comm.district_id;
				vm.alldistrict.forEach(function(dis) {
					if(dis.id==vm.id_district) {
						vm.id_region = dis.region_id ;
						vm.listedistrict = vm.alldistrict;
						vm.listecommune=vm.allcommune;
						vm.listedistrict = vm.listedistrict.filter(function(dist) {
							return dist.region_id === vm.id_region;
						});
						vm.id_district = comm.district_id;
						vm.listecommune = vm.listecommune.filter(function(comm1) {
							return comm1.district_id === vm.id_district;
						});
						vm.id_district = comm.district_id;
					}
				});
            }
          });
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0;  
        };

        vm.supprimer = function() 
        {
          vm.afficherboutonModifSupr = 0 ;
          vm.affichageMasque = 0 ;
         var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

          $mdDialog.show(confirm).then(function() {

            ajout(vm.selectedItem,1);
          }, function() {
            //alert('rien');
          });
        };

       //commune filter        
         vm.modifierCommune = function (item) { 
            vm.listecommune.forEach(function(comm) {
                if(comm.id==item.id_commune) {
                    vm.fokontany.id_commune = comm.id; 
                    vm.fokontany.commune=[];
                    var itemss = {
                        id: comm.id,
                        code: comm.code,
                        nom: comm.nom,
                        district_id: comm.district_id,
                    };
                    vm.fokontany.commune.push(itemss);
					apiFactory.getAPIgeneraliser("commune/index","id_commune",comm.id,"id_region","'TOUT'").then(function(result) {
						var code = parseInt(result.data.response[0].codefokontany) + 1;
						if(code < 10) {
							code = '00' + code;
						} else if(code >=10 && code < 100){
							code = '0' + code;							
						} 
						vm.fokontany.code = comm.code + code;
					});	
                }
            });
        };
        vm.modifierFiltreCommune = function() {
            vm.listedistrict=vm.alldistrict;
            vm.listecommune=vm.allcommune;
            if(vm.id_region >"") {
                vm.listedistrict = vm.listedistrict.filter(function(dist) {
                    return dist.region_id === vm.id_region;
                });
                vm.listecommune = vm.listecommune.filter(function(comm) {
                    return comm.region_id === vm.id_region;
                });
				vm.allregion.forEach(function(re) {
					if(re.id==vm.id_region) {
						vm.coderegion=re.code;
					}
				});
            } else {
				vm.coderegion='';
			}
            if(vm.id_district >"") {
                vm.listecommune = vm.listecommune.filter(function(comm) {
                    return comm.district_id === vm.id_district;
                });
				vm.listedistrict.forEach(function(di) {
					if(di.id==vm.id_district) {
						vm.codedistrict=di.code;
					}
				});
            } else {
				vm.codedistrict='';
			}
			// vm.fokontany.code=vm.coderegion + vm.codedistrict;
        };  
        
        function test_existance (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allfokontany.forEach(function(fkt) {
                
                  if (fkt.id==item.id) 
                  {
                    if((fkt.nom!=item.nom)
                    ||(fkt.code!=item.code)
                    ||(fkt.id_commune!=item.id_commune))
                    
                    {
                      insert_in_base(item,suppression);
                      vm.affichageMasque = 0 ;
                    }
                    else
                    {
                      vm.affichageMasque = 0 ;
                    }
                  }
                });
            }
            else
              insert_in_base(item,suppression);
        } 

    }
})();