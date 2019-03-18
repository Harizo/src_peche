(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.echantillon')
        .controller('EchantillonController', EchantillonController);

    /** @ngInject */
    function EchantillonController($mdDialog, $scope, $location, apiFactory, $cookieStore,cookieService)
    {
      var vm = this;
      vm.ajout = ajout ;
      var NouvelItem=false;
      var currentItem;

      vm.selectedItem = {} ;
      vm.allechantillon = [] ;
      

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
    vm.echantillon_column = [
      {
        titre:"Fiche echantillonnage"
      },
      {
        titre:"Type canoe"
      },
      {
        titre:'Type engin'
      },
      {
        titre:"Peche hier"
      },
      {
        titre:"Peche avant hier"
      },
      {
        titre:"Nbr jrs peche dernier sem"
      },
      {
        titre:"Total capture"
      },
      {
        titre:"Unique code"
      },
      {
        titre:"Data collect"
      },
      {
        titre:"Nbr bateau actif"
      },
      {
        titre:"Total bateau ecn"
      },
      {
        titre:"User"
      },
      {
        titre:"Date creation"
      },
      {
        titre:"Date modification"
      }
    ];
    
    apiFactory.getAll("fiche_echantillonnage_capture/index").then(function(result)
    {
      vm.allfiche_echantillonnage_capture = result.data.response;
    });

   
    apiFactory.getAll("type_canoe/index").then(function(result)
    {
      vm.alltype_canoe = result.data.response;
    });

    apiFactory.getAll("type_engin/index").then(function(result)
      {
        vm.alltype_engin= result.data.response;
      });


     apiFactory.getAll("data_collect/index").then(function(result){
      vm.alldata_collect = result.data.response;
 
    });
   
    apiFactory.getAll("echantillon/index").then(function(result){
      vm.allechantillon = result.data.response;
          /*for (var i = 0; i < vm.allechantillonss.length; i++) 
          {
            var item = {
                    id: vm.allechantillonss[i].id,
                    code_unique: vm.allechantillonss[i].code_unique,
                    date: vm.allechantillonss[i].date,
                    date_creation: vm.allechantillonss[i].date_creation,
                    date_modification: vm.allechantillonss[i].date_modification,
                    longitude: vm.allechantillonss[i].longitude,
                    latitude: vm.allechantillonss[i].latitude,
                    altitude: vm.allechantillonss[i].altitude,
                    site_embarquement_id: vm.allechantillonss[i].site_embarquement_id,
                    site_embarquement_nom: vm.allechantillonss[i].site_embarquement.libelle,
                    user_id:cookieService.get("id"),
                    user_nom:cookieService.get("nom"),
                    enqueteur_id: vm.allechantillonss[i].enqueteur_id,
                    enqueteur_nom: vm.allechantillonss[i].enqueteur.nom,
                    district_id: vm.allechantillonss[i].district_id,
                    district_nom: vm.allechantillonss[i].district.nom,
                    region_id: vm.allechantillonss[i].region_id,
                    region_nom: vm.allechantillonss[i].region.nom
                   
                };
                
                vm.allechantillon.push(item);             
          }*/
    });
    
   
    
        function ajout(echantillon,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (echantillon,suppression); 
              }
              else
              {
                insert_in_base(echantillon,suppression);
              }
                
                
            
        }

        function insert_in_base(echantillon,suppression)
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
                supprimer:                        suppression,
                id:getId,
                fiche_echantillonnage_capture_id: echantillon.fiche_echantillonnage_capture_id,
                type_canoe_id:                    echantillon.type_canoe_id,
                type_engin_id:                    echantillon.type_engin_id,
                peche_hier:                       echantillon.peche_hier,
                peche_avant_hier:                 echantillon.peche_avant_hier,
                nbr_jrs_peche_dernier_sem:        echantillon.nbr_jrs_peche_dernier_sem,
                total_capture:                    echantillon.total_capture,
                unique_code:                      echantillon.unique_code,
                data_collect_id:                  echantillon.data_collect_id,
                nbr_bateau_actif:                 echantillon.nbr_bateau_actif,
                total_bateau_ecn:                 echantillon.total_bateau_ecn,
                user_id:                          cookieService.get("id")
                
            });
           
            //factory
            apiFactory.add("echantillon/index",datas, config)
                .success(function (data) {

                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
                    if(suppression==0) 
                    { // vm.selectedItem ={};                    
                      vm.selectedItem.fiche_echantillonnage_capture_id = vm.echantillon.fiche_echantillonnage_capture_id;
                      vm.selectedItem.fiche_echantillonnage_capture_nom = vm.echantillon.fiche_echantillonnage_capture_nom;
                      vm.selectedItem.type_canoe_id  = vm.echantillon.type_canoe_id;
                      vm.selectedItem.type_canoe_nom  = vm.echantillon.type_canoe_nom;
                      vm.selectedItem.type_engin_id  = vm.echantillon.type_engin_id;
                      vm.selectedItem.type_engin_nom  = vm.echantillon.type_engin_nom;

                      vm.selectedItem.peche_hier = vm.echantillon.peche_hier;
                      vm.selectedItem.peche_avant_hier = vm.echantillon.peche_avant_hier;
                      vm.selectedItem.nbr_jrs_peche_dernier_sem  = vm.echantillon.nbr_jrs_peche_dernier_sem; vm.selectedItem.total_capture          = vm.echantillon.total_capture;
                      vm.selectedItem.unique_code  = vm.echantillon.unique_code;
                      
                      vm.selectedItem.data_collect_id  = vm.echantillon.data_collect_id;
                      vm.selectedItem.data_collect_nom  = vm.echantillon.data_collect_nom;
                      
                      vm.selectedItem.nbr_bateau_actif = vm.echantillon.nbr_bateau_actif;
                      vm.selectedItem.total_bateau_ecn = vm.echantillon.total_bateau_ecn;
                      
                      vm.selectedItem.user_id  = cookieService.get("id");
                      vm.selectedItem.user_nom = cookieService.get("nom");
                      
                      vm.selectedItem.date_creation = vm.echantillon.date_creation;
                      vm.selectedItem.date_modification = current_date;
                      
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItem.$selected = false;
                      console.log(vm.selectedItem);
                      vm.selectedItem ={};
                       
                     // console.log(vm.echantillon);
                    } 
                    else 
                    {    
                      vm.allechantillon = vm.allechantillon.filter(function(obj) {

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
                        fiche_echantillonnage_capture_id: echantillon.fiche_echantillonnage_capture_id,
                        fiche_echantillonnage_capture_nom:echantillon.fiche_echantillonnage_capture_nom,
                        type_canoe_id:                    echantillon.type_canoe_id,
                        type_canoe_nom:                   echantillon.type_canoe_nom,
                        type_engin_id:                    echantillon.type_engin_id,
                        type_engin_nom:                   echantillon.type_engin_nom,
                        peche_hier:                       echantillon.peche_hier,
                        peche_avant_hier:                 echantillon.peche_avant_hier,
                        nbr_jrs_peche_dernier_sem:        echantillon.nbr_jrs_peche_dernier_sem,
                        total_capture:                    echantillon.total_capture,
                        unique_code:                      echantillon.unique_code,
                        data_collect_id:                  echantillon.data_collect_id,
                        data_collect_nom:                 echantillon.data_collect_nom,
                        nbr_bateau_actif:                 echantillon.nbr_bateau_actif,
                        total_bateau_ecn:                 echantillon.total_bateau_ecn,
                        user_id:                          cookieService.get("id"),
                        user_nom:                         cookieService.get("nom"),
                        date_creation:                    current_date,
                        date_modification:                current_date,
                        id:                   String(data.response) 
                    };
        
                    vm.allechantillon.push(item);

                    vm.echantillon.fiche_echantillonnage_capture_id='';
                    vm.echantillon.type_canoe_id='';
                    vm.echantillon.type_engin_id='';
                    vm.echantillon.peche_hier='';
                    vm.echantillon.peche_avant_hier='';
                    vm.echantillon.nbr_jrs_peche_dernier_sem='';
                    vm.echantillon.total_capture='';
                    vm.echantillon.unique_code='';
                    vm.echantillon.data_collect_id='';
                    vm.echantillon.nbr_bateau_actif='';
                    vm.echantillon.total_bateau_ecn='';
                    vm.echantillon.date_creation='';
                    vm.echantillon.date_modification='';                  
                    
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
        if (!vm.allechantillon) return;
        vm.allechantillon.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 1 ;
          vm.echantillon.fiche_echantillonnage_capture_id='';
          vm.echantillon.type_canoe_id='';
          vm.echantillon.type_engin_id='';
          vm.echantillon.peche_hier='';
          vm.echantillon.peche_avant_hier='';
          vm.echantillon.nbr_jrs_peche_dernier_sem='';
          vm.echantillon.total_capture='';
          vm.echantillon.unique_code='';
          vm.echantillon.data_collect_id='';
          vm.echantillon.nbr_bateau_actif='';
          vm.echantillon.total_bateau_ecn='';
          vm.echantillon.date_creation='';
          vm.echantillon.date_modification='';

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
          vm.echantillon.id = vm.selectedItem.id ;
          vm.echantillon.code_unique = vm.selectedItem.code_unique ;        
          vm.echantillon.date = vm.selectedItem.date;
          vm.echantillon.date_creation = vm.selectedItem.date_creation;
          vm.echantillon.latitude = vm.selectedItem.latitude;
          vm.echantillon.longitude = vm.selectedItem.longitude;
          vm.echantillon.altitude = vm.selectedItem.altitude;


          vm.echantillon.peche_hier = vm.selectedItem.peche_hier ;
          vm.echantillon.peche_avant_hier  = vm.selectedItem.peche_avant_hier ;
          vm.echantillon.nbr_jrs_peche_dernier_sem = vm.selectedItem.nbr_jrs_peche_dernier_sem  ; 
          vm.echantillon.total_capture = vm.selectedItem.total_capture          ;
          vm.echantillon.unique_code = vm.selectedItem.unique_code  ;
          vm.echantillon.nbr_bateau_actif = vm.selectedItem.nbr_bateau_actif ;
          vm.echantillon.total_bateau_ecn = vm.selectedItem.total_bateau_ecn ;
          vm.echantillon.date_creation = vm.selectedItem.date_creation ;
          vm.echantillon.date_modification = vm.selectedItem.date_modification ;
          
          vm.allfiche_echantillonnage_capture.forEach(function(fiche) {
            if(fiche.id==vm.selectedItem.fiche_echantillonnage_capture_id) {
              vm.echantillon.fiche_echantillonnage_capture_id = fiche.id ;
              vm.echantillon.fiche_echantillonnage_capture_nom = fiche.code_unique ;
            }
          });

          vm.alltype_canoe.forEach(function(typec) {
            if(typec.id==vm.selectedItem.type_canoe_id) {
              vm.echantillon.type_canoe_id = typec.id ;
              vm.echantillon.type_canoe_nom = typec.nom ;
            }
          });

          vm.alltype_engin.forEach(function(type_e) {
            if(type_e.id==vm.selectedItem.type_engin_id) {
              vm.echantillon.type_engin_id = type_e.id ;
              vm.echantillon.type_engin_nom = type_e.libelle ;
              
            }
          });

          vm.alldata_collect.forEach(function(data_c) {
            if(data_c.id==vm.selectedItem.data_collect_id) {
              vm.echantillon.data_collect_id = data_c.id ;
              vm.echantillon.data_collect_nom = data_c.libelle ;
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
        vm.modifierfiche_echantillonnage_capture = function (item) 
        {
          vm.allfiche_echantillonnage_capture.forEach(function(fiche) {
              if(fiche.id==item.fiche_echantillonnage_capture_id) {
                 item.fiche_echantillonnage_capture_id = fiche.id; 
                 item.fiche_echantillonnage_capture_nom = fiche.code_unique;
                 
              }
          });
        }

        vm.modifiertype_canoe = function (item) {
          vm.alltype_canoe.forEach(function(type_c) {
              if(type_c.id==item.type_canoe_id) {
                 item.type_canoe_id = type_c.id; 
                 item.type_canoe_nom = type_c.nom;
              }
          });
        }
        vm.modifiertype_engin = function (item) {
          vm.alltype_engin.forEach(function(type_e) {
              if(type_e.id==item.type_engin_id) {
                 item.type_engin_id = type_e.id; 
                 item.type_engin_nom = type_e.libelle;                 
              }
          });
        }
        vm.modifierdata_collect = function (item) {
          vm.alldata_collect.forEach(function(data_c) {
              if(data_c.id==item.data_collect_id) {
                 item.data_collect_id = data_c.id; 
                 item.data_collect_nom = data_c.libelle;
               
              }
          });
        }

        function test_existance (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allechantillon.forEach(function(echan) {
                
                  if (echan.id==item.id) 
                  {
                    if((echan.fiche_echantillonnage_capture.id!=item.fiche_echantillonnage_capture_id)
                    ||(echan.peche_hier!=item.peche_hier)
                    ||(echan.peche_avant_hier!=item.peche_avant_hier)
                    ||(echan.nbr_jrs_peche_dernier_sem!=item.nbr_jrs_peche_dernier_sem)
                    ||(echan.total_capture!=item.total_capture)
                    ||(echan.unique_code!=item.unique_code)
                    ||(echan.data_collect.id!=item.data_collect_id)
                    ||(echan.nbr_bateau_actif!=item.nbr_bateau_actif)
                    ||(echan.total_bateau_ecn!=item.total_bateau_ecn))

                    
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
