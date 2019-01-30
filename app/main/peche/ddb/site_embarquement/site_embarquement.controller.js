(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.site_embarquement')
        .controller('Site_embarquementController', Site_embarquementController);

    /** @ngInject */
    function Site_embarquementController($mdDialog, $scope, $location, apiFactory, $cookieStore)
    {
      var vm = this;
      vm.ajout = ajout ;
      var NouvelItem=false;
      var currentItem;

      vm.selectedItem = {} ;
      vm.allsite_embarquement = [] ;
      

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
    vm.site_embarquement_column = [
      {
        titre:"Code"
      },
      {
        titre:"Libelle"
      },
      {
        titre:"Code unique"
      },
      {
        titre:"Latitude"
      },
      {
        titre:"Longitude"
      },
      {
        titre:"Altitude"
      },
      {
        titre:"Region"
      },
      {
        titre:"District"
      }
    ];
    
    apiFactory.getAll("district/index").then(function(result)
    {
      vm.alldistrict = result.data.response;
    });

    apiFactory.getAll("region/index").then(function(result)
      {
        vm.allregion= result.data.response;
      });

    apiFactory.getAll("site_embarquement/index").then(function(result){
      vm.allsite_embarquement = result.data.response;
         /* for (var i = 0; i < vm.allsite_embarquementss.length; i++) 
          {
            var item = {
                    id: vm.allsite_embarquementss[i].id,
                    code: vm.allsite_embarquementss[i].code,
                    libelle: vm.allsite_embarquementss[i].libelle,
                    code_unique: vm.allsite_embarquementss[i].code_unique,
                    longitude: vm.allsite_embarquementss[i].longitude,
                    latitude: vm.allsite_embarquementss[i].latitude,
                    altitude: vm.allsite_embarquementss[i].altitude,
                    district_id: vm.allsite_embarquementss[i].district_id,
                    district_nom: vm.allsite_embarquementss[i].district.nom,
                    region_id: vm.allsite_embarquementss[i].region_id,
                    region_nom: vm.allsite_embarquementss[i].region.nom
                   
                };
                
                vm.allsite_embarquement.push(item);             
          }*/ 
    });
    
     
        function ajout(site_embarquement,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (site_embarquement,suppression); 
              }
              else
              {
                insert_in_base(site_embarquement,suppression);
              }
                
                
            
        }

        function insert_in_base(site_embarquement,suppression)
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
                code: site_embarquement.code,
                libelle: site_embarquement.libelle,
                code_unique: site_embarquement.code_unique,
                latitude: site_embarquement.latitude,
                longitude: site_embarquement.longitude,
                altitude: site_embarquement.altitude,
                region_id: site_embarquement.region_id,
                district_id:site_embarquement.district_id
                
            });
            //factory
            apiFactory.add("site_embarquement/index",datas, config)
                .success(function (data) {

                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    
                    if(suppression==0) 
                    {                      
                      vm.selectedItem.code = vm.site_embarquement.code;
                      vm.selectedItem.code_unique = vm.site_embarquement.code_unique;
                      vm.selectedItem.libelle = vm.site_embarquement.libelle;
                      vm.selectedItem.latitude = vm.site_embarquement.latitude;
                      vm.selectedItem.longitude = vm.site_embarquement.longitude;
                      vm.selectedItem.altitude = vm.site_embarquement.altitude;
                      vm.selectedItem.region_id = vm.site_embarquement.region_id;
                      vm.selectedItem.region_nom = vm.site_embarquement.region_nom;
                      vm.selectedItem.district_id = vm.site_embarquement.district_id;
                      vm.selectedItem.district_nom = vm.site_embarquement.district_nom;
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItem.$selected = false;
                      vm.selectedItem ={};
                    } 
                    else 
                    {    
                      vm.allsite_embarquement = vm.allsite_embarquement.filter(function(obj) {

                        return obj.id !== currentItem.id;
                      });
                    }
                  }
                  else
                  {
                    var item = {
                        code: site_embarquement.code,
                        libelle: site_embarquement.libelle,
                        code_unique: site_embarquement.code_unique,
                        latitude: site_embarquement.latitude,
                        longitude: site_embarquement.longitude,
                        altitude: site_embarquement.altitude,
                        region_id: site_embarquement.region_id,
                        region_nom: site_embarquement.region_nom,
                        id:String(data.response) ,
                        district_id:site_embarquement.district_id ,
                        district_nom:site_embarquement.district_nom 
                    };
        console.log(item);
                    vm.allsite_embarquement.push(item);
                    vm.site_embarquement.code='';
                    vm.site_embarquement.libelle='';
                    vm.site_embarquement.latitude='';
                    vm.site_embarquement.longitude='';
                    vm.site_embarquement.altitude='';
                    vm.site_embarquement.region_id='';
                    vm.site_embarquement.district_id='';
                    
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
        if (!vm.allsite_embarquement) return;
        vm.allsite_embarquement.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 1 ;
          vm.site_embarquement.code='';
          vm.site_embarquement.libelle='';
          vm.site_embarquement.code_unique='';
          vm.site_embarquement.latitude='';
          vm.site_embarquement.longitude='';
          vm.site_embarquement.altitude='';
          vm.site_embarquement.region='';
          vm.site_embarquement.district='';
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
          vm.site_embarquement.id = vm.selectedItem.id ;
          vm.site_embarquement.code = vm.selectedItem.code ;        
          vm.site_embarquement.libelle = vm.selectedItem.libelle;
          vm.site_embarquement.code_unique = vm.selectedItem.code_unique;
          vm.site_embarquement.latitude = vm.selectedItem.latitude;
          vm.site_embarquement.longitude = vm.selectedItem.longitude;
          vm.site_embarquement.altitude = vm.selectedItem.altitude;
          
          vm.allregion.forEach(function(reg) {
            if(reg.id==vm.selectedItem.region_id) {
              vm.site_embarquement.region_id = reg.id ;
              vm.site_embarquement.region_nom = reg.nom ;
            }
          });

          vm.alldistrict.forEach(function(dist) {
            if(dist.id==vm.selectedItem.district_id) {
              vm.site_embarquement.district_id = dist.id ;
              vm.site_embarquement.district_nom = dist.nom ;
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
        vm.modifierregion = function (item) 
        {
          vm.allregion.forEach(function(reg) {
              if(reg.id==item.region_id) {
                 item.region_id = reg.id; 
                 item.region_nom = reg.nom;
                 
              }
          });
        }

        vm.modifierdistrict = function (item) {
          vm.alldistrict.forEach(function(dist) {
              if(dist.id==item.district_id) {
                 item.district_id = dist.id; 
                 item.district_nom = dist.nom;
              }
          });
        }

        function test_existance (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allsite_embarquement.forEach(function(comm) {
                
                  if (comm.id==item.id) 
                  {
                    if((comm.code!=item.code)
                    ||(comm.code_unique!=item.code_unique)
                    ||(comm.latitude!=item.latitude)
                    ||(comm.longitude!=item.longitude)
                    ||(comm.altitude!=item.altitude)
                    ||(comm.libelle!=item.libelle)
                    ||(comm.region_id!=item.region_id)
                    ||(comm.district_id!=item.district_id))
                    
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
