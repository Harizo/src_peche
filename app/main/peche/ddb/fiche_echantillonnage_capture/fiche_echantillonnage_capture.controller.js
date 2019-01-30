(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.fiche_echantillonnage_capture')
        .controller('Fiche_echantillonnage_captureController', Fiche_echantillonnage_captureController);

    /** @ngInject */
    function Fiche_echantillonnage_captureController($mdDialog, $scope, $location, apiFactory, $cookieStore,cookieService)
    {
      var vm = this;
      vm.ajout = ajout ;
      var NouvelItem=false;
      var currentItem;

      vm.selectedItem = {} ;
      vm.allfiche_echantillonnage_capture = [] ;
      

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
    vm.fiche_echantillonnage_capture_column = [
      {
        titre:"code"
      },
      {
        titre:"Date"
      },
      {
        titre:'Date creation/modification'
      },
      {
        titre:"Site"
      },
      {
        titre:"Enqueteur"
      },
      {
        titre:"User"
      },
      {
        titre:"Region"
      },
      {
        titre:"District"
      },
      {
        titre:"latitude / Longitude / Altitude"
      }
    ];
    
    apiFactory.getAll("enqueteur/index").then(function(result)
    {
      vm.allenqueteur = result.data.response;
    });

   
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
 
    });
   
    apiFactory.getAll("fiche_echantillonnage_capture/index").then(function(result){
      vm.allfiche_echantillonnage_capture = result.data.response;
          /*for (var i = 0; i < vm.allfiche_echantillonnage_capturess.length; i++) 
          {
            var item = {
                    id: vm.allfiche_echantillonnage_capturess[i].id,
                    code_unique: vm.allfiche_echantillonnage_capturess[i].code_unique,
                    date: vm.allfiche_echantillonnage_capturess[i].date,
                    date_creation: vm.allfiche_echantillonnage_capturess[i].date_creation,
                    date_modification: vm.allfiche_echantillonnage_capturess[i].date_modification,
                    longitude: vm.allfiche_echantillonnage_capturess[i].longitude,
                    latitude: vm.allfiche_echantillonnage_capturess[i].latitude,
                    altitude: vm.allfiche_echantillonnage_capturess[i].altitude,
                    site_embarquement_id: vm.allfiche_echantillonnage_capturess[i].site_embarquement_id,
                    site_embarquement_nom: vm.allfiche_echantillonnage_capturess[i].site_embarquement.libelle,
                    user_id:cookieService.get("id"),
                    user_nom:cookieService.get("nom"),
                    enqueteur_id: vm.allfiche_echantillonnage_capturess[i].enqueteur_id,
                    enqueteur_nom: vm.allfiche_echantillonnage_capturess[i].enqueteur.nom,
                    district_id: vm.allfiche_echantillonnage_capturess[i].district_id,
                    district_nom: vm.allfiche_echantillonnage_capturess[i].district.nom,
                    region_id: vm.allfiche_echantillonnage_capturess[i].region_id,
                    region_nom: vm.allfiche_echantillonnage_capturess[i].region.nom
                   
                };
                
                vm.allfiche_echantillonnage_capture.push(item);             
          }*/
    });
    
   
    
        function ajout(fiche_echantillonnage_capture,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (fiche_echantillonnage_capture,suppression); 
              }
              else
              {
                insert_in_base(fiche_echantillonnage_capture,suppression);
              }
                
                
            
        }

        function insert_in_base(fiche_echantillonnage_capture,suppression)
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
                supprimer:            suppression,
                id:getId,
                code_unique:          fiche_echantillonnage_capture.code_unique,
                date:                 fiche_echantillonnage_capture.date,
                longitude:            fiche_echantillonnage_capture.longitude,
                latitude:             fiche_echantillonnage_capture.latitude,
                altitude:             fiche_echantillonnage_capture.altitude,
                site_embarquement_id: fiche_echantillonnage_capture.site_embarquement_id,
                enqueteur_id:         fiche_echantillonnage_capture.enqueteur_id,
                district_id:          fiche_echantillonnage_capture.district_id,
                region_id:            fiche_echantillonnage_capture.region_id,
                user_id:              cookieService.get("id")
                
            });
           
            //factory
            apiFactory.add("fiche_echantillonnage_capture/index",datas, config)
                .success(function (data) {

                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
                    if(suppression==0) 
                    { // vm.selectedItem ={};                    
                      vm.selectedItem.code_unique       = vm.fiche_echantillonnage_capture.code_unique;
                      vm.selectedItem.date              = vm.fiche_echantillonnage_capture.date;
                      vm.selectedItem.date_creation     = vm.fiche_echantillonnage_capture.date_creation;
                      vm.selectedItem.date_modification = current_date;
                      vm.selectedItem.latitude          = vm.fiche_echantillonnage_capture.latitude;
                      vm.selectedItem.longitude         = vm.fiche_echantillonnage_capture.longitude;
                      vm.selectedItem.altitude          = vm.fiche_echantillonnage_capture.altitude;

                      vm.selectedItem.enqueteur_id          = vm.fiche_echantillonnage_capture.enqueteur_id;
                      vm.selectedItem.enqueteur_nom         = vm.fiche_echantillonnage_capture.enqueteur_nom;
                      vm.selectedItem.site_embarquement_id  = vm.fiche_echantillonnage_capture.site_embarquement_id;
                      vm.selectedItem.site_embarquement_nom = vm.fiche_echantillonnage_capture.site_embarquement_nom;
                      
                      vm.selectedItem.user_id       = cookieService.get("id");
                      vm.selectedItem.user_nom      = cookieService.get("nom");
                      vm.selectedItem.region_id     = vm.fiche_echantillonnage_capture.region_id;
                      vm.selectedItem.region_nom    = vm.fiche_echantillonnage_capture.region_nom;
                      vm.selectedItem.district_id   = vm.fiche_echantillonnage_capture.district_id;
                      vm.selectedItem.district_nom  = vm.fiche_echantillonnage_capture.district_nom;
                      
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItem.$selected = false;
                      console.log(vm.selectedItem);
                      vm.selectedItem ={};
                       
                      console.log(vm.fiche_echantillonnage_capture);
                    } 
                    else 
                    {    
                      vm.allfiche_echantillonnage_capture = vm.allfiche_echantillonnage_capture.filter(function(obj) {

                        return obj.id !== currentItem.id;
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
                        code_unique:          fiche_echantillonnage_capture.code_unique,
                        date:                 fiche_echantillonnage_capture.date,
                        date_creation:        current_date,
                        date_modification:    current_date,
                        longitude:            fiche_echantillonnage_capture.longitude,
                        latitude:             fiche_echantillonnage_capture.latitude,
                        altitude:             fiche_echantillonnage_capture.altitude,
                        site_embarquement_id: fiche_echantillonnage_capture.site_embarquement_id,
                        site_embarquement_nom:fiche_echantillonnage_capture.site_embarquement_nom, 
                        user_id:              cookieService.get("id"),
                        user_nom:             cookieService.get("nom"), 
                        enqueteur_id:         fiche_echantillonnage_capture.enqueteur_id,
                        enqueteur_nom:        fiche_echantillonnage_capture.enqueteur_nom, 
                        district_id:          fiche_echantillonnage_capture.district_id,
                        district_nom:         fiche_echantillonnage_capture.district_nom, 
                        region_id:            fiche_echantillonnage_capture.region_id,
                        region_nom:           fiche_echantillonnage_capture.region_nom, 
                        id:                   String(data.response) 
                    };
        
                    vm.allfiche_echantillonnage_capture.push(item);
                    vm.fiche_echantillonnage_capture.code='';
                    vm.fiche_echantillonnage_capture.code_unique='';
                    vm.fiche_echantillonnage_capture.date='';
                    vm.fiche_echantillonnage_capture.date_creation='';
                    vm.fiche_echantillonnage_capture.date_modification='';
                    vm.fiche_echantillonnage_capture.longitude='';
                    vm.fiche_echantillonnage_capture.latitude='';
                    vm.fiche_echantillonnage_capture.altitude='';
                    vm.fiche_echantillonnage_capture.site_embarquement_id=''; 
                    vm.fiche_echantillonnage_capture.user_id=''; 
                    vm.fiche_echantillonnage_capture.enqueteur_id=''; 
                    vm.fiche_echantillonnage_capture.district_id=''; 
                    vm.fiche_echantillonnage_capture.region_id='';
                    
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
        if (!vm.allfiche_echantillonnage_capture) return;
        vm.allfiche_echantillonnage_capture.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 1 ;
          vm.fiche_echantillonnage_capture.code='';
          vm.fiche_echantillonnage_capture.code_unique='';
          vm.fiche_echantillonnage_capture.date='';
          vm.fiche_echantillonnage_capture.longitude='';
          vm.fiche_echantillonnage_capture.latitude='';
          vm.fiche_echantillonnage_capture.altitude='';
          vm.fiche_echantillonnage_capture.site_embarquement_id=''; 
          vm.fiche_echantillonnage_capture.enqueteur_id=''; 
          vm.fiche_echantillonnage_capture.district_id=''; 
          vm.fiche_echantillonnage_capture.region_id='';
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
          vm.fiche_echantillonnage_capture.id = vm.selectedItem.id ;
          vm.fiche_echantillonnage_capture.code_unique = vm.selectedItem.code_unique ;        
          vm.fiche_echantillonnage_capture.date = vm.selectedItem.date;
          vm.fiche_echantillonnage_capture.date_creation = vm.selectedItem.date_creation;
          vm.fiche_echantillonnage_capture.latitude = vm.selectedItem.latitude;
          vm.fiche_echantillonnage_capture.longitude = vm.selectedItem.longitude;
          vm.fiche_echantillonnage_capture.altitude = vm.selectedItem.altitude;
          
          vm.allregion.forEach(function(reg) {
            if(reg.id==vm.selectedItem.region_id) {
              vm.fiche_echantillonnage_capture.region_id = reg.id ;
              vm.fiche_echantillonnage_capture.region_nom = reg.nom ;
            }
          });

          vm.alldistrict.forEach(function(dist) {
            if(dist.id==vm.selectedItem.district_id) {
              vm.fiche_echantillonnage_capture.district_id = dist.id ;
              vm.fiche_echantillonnage_capture.district_nom = dist.nom ;
            }
          });

          vm.allsite_embarquement.forEach(function(embarq) {
            if(embarq.id==vm.selectedItem.site_embarquement_id) {
              vm.fiche_echantillonnage_capture.site_embarquement_id = embarq.id ;
              vm.fiche_echantillonnage_capture.site_embarquement_nom = embarq.libelle ;
              
            }
          });

          vm.allenqueteur.forEach(function(enqu) {
            if(enqu.id==vm.selectedItem.enqueteur_id) {
              vm.fiche_echantillonnage_capture.enqueteur_id = enqu.id ;
              vm.fiche_echantillonnage_capture.enqueteur_nom = enqu.nom ;
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
        vm.modifierenqueteur = function (item) {
          vm.allenqueteur.forEach(function(enque) {
              if(enque.id==item.enqueteur_id) {
                 item.enqueteur_id = enque.id; 
                 item.enqueteur_nom = enque.nom;
              }
          });
        }
        vm.modifiersite_embarquement = function (item) {
          vm.allsite_embarquement.forEach(function(embarq) {
              if(embarq.id==item.site_embarquement_id) {
                 item.site_embarquement_id = embarq.id; 
                 item.site_embarquement_nom = embarq.libelle;
               
              }
          });
        }

        function test_existance (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allfiche_echantillonnage_capture.forEach(function(fiche) {
                
                  if (fiche.id==item.id) 
                  {
                    if((fiche.code_unique!=item.code_unique)
                    ||(fiche.site_embarquement_id!=item.site_embarquement_id)
                    ||(fiche.enqueteur_id!=item.enqueteur_id)
                    ||(fiche.latitude!=item.latitude)
                    ||(fiche.longitude!=item.longitude)
                    ||(fiche.altitude!=item.altitude)
                    ||(fiche.date!=item.date)
                    ||(fiche.region_id!=item.region_id)
                    ||(fiche.district_id!=item.district_id))
                    
                    {console.log('ko')
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
