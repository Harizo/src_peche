(function ()
{
    'use strict';

    angular
        .module('app.peche.fiche_echantillonnage_capture')
        .controller('Fiche_echantillonnage_captureController', Fiche_echantillonnage_captureController);

    /** @ngInject */
    function Fiche_echantillonnage_captureController($mdDialog, $scope, $location, apiFactory, $cookieStore,cookieService)
    {
      var vm = this;
      vm.ajout = ajout ;
      vm.ajoutEchantillon = ajoutEchantillon;
      vm.ajoutEspece_capture = ajoutEspece_capture;
      
      var NouvelItem=false;
      var NouvelItemEchantillon=false;
      var NouvelItemEspece_capture=false;
      
      var currentItem;
      var currentItemEchantillon;
      var currentItemEspece_capture;

      vm.selectedItem = {};
      vm.selectedItem.$selected =false;
      vm.selectedItemEchantillon = {};
      vm.selectedItemEspece_capture = {};
      
      vm.allfiche_echantillonnage_capture = [] ;
      vm.allechantillon = [];
      vm.allespece_capture = [];

      //variale affichage bouton nouveau
      vm.afficherboutonnouveau = 1;
      vm.afficherboutonnouveauEchantillon = 0;
      vm.afficherboutonnouveauEspece_capture = 0;
      //variable cache masque de saisie
      vm.affichageMasque = 0 ;
      vm.affichageMasqueEchantillon = 0 ;
      vm.step1=false;
      vm.step2=false;
      vm.step3=false;
      //style
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true
    };
    vm.step=[{step:1},{step:2},{step:3}];
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
    
    vm.espece_capture_column =
    [
        {titre:"Espece"},
        {titre:"Capture"},
        {titre:"Prix"},
        {titre:"User"},
        {titre:"Date creation"},
        {titre:"Date modification"}
    ];
   
    apiFactory.getAll("enqueteur/index").then(function(result)
    {
      vm.allenqueteur = result.data.response;
    });

   
    apiFactory.getAll("district/index").then(function(result)
    {
      vm.alldistrict = result.data.response;
      vm.allcurrentdistrict=vm.alldistrict;
    });

    apiFactory.getAll("region/index").then(function(result)
      {
        vm.allregion= result.data.response;
      });


     apiFactory.getAll("site_embarquement/index").then(function(result)
     {
      vm.allsite_embarquement = result.data.response;
 
    });

  apiFactory.getAll("type_canoe/index").then(function(result)
    {
      vm.alltype_canoe = result.data.response;
    });

    apiFactory.getAll("type_engin/index").then(function(result)
      {
        vm.alltype_engin= result.data.response;
      });


     apiFactory.getAll("data_collect/index").then(function(result)
     {
      vm.alldata_collect = result.data.response;
 
    });

    apiFactory.getAll("espece/index").then(function(result)
    {
      vm.allespece = result.data.response;

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

    function ajoutEchantillon(echantillon,suppression)   
    {
      if (NouvelItemEchantillon==false) 
      {
        test_existanceEchantillon (echantillon,suppression); 
      }
      else
      {
        insert_in_baseEchantillon(echantillon,suppression);
      }
    }

    function ajoutEspece_capture(espece_capture,suppression) {
      if (NouvelItemEspece_capture==false)
      {
        test_existanceEspece_capture (espece_capture,suppression); 
      } 
      else
      {
        insert_in_baseEspece_capture(espece_capture,suppression);
      }
    }

    function insert_in_base(fiche_echantillonnage_capture,suppression)
    {
           
//add
    var config = 
    {
     headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
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
  apiFactory.add("fiche_echantillonnage_capture/index",datas, config).success(function (data)
  {
    vm.allcurrentdistrict=vm.alldistrict;
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
            //console.log(vm.selectedItem);
            vm.selectedItem ={};
            //console.log(vm.fiche_echantillonnage_capture);
          } 
          else 
          {    
            vm.allfiche_echantillonnage_capture = vm.allfiche_echantillonnage_capture.filter(function(obj)
            {
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

        var item = 
        {
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
        .error(function (data)
        {
        alert('Error');
        });
                
  }

      //*****************************************************************

     function insert_in_baseEchantillon(echantillon,suppression)
        {
           
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var getIdEchantillon = 0;

            if (NouvelItemEchantillon==false) 
            {
               getIdEchantillon = vm.selectedItemEchantillon.id; 
            } 
            var datas = $.param(
            {
                supprimer:                        suppression,
                id:getIdEchantillon,
                fiche_echantillonnage_capture_id: vm.selectedItem.id,
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

                  if (NouvelItemEchantillon == false) 
                  {
                    // Update or delete: id exclu
                    var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
                    if(suppression==0) 
                    { // vm.selectedItem ={};                    
                      vm.selectedItemEchantillon.fiche_echantillonnage_capture_id = vm.selectedItem.id;
                      //vm.selectedItemEchantillon.fiche_echantillonnage_capture_nom = vm.echantillon.fiche_echantillonnage_capture_nom;
                      vm.selectedItemEchantillon.type_canoe_id  = vm.echantillon.type_canoe_id;
                      vm.selectedItemEchantillon.type_canoe_nom  = vm.echantillon.type_canoe_nom;
                      vm.selectedItemEchantillon.type_engin_id  = vm.echantillon.type_engin_id;
                      vm.selectedItemEchantillon.type_engin_nom  = vm.echantillon.type_engin_nom;

                      vm.selectedItemEchantillon.peche_hier = vm.echantillon.peche_hier;
                      vm.selectedItemEchantillon.peche_avant_hier = vm.echantillon.peche_avant_hier;
                      vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem  = vm.echantillon.nbr_jrs_peche_dernier_sem; vm.selectedItemEchantillon.total_capture          = vm.echantillon.total_capture;
                      vm.selectedItemEchantillon.unique_code  = vm.echantillon.unique_code;
                      
                      vm.selectedItemEchantillon.data_collect_id  = vm.echantillon.data_collect_id;
                      vm.selectedItemEchantillon.data_collect_nom  = vm.echantillon.data_collect_nom;
                      
                      vm.selectedItemEchantillon.nbr_bateau_actif = vm.echantillon.nbr_bateau_actif;
                      vm.selectedItemEchantillon.total_bateau_ecn = vm.echantillon.total_bateau_ecn;
                      
                      vm.selectedItemEchantillon.user_id  = cookieService.get("id");
                      vm.selectedItemEchantillon.user_nom = cookieService.get("nom");
                      
                      vm.selectedItemEchantillon.date_creation = vm.echantillon.date_creation;
                      vm.selectedItemEchantillon.date_modification = current_date;
                      
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItemEchantillon.$selected = false;
                     // console.log(vm.selectedItemEchantillon);
                      vm.selectedItemEchantillon ={};
                       
                     // console.log(vm.echantillon);
                    } 
                    else 
                    {    
                      vm.allechantillon = vm.allechantillon.filter(function(obj) {

                        return obj.id !== currentItemEchantillon.id;
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
                        fiche_echantillonnage_capture_id: vm.selectedItem.id,
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

                    //vm.echantillon.fiche_echantillonnage_capture_id='';
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
                    
                    NouvelItemEchantillon=false;
                  }

                  vm.affichageMasqueEchantillon = 0 ;

                })
                .error(function (data) {
                    alert('Error');
                });
                
        }

      //*****************************************************************

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
                espece_id:                        espece_capture.espece_id,
                fiche_echantillonnage_capture_id:  vm.selectedItem.id,
                echantillon_id:                    vm.selectedItemEchantillon.id,
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
                      vm.selectedItemEspece_capture.fiche_echantillonnage_capture_id = vm.selectedItem.id;
                     // vm.selectedItemEspece_capture.fiche_echantillonnage_capture_nom = vm.espece_capture.fiche_echantillonnage_capture_nom;
                      vm.selectedItemEspece_capture.echantillon_id  = vm.selectedItemEchantillon.id;
                      //vm.selectedItemEspece_capture.echantillon_nom  = vm.espece_capture.echantillon_nom;
                      vm.selectedItemEspece_capture.espece_id  = vm.espece_capture.espece_id;
                      vm.selectedItemEspece_capture.espece_nom  = vm.espece_capture.espece_nom;

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
                        espece_id:                        espece_capture.espece_id,
                        espece_nom:                       espece_capture.espece_nom,
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


      //selection sur la liste
      vm.selection= function (item)
      {
  //      vm.modifiercategorie(item);
        
          vm.selectedItem = item;
          vm.nouvelItem = item;
          if(currentItem != vm.selectedItem){
            vm.step1=false;
            vm.step2=false;
            vm.step3=false;
          }
          currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
          vm.afficherboutonModifSupr = 1 ;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonnouveauEchantillon = 1 ;
          vm.allechantillon = [];
          apiFactory.getFils("echantillon/index",item.id).then(function(result)
          {
            vm.allechantillon = result.data.response;
            //console.log(vm.echatillon);
          });
          vm.step1=true;  
      };
      $scope.$watch('vm.selectedItem', function() {
        if (!vm.allfiche_echantillonnage_capture) return;
        vm.allfiche_echantillonnage_capture.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;

      });

        vm.selectionechantillon= function (item)
        {
          vm.selectedItemEchantillon = item;
          vm.nouvelItemEchantillon = item;
          currentItemEchantillon = JSON.parse(JSON.stringify(vm.selectedItemEchantillon));
          vm.afficherboutonModifSuprEchantillon = 1 ;
          vm.afficherboutonnouveauEspece_capture = 1 ;
          vm.affichageMasqueEchantillon = 0 ;
          vm.allespece_capture = [];
          apiFactory.getFils("espece_capture/index",item.id).then(function(result)
            {
              vm.allespece_capture = result.data.response;            
            });
            vm.step2=true;
            vm.step3=false;         
        };

      $scope.$watch('vm.selectedItemEchantillon', function() {
        if (!vm.allechantillon) return;
        vm.allechantillon.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItemEchantillon.$selected = true;
      });

      vm.selectionEspece_capture= function (item) {
  //      vm.modifiercategorie(item);
        
          vm.selectedItemEspece_capture = item;
          vm.nouvelItemEspece_capture = item;
          currentItemEspece_capture = JSON.parse(JSON.stringify(vm.selectedItemEspece_capture));
          vm.afficherboutonModifSuprEspece_capture = 1 ;
          vm.affichageMasqueEspece_capture = 0 ;
         //console.log(item); 
         vm.step3=true;           
      };

      $scope.$watch('vm.selectedItemEspece_capture', function() {
        if (!vm.allespece_capture) return;
        vm.allespece_capture.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItemEspece_capture.$selected = true;
      });
      
      $scope.removeBouton = function() {
        vm.afficherboutonModifSuprEchantillon = 0 ;
      }
      $scope.removeBoutonEspece_capture = function() {
        vm.afficherboutonModifSuprEspece_capture = 0 ;
      }

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

        //function cache masque de saisie
        vm.ajouterEchantillon = function () 
        {
          vm.selectedItemEchantillon.$selected = false;
          vm.affichageMasqueEchantillon = 1 ;
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

          NouvelItemEchantillon = true ;

        };

        vm.ajouterEspece_capture = function () {
        vm.selectedItemEspece_capture.$selected = false;
        vm.affichageMasqueEspece_capture = 1 ;
        
        vm.espece_capture = {} ;
        NouvelItemEspece_capture = true ;
        };
        vm.annuler = function() 
        {
          //vm.selectedItem = {} ;          
          //vm.selectedItem.$selected = false;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          NouvelItem = false;
          vm.allcurrentdistrict=vm.alldistrict;

        };

          vm.annulerEchantillon = function() 
        {
          vm.selectedItemEchantillon = {} ;
          vm.selectedItemEchantillon.$selected = false;
          vm.affichageMasqueEchantillon = 0 ;
          vm.afficherboutonnouveauEchantillon = 1 ;
          vm.afficherboutonModifSuprEchantillon = 0 ;
          NouvelItemEchantillon = false;

        };
        vm.annulerEspece_capture = function() {
          vm.selectedItemEspece_capture = {} ;
          vm.selectedItemEspece_capture.$selected = false;
          vm.affichageMasqueEspece_capture = 0 ;
          vm.afficherboutonnouveauEspece_capture = 1 ;
          vm.afficherboutonModifSuprEspece_capture = 0 ;
          
          NouvelItemEspece_capture = false;
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


        vm.modifierEchantillon = function() 
        {

          NouvelItemEchantillon = false ;
          vm.affichageMasqueEchantillon = 1 ;
          vm.echantillon.id = vm.selectedItemEchantillon.id ;
          vm.echantillon.code_unique = vm.selectedItemEchantillon.code_unique ;        
          vm.echantillon.date = vm.selectedItemEchantillon.date;
          vm.echantillon.date_creation = vm.selectedItemEchantillon.date_creation;
          vm.echantillon.latitude = vm.selectedItemEchantillon.latitude;
          vm.echantillon.longitude = vm.selectedItemEchantillon.longitude;
          vm.echantillon.altitude = vm.selectedItemEchantillon.altitude;


          vm.echantillon.peche_hier = vm.selectedItemEchantillon.peche_hier ;
          vm.echantillon.peche_avant_hier  = vm.selectedItemEchantillon.peche_avant_hier ;
          vm.echantillon.nbr_jrs_peche_dernier_sem = vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem  ; 
          vm.echantillon.total_capture = vm.selectedItemEchantillon.total_capture          ;
          vm.echantillon.unique_code = vm.selectedItemEchantillon.unique_code  ;
          vm.echantillon.nbr_bateau_actif = vm.selectedItemEchantillon.nbr_bateau_actif ;
          vm.echantillon.total_bateau_ecn = vm.selectedItemEchantillon.total_bateau_ecn ;
          vm.echantillon.date_creation = vm.selectedItemEchantillon.date_creation ;
          vm.echantillon.date_modification = vm.selectedItemEchantillon.date_modification ;
          vm.echantillon.fiche_echantillonnage_capture_id = vm.selectedItemEchantillon.fiche_echantillonnage_capture_id;
         /* vm.allfiche_echantillonnage_capture.forEach(function(fiche) {
            if(fiche.id==vm.selectedItemEchantillon.fiche_echantillonnage_capture_id) {
              vm.echantillon.fiche_echantillonnage_capture_id = fiche.id ;
              vm.echantillon.fiche_echantillonnage_capture_nom = fiche.code_unique ;
            }
          });*/

          vm.alltype_canoe.forEach(function(typec) {
            if(typec.id==vm.selectedItemEchantillon.type_canoe_id) {
              vm.echantillon.type_canoe_id = typec.id ;
              vm.echantillon.type_canoe_nom = typec.nom ;
            }
          });

          vm.alltype_engin.forEach(function(type_e) {
            if(type_e.id==vm.selectedItemEchantillon.type_engin_id) {
              vm.echantillon.type_engin_id = type_e.id ;
              vm.echantillon.type_engin_nom = type_e.libelle ;
              
            }
          });

          vm.alldata_collect.forEach(function(data_c) {
            if(data_c.id==vm.selectedItemEchantillon.data_collect_id) {
              vm.echantillon.data_collect_id = data_c.id ;
              vm.echantillon.data_collect_nom = data_c.libelle ;
            }
          });



          
          vm.afficherboutonModifSuprEchantillon = 0;
          vm.afficherboutonnouveauEchantillon = 0;  

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

         /* vm.allfiche_echantillonnage_capture.forEach(function(fiche) {
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
          });*/
          vm.allespece.forEach(function(esp) {
            if(esp.id==vm.selectedItemEspece_capture.espece_id) {
              vm.espece_capture.espece_id = esp.id ;
              vm.espece_capture.espece_nom = esp.nom_local ;
            }
          });

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

          vm.supprimerEchantillon = function() 
        {
          vm.afficherboutonModifSuprEchantillon = 0 ;
          vm.affichageMasqueEchantillon = 0 ;
         var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

          $mdDialog.show(confirm).then(function() {

            ajoutEchantillon(vm.selectedItemEchantillon,1);
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

        var currentItemregion;
        vm.modifierregion = function (item) 
        {
          vm.allregion.forEach(function(reg) {
              if(reg.id==item.region_id) {
                 item.region_id = reg.id; 
                 item.region_nom = reg.nom;

                 currentItemregion=reg.id;                 
                  vm.allcurrentdistrict = vm.alldistrict.filter(function(obj) {                 
                        return obj.region_id == currentItemregion;
                      });
                 
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

        vm.modifierespece = function (item) {
          
          vm.allespece.forEach(function(esp) {
              if(esp.id==item.espece_id) {
                 item.espece_id = esp.id; 
                 item.espece_nom = esp.nom_local;
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

           function test_existanceEchantillon (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allechantillon.forEach(function(echan) {
                
                  if (echan.id==item.id) 
                  {
                    if((echan.fiche_echantillonnage_capture_id!=item.fiche_echantillonnage_capture_id)
                    ||(echan.type_canoe_id!=item.type_canoe_id)
                    ||(echan.type_engin_id!=item.type_engin_id)
                    ||(echan.peche_hier!=item.peche_hier)
                    ||(echan.peche_avant_hier!=item.peche_avant_hier)
                    ||(echan.nbr_jrs_peche_dernier_sem!=item.nbr_jrs_peche_dernier_sem)
                    ||(echan.total_capture!=item.total_capture)
                    ||(echan.unique_code!=item.unique_code)
                    ||(echan.data_collect_id!=item.data_collect_id)
                    ||(echan.nbr_bateau_actif!=item.nbr_bateau_actif)
                    ||(echan.total_bateau_ecn!=item.total_bateau_ecn))

                    
                    {
                      insert_in_baseEchantillon(item,suppression);
                      vm.affichageMasqueEchantillon = 0 ;
                    }
                    else
                    {
                      vm.affichageMasqueEchantillon = 0 ;
                    }
                  }
                });
            }
            else
              insert_in_baseEchantillon(item,suppression);
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
                    ||(esp.espece_id!=item.espece_id)
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
