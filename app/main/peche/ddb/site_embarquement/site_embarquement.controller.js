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
      vm.allcurrentdistrict=[];
      

      //variale affichage bouton nouveau
      vm.afficherboutonnouveau = 1 ;

      //variable cache masque de saisie
      vm.affichageMasque = 0 ;

      //step
      vm.step1                               = false;
      vm.step2                               = false;
      //vm.step3                               = false;
      vm.step = [{step:1},{step:2}];
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
      }/*,
      {
        titre:"Code unique"
      }*/,
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
      },
      {
        titre:"Limite"
      }
    ];
    
    apiFactory.getAll("district/index").then(function(result)
    {
      vm.alldistrict = result.data.response;
      vm.allcurrentdistrict=vm.alldistrict;
    });

    apiFactory.getAll("region/index").then(function(result)
      {
        vm.allregion= result.data.response;
      });

    apiFactory.getAll("site_embarquement/index").then(function(result){
      vm.allsite_embarquement = result.data.response; 
    });
    

/*********** ************************Debut site d'embarquement  *******************************************/     
        
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
                district_id:site_embarquement.district_id,
                limite: site_embarquement.limite
                
            });
            //factory
            apiFactory.add("site_embarquement/index",datas, config).success(function (data)
            {
              var reg = vm.allregion.filter(function(obj)
               {
                  return obj.id == vm.site_embarquement.region_id;
               });

               var dist = vm.alldistrict.filter(function(obj)
               {
                  return obj.id == vm.site_embarquement.district_id;
               });
                  
                  vm.allcurrentdistrict=vm.alldistrict;
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
                      vm.selectedItem.limite = vm.site_embarquement.limite;
                      vm.selectedItem.region = reg[0];
                      vm.selectedItem.district = dist[0];
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
                        limite: site_embarquement.limite,
                        region: reg[0],
                        id:String(data.response) ,
                        district:dist[0]
                    };
        //console.log(item);
                    vm.allsite_embarquement.push(item);
                    vm.site_embarquement={};
                    
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
          console.log(item.id);
          apiFactory.getFilsEnqueteur("site_enqueteur/index",item.id).then(function(result)
          {
              vm.allenqueteur = result.data.response;
              console.log(vm.allenqueteur);
          });
          vm.step1=true;
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
          vm.site_embarquement={};
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
          vm.allcurrentdistrict=vm.alldistrict;
        };

        vm.modifier = function() 
        {

          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.site_embarquement.id          = vm.selectedItem.id ;
          vm.site_embarquement.code        = vm.selectedItem.code ;        
          vm.site_embarquement.libelle     = vm.selectedItem.libelle;
          vm.site_embarquement.code_unique = vm.selectedItem.code_unique;
          vm.site_embarquement.latitude    = vm.selectedItem.latitude;
          vm.site_embarquement.longitude   = vm.selectedItem.longitude;
          vm.site_embarquement.altitude    = vm.selectedItem.altitude;
          vm.site_embarquement.region_id   = vm.selectedItem.region.id;
          vm.site_embarquement.district_id = vm.selectedItem.district.id;
          vm.site_embarquement.limite      = parseInt(vm.selectedItem.limite);
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
            vm.allcurrentdistrict = vm.alldistrict.filter(function(obj)
            {                 
                return obj.region.id == item.region_id;
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
                    ||(comm.region.id!=item.region_id)
                    ||(comm.district.id!=item.district_id)
                    ||(comm.limite!=item.limite))
                    
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

/*********** ************************Debut fi fiche_echantillonnage_capture  *******************************************/     
    }
})();
