(function ()
{
    'use strict';

    angular
        .module('app.peche.fiche_echantillonnage_capture')
        .controller('Fiche_echantillonnage_captureController', Fiche_echantillonnage_captureController);

    /** @ngInject */
    function Fiche_echantillonnage_captureController($mdDialog, $scope, $location, apiFactory, $cookieStore,cookieService)
    {
      var vm                                 = this;
      vm.ajout                               = ajout;
      vm.ajoutEchantillon                    = ajoutEchantillon;
      vm.ajoutEspece_capture                 = ajoutEspece_capture;
      
      var NouvelItem                         = false;
      var NouvelItemEchantillon              = false;
      var NouvelItemEspece_capture           = false;
      
      var currentItem;
      var currentItemEchantillon;
      var currentItemEspece_capture;

      vm.selectedItem                        = {};
      vm.selectedItem.$selected              = false;
      vm.selectedItemEchantillon             = {};
      vm.selectedItemEspece_capture          = {};
      
      vm.allfiche_echantillonnage_capture    = [];
      vm.allechantillon                      = [];
      vm.allespece_capture                   = [];
      vm.currrentSite_embarquement           = [];
     // vm.allsite_enqueteur                   = [];

      //variale affichage bouton nouveau
      vm.afficherboutonnouveau               = 1;
      vm.afficherboutonnouveauEchantillon    = 0;
      vm.afficherboutonnouveauEspece_capture = 0;
      //variable cache masque de saisie
      vm.affichageMasque                     = 0;
      vm.affichageMasqueEchantillon          = 0;
      vm.affichageMasqueFiltrepardate        = 0;
      vm.step1                               = false;
      vm.step2                               = false;
      vm.step3                               = false;

      vm.enqueteur                           = false;
      vm.pab                                 = false;
      vm.input_data_collect                  = false;
      
//style
      vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.step = [{step:1},{step:2},{step:3}];
    
//col table fiche_echantillonnage_capture
      vm.fiche_echantillonnage_capture_column = 
      [
          {titre:"code"},
          {titre:"Date"},
          {titre:'Date creation/modification'},
          {titre:"Enqueteur"},
          {titre:"Site"},
          {titre:"Region"},
          {titre:"District"},
          {titre:"latitude / Longitude / Altitude"},
          {titre:"User"}
      ];

//col table espece_capture   
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
      {vm.allenqueteur = result.data.response;});
   
      apiFactory.getAll("district/index").then(function(result)
      {vm.alldistrict = result.data.response; vm.allcurrentdistrict=vm.alldistrict;});

      apiFactory.getAll("region/index").then(function(result)
      {vm.allregion= result.data.response;});


     /*apiFactory.getAll("site_embarquement/index").then(function(result)
     {vm.allsite_embarquement = result.data.response; 
      vm.currrentSite_embarquement=vm.allsite_embarquement});*/

      apiFactory.getAll("type_canoe/index").then(function(result)
      {vm.alltype_canoe = result.data.response;});

      apiFactory.getAll("type_engin/index").then(function(result)
      {vm.alltype_engin= result.data.response;});


       apiFactory.getAll("data_collect/index").then(function(result)
       {vm.alldata_collect = result.data.response;});

      apiFactory.getAll("espece/index").then(function(result)
      {vm.allespece = result.data.response;});

      apiFactory.getAll("unite_peche/index").then(function(result)
      {vm.allunite_peche = result.data.response;});
   
   /* apiFactory.getAll("fiche_echantillonnage_capture/index").then(function(result){
      vm.allfiche_echantillonnage_capture = result.data.response;
    });*/

/*********** ************************Debut fi fiche_echantillonnage_capture  *******************************************/
     
      var date_today  = new Date();
      var date_jour   = date_today.getDate();
      var date_mois   = date_today.getMonth()+1;
      var date_annee  = date_today.getFullYear();
        if(date_mois <10)
        {
          date_mois = '0' + date_mois;
        }
      var date_dujour= date_annee+"-"+date_mois+"-"+date_jour;

      apiFactory.getEchantillonnageByDate("fiche_echantillonnage_capture/index",date_dujour,date_dujour).then(function(result)
      {
        vm.allfiche_echantillonnage_capture = result.data.response;
      });

          //selection sur la liste
      vm.selection= function (item)
      {        
          vm.selectedItem = item;
          vm.nouvelItem   = item;
          if(currentItem != vm.selectedItem)
          {
            vm.step1 = false;
            vm.step2 = false;
            vm.step3 = false;
          }
          currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
          vm.afficherboutonModifSupr          = 1 ;
          vm.affichageMasque                  = 0 ;
          vm.afficherboutonnouveau            = 1 ;
          vm.afficherboutonnouveauEchantillon = 1 ;
          //vm.allechantillon                   = [];
          apiFactory.getFils("echantillon/index",item.id).then(function(result)
          {
              vm.allechantillon = result.data.response;
          });
          vm.step1=true;  
      };
      $scope.$watch('vm.selectedItem', function()
      {
        if (!vm.allfiche_echantillonnage_capture) return;
        vm.allfiche_echantillonnage_capture.forEach(function(item)
        {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;

      });


      vm.modifier = function() 
      {
          NouvelItem = false ;
          vm.enqueteur=true;
          vm.affichageMasque = 1 ;
          vm.fiche_echantillonnage_capture.id              = vm.selectedItem.id ;
          vm.fiche_echantillonnage_capture.code_unique     = vm.selectedItem.code_unique ;        
          vm.fiche_echantillonnage_capture.date            = vm.selectedItem.date;
          vm.fiche_echantillonnage_capture.date_creation   = vm.selectedItem.date_creation;
          vm.fiche_echantillonnage_capture.latitude        = vm.selectedItem.latitude;
          vm.fiche_echantillonnage_capture.longitude       = vm.selectedItem.longitude;
          vm.fiche_echantillonnage_capture.altitude        = vm.selectedItem.altitude;
          vm.fiche_echantillonnage_capture.region_id       = vm.selectedItem.region.id ;
          vm.fiche_echantillonnage_capture.district_id     = vm.selectedItem.district.id ;
          vm.fiche_echantillonnage_capture.enqueteur_id    =vm.selectedItem.enqueteur.id ;
          vm.fiche_echantillonnage_capture.site_embarquement_id = vm.selectedItem.site_embarquement.id ;
          
          apiFactory.getFils("site_enqueteur/index",vm.selectedItem.enqueteur.id).then(function(result)
          {
            vm.allsite_enqueteur = result.data.response;
            vm.allsite_embarquement = vm.allsite_enqueteur;
            //console.log(vm.allsite_enqueteur);
          });
          
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau   = 0;  

      };

      vm.annuler = function() 
      {   //vm.selectedItem = {} ;          
          //vm.selectedItem.$selected = false;
          vm.affichageMasque         = 0 ;
          vm.afficherboutonnouveau   = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          NouvelItem                 = false;
          vm.allcurrentdistrict      = vm.alldistrict;
          vm.affichageMasqueFiltrepardate = 0 ;
      };

//function cache masque de saisie
      vm.ajouter = function () 
      {           
          vm.selectedItem.$selected = false;
          vm.step1=false;
          vm.step2=false;
          vm.step3=false;
          vm.affichageMasque = 1 ;
          vm.fiche_echantillonnage_capture={};
          NouvelItem = true ;
          vm.enqueteur = false;
      };

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
    
    function test_existance (item,suppression) 
    {
           
        if (suppression!=1) 
        {
            vm.allfiche_echantillonnage_capture.forEach(function(fiche)
            {
                
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

    function insert_in_base(fiche_echantillonnage_capture,suppression)
    {
           
//add
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }};

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
            //vm.allcurrentdistrict=vm.alldistrict;

            var site_emba = vm.allsite_embarquement.filter(function(obj)
            {
              return obj.id == vm.fiche_echantillonnage_capture.site_embarquement_id;
            });

            var enqt = vm.allenqueteur.filter(function(obj)
            {
              return obj.id == vm.fiche_echantillonnage_capture.enqueteur_id;
            });

            var reg = vm.allregion.filter(function(obj)
            {
              return obj.id == vm.fiche_echantillonnage_capture.region_id;
            });

            var dist = vm.alldistrict.filter(function(obj)
            {
              return obj.id == vm.fiche_echantillonnage_capture.district_id;
            });

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

                    vm.selectedItem.enqueteur          = enqt[0];
                    vm.selectedItem.site_embarquement  = site_emba[0];
                              
                    
                    vm.selectedItem.region        = reg[0];
                    vm.selectedItem.district      = dist[0];                              
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
              { 
                var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
                var user = {id:cookieService.get("id"),nom:cookieService.get("nom")};
                var item = 
                {
                  code_unique:          fiche_echantillonnage_capture.code_unique,
                  date:                 fiche_echantillonnage_capture.date,
                  date_creation:        current_date,
                  date_modification:    current_date,
                  longitude:            fiche_echantillonnage_capture.longitude,
                  latitude:             fiche_echantillonnage_capture.latitude,
                  altitude:             fiche_echantillonnage_capture.altitude,
                  site_embarquement:    site_emba[0], 
                  user_id:              cookieService.get("id"),
                  user:                 user, 
                  enqueteur:            enqt[0], 
                  district:             dist[0], 
                  region:               reg[0],
                  id:                   String(data.response) 
                };
                
                vm.allfiche_echantillonnage_capture.push(item);
                vm.fiche_echantillonnage_capture={};
                            
                NouvelItem=false;
              }
              vm.affichageMasque = 0 ;
              })
                .error(function (data)
                {
                alert('Error');
                });
                
    }

    vm.modifierenqueteur = function (item)
    {
        if(item.enqueteur_id)
        {
            vm.enqueteur=true;
            apiFactory.getFils("site_enqueteur/index",item.enqueteur_id).then(function(result)
            {
                vm.allsite_enqueteur = result.data.response;
                vm.allsite_embarquement = vm.allsite_enqueteur;
                console.log(vm.allsite_embarquement);
            });
        }          
    }
    vm.modifiersite_embarquement = function (item)
    {
        var site = vm.allsite_embarquement.filter(function(obj)
        {
            return obj.id == item.site_embarquement_id;
        });
        item.region_id= site[0].region.id;
        item.district_id= site[0].district.id; 

        console.log(item)       
    }

    vm.supprimer = function() 
    {
        vm.afficherboutonModifSupr = 0 ;
        vm.affichageMasque = 0 ;
        var confirm = $mdDialog.confirm().title('Etes-vous sûr de supprimer cet enregistrement ?')
                                .textContent('')
                                .ariaLabel('Lucky day')
                                .clickOutsideToClose(true)
                                .parent(angular.element(document.body))
                                .ok('ok')
                                .cancel('annuler');

        $mdDialog.show(confirm).then(function()
        {
            ajout(vm.selectedItem,1);
        }, function()
            {
              //alert('rien');
            });
    };

    vm.formfiltrepardate = function()
    {
        vm.affichageMasqueFiltrepardate = 1 ;
        vm.filtrepardate={};
    }

    vm.recherchefiltrepardate= function (filtrepardate)
    {
        var date1 = new Date(filtrepardate.date_debut);
        var date2= new Date(filtrepardate.date_fin);
        var date1_jour = date1.getDate();
        var date1_mois = date1.getMonth()+1;
        var date1_annee = date1.getFullYear();
        if(date1_mois <10)
        {
            date1_mois = '0' + date1_mois;
        }
        var date_debut= date1_annee+"-"+date1_mois+"-"+date1_jour;

        var date2_jour = date2.getDate();
        var date2_mois = date2.getMonth()+1;
        var date2_annee = date2.getFullYear();
        if(date2_mois <10)
        {
            date2_mois = '0' + date2_mois;
        }
        var date_fin= date2_annee+"-"+date2_mois+"-"+date2_jour;

        apiFactory.getEchantillonnageByDate("fiche_echantillonnage_capture/index",date_debut,date_fin).then(function(result)
        {
            vm.allfiche_echantillonnage_capture  = result.data.response;
            vm.affichageMasqueFiltrepardate = 0 ;
        });
    }

    $scope.removeBouton = function()
    {
        vm.afficherboutonModifSuprEchantillon = 0 ;
    }

/************************************ Fin fiche_echantillonnage_capture  ***********************************************/
  

/******************************************** Debut echantillon  ******************************************************/
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

    $scope.$watch('vm.selectedItemEchantillon', function()
    {
        if (!vm.allechantillon) return;
        vm.allechantillon.forEach(function(item)
        {
            item.$selected = false;
        });
        vm.selectedItemEchantillon.$selected = true;
      });

    vm.modifierEchantillon = function() 
    { 
        vm.input_data_collect = true;
        NouvelItemEchantillon = false ;
        vm.affichageMasqueEchantillon    = 1 ;
        vm.affichageMasque               = 0 ;
        vm.affichageMasqueEspece_capture = 0 ;
        
        vm.echantillon.id         = vm.selectedItemEchantillon.id ;       
        vm.echantillon.date       = vm.selectedItemEchantillon.date;
        vm.echantillon.latitude   = vm.selectedItemEchantillon.latitude;
        vm.echantillon.longitude  = vm.selectedItemEchantillon.longitude;
        vm.echantillon.altitude   = vm.selectedItemEchantillon.altitude;

        vm.echantillon.unite_peche_id   = vm.selectedItemEchantillon.unite_peche.id;
        vm.echantillon.peche_hier       = vm.selectedItemEchantillon.peche_hier ;
        vm.echantillon.peche_avant_hier = vm.selectedItemEchantillon.peche_avant_hier ; 
        vm.echantillon.total_capture    = vm.selectedItemEchantillon.total_capture;
        vm.echantillon.unique_code      = vm.selectedItemEchantillon.unique_code  ;
        vm.echantillon.nbr_bateau_actif = vm.selectedItemEchantillon.nbr_bateau_actif ;
        vm.echantillon.total_bateau_ecn = vm.selectedItemEchantillon.total_bateau_ecn ;
        vm.echantillon.data_collect_id  = vm.selectedItemEchantillon.data_collect.id;

        vm.echantillon.nbr_jrs_peche_dernier_sem = vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem;          
        
          if(vm.selectedItemEchantillon.data_collect.code=='PAB')
          {
              vm.pab=true;
          }
          else
          {
              vm.pab=false;
          }
          
          vm.afficherboutonModifSuprEchantillon = 0;
          vm.afficherboutonnouveauEchantillon = 0;  

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
  
  function test_existanceEchantillon (item,suppression) 
  {           
      if (suppression!=1) 
      {
          vm.allechantillon.forEach(function(echan)
          {
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

  function insert_in_baseEchantillon(echantillon,suppression)
        {          
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var getIdEchantillon = 0;
            var total_captur=0;
            var getIdData_collect=0;
            var typeeffort='';
            if (NouvelItemEchantillon==false) 
            {
              getIdEchantillon = vm.selectedItemEchantillon.id;                

            }else{
              echantillon.total_capture=total_captur;
            }
            if(vm.pab)
            {
              vm.alldata_collect.forEach(function(data_c)
                {
                  if(data_c.code=='PAB')
                  {
                    getIdData_collect  = data_c.id;
                    
                    typeeffort='PAB';                    
                    vm.echantillon.data_collect_nom = data_c.code;
                    vm.echantillon.nbr_bateau_actif = '- -';
                    vm.echantillon.total_bateau_ecn = '- -'; 
                  }
                });
            }else
            {
              vm.alldata_collect.forEach(function(data_c)
                {
                  if(data_c.code=='CAB')
                  {
                    getIdData_collect  = data_c.id;
                    
                    typeeffort='CAB';
                    vm.echantillon.data_collect_nom = data_c.code;
                    vm.echantillon.peche_hier = '- -';
                    vm.echantillon.peche_avant_hier = '- -';
                    vm.echantillon.nbr_jrs_peche_dernier_sem = '- -';  
                  }
                });
            }


            var datas = $.param(
            {
                supprimer:                        suppression,
                typeeffort:                       typeeffort,      
                id:getIdEchantillon,
                fiche_echantillonnage_capture_id: vm.selectedItem.id,
                type_canoe_id:                    echantillon.type_canoe_id,
                type_engin_id:                    echantillon.type_engin_id,
                peche_hier:                       echantillon.peche_hier,
                peche_avant_hier:                 echantillon.peche_avant_hier,
                nbr_jrs_peche_dernier_sem:        echantillon.nbr_jrs_peche_dernier_sem,
                total_capture:                    echantillon.total_capture,
                unique_code:                      echantillon.unique_code,
                data_collect_id:                  getIdData_collect,
                nbr_bateau_actif:                 echantillon.nbr_bateau_actif,
                total_bateau_ecn:                 echantillon.total_bateau_ecn,
                unite_peche_id:                   echantillon.unite_peche_id,
                user_id:                          cookieService.get("id")
                
            });
           
            //factory
            apiFactory.add("echantillon/index",datas, config).success(function (data)
            {  var effort_p= vm.alldata_collect.filter(function(obj)
                {
                  return obj.id == vm.echantillon.data_collect_id;
                });
                var unite_p= vm.allunite_peche.filter(function(obj)
                {
                  return obj.id == vm.echantillon.unite_peche_id;
                });
              if (NouvelItemEchantillon == false) 
              {
                // Update or delete: id exclu
                var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
                if(suppression==0) 
                { // vm.selectedItem ={};                    
                  vm.selectedItemEchantillon.fiche_echantillonnage_capture_id = vm.selectedItem.id;
                  vm.selectedItemEchantillon.type_canoe_id   = vm.echantillon.type_canoe_id;
                  vm.selectedItemEchantillon.type_canoe_nom  = vm.echantillon.type_canoe_nom;
                  vm.selectedItemEchantillon.type_engin_id   = vm.echantillon.type_engin_id;
                  vm.selectedItemEchantillon.type_engin_nom  = vm.echantillon.type_engin_nom;

                  vm.selectedItemEchantillon.peche_hier                 = vm.echantillon.peche_hier;
                  vm.selectedItemEchantillon.peche_avant_hier           = vm.echantillon.peche_avant_hier;
                  vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem  = vm.echantillon.nbr_jrs_peche_dernier_sem; 
                  vm.selectedItemEchantillon.total_capture              = vm.echantillon.total_capture;
                  vm.selectedItemEchantillon.unique_code                = vm.echantillon.unique_code;
                      
                  vm.selectedItemEchantillon.data_collect  = effort_p[0];
                      
                  vm.selectedItemEchantillon.nbr_bateau_actif = vm.echantillon.nbr_bateau_actif;
                  vm.selectedItemEchantillon.total_bateau_ecn = vm.echantillon.total_bateau_ecn;

                  vm.selectedItemEchantillon.unite_peche  = unite_p[0];
                      
                  vm.selectedItemEchantillon.user_id  = cookieService.get("id");
                      
                  vm.selectedItemEchantillon.date_creation = vm.echantillon.date_creation;
                  vm.selectedItemEchantillon.date_modification = current_date;
                      
                  vm.afficherboutonModifSuprEchantillon = 0 ;
                  vm.afficherboutonnouveauEchantillon   = 1 ;
                  vm.selectedItemEchantillon.$selected = false;
                  // console.log(vm.selectedItemEchantillon);
                  vm.selectedItemEchantillon ={};
                } 
                else 
                {    
                  vm.allechantillon = vm.allechantillon.filter(function(obj)
                  {
                    return obj.id !== currentItemEchantillon.id;
                  });
                }
              }
              else
              {
                var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
                var user = {id:cookieService.get("id"),nom:cookieService.get("nom")};
                var item =
                {
                  fiche_echantillonnage_capture_id: vm.selectedItem.id,
                  peche_hier:                       echantillon.peche_hier,
                  peche_avant_hier:                 echantillon.peche_avant_hier,
                  nbr_jrs_peche_dernier_sem:        echantillon.nbr_jrs_peche_dernier_sem,
                  total_capture:                    total_captur,
                  unique_code:                      echantillon.unique_code,
                  data_collect:                     effort_p[0],
                  nbr_bateau_actif:                 echantillon.nbr_bateau_actif,
                  total_bateau_ecn:                 echantillon.total_bateau_ecn,
                  unite_peche:                      unite_p[0],
                  user_id:                          user,
                  date_creation:                    current_date,
                  date_modification:                current_date,
                  id:                               String(data.response) 
                };
        
                    vm.allechantillon.push(item);
                    
                    vm.echantillon  ={};                  
                    
                    NouvelItemEchantillon=false;
              }

                  vm.affichageMasqueEchantillon = 0 ;

            })
              .error(function (data)
              {
                alert('Error');
              });
                
        }

/******************************************** Fin echantillon  ******************************************************/

/******************************************** Debut espece  ******************************************************/
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


    function insert_in_baseEspece_capture(espece_capture,suppression)
    {           
      //add
      var config =
      {
        headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
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
      apiFactory.add("espece_capture/index",datas, config).success(function (data)
      {var espece= vm.allespece.filter(function(obj)
        {
            return obj.id == vm.espece_capture.espece_id;
        });
        if (NouvelItemEspece_capture == false) 
        {
          // Update or delete: id exclu
          var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
          if(suppression==0) 
          { // vm.selectedItem ={};
            var total_capture_selected= vm.selectedItemEspece_capture.capture;                   
            
            vm.selectedItemEspece_capture.fiche_echantillonnage_capture_id = vm.selectedItem.id;
            vm.selectedItemEspece_capture.echantillon_id      = vm.selectedItemEchantillon.id;
            vm.selectedItemEspece_capture.espece              = espece[0];

            vm.selectedItemEspece_capture.capture             = vm.espece_capture.capture;
            vm.selectedItemEspece_capture.prix                = vm.espece_capture.prix;
                      
            vm.selectedItemEspece_capture.user_id             = cookieService.get("id");
                      
            vm.selectedItemEspece_capture.date_creation       = vm.espece_capture.date_creation;
            vm.selectedItemEspece_capture.date_modification   = current_date;
                      
            vm.afficherboutonModifSuprEspece_capture          = 0 ;
            vm.afficherboutonnouveauEspece_capture            = 1 ;
            vm.selectedItemEspece_capture.$selected           = false;                   
                     
            var tot_cap1=parseInt(vm.selectedItemEchantillon.total_capture)- parseInt(total_capture_selected) ;
            var tot_cap=parseInt(tot_cap1)+parseInt(vm.espece_capture.capture);
            
            majtotal_captureEchantillon(tot_cap,config);
            vm.selectedItemEspece_capture ={};
          } 
          else 
          {    
            vm.allespece_capture = vm.allespece_capture.filter(function(obj)              
            {
              return obj.id !== currentItemEspece_capture.id;
            });
            var tot_cap=parseInt(vm.selectedItemEchantillon.total_capture)- parseInt(currentItemEspece_capture.capture) ;
            
            
            majtotal_captureEchantillon(tot_cap,config);
          }
        }
        else
        { 
          var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
          var user = {id:cookieService.get("id"),nom:cookieService.get("nom")};
          var item =
          {
            espece:                           espece[0],
            capture:                          espece_capture.capture,
            prix:                             espece_capture.prix,                        
            user:                             user,
            date_creation:                    current_date,
            date_modification:                current_date,
            id:                   String(data.response) 
          };
        
          vm.allespece_capture.push(item);
                    
          var tot_cap=parseInt(vm.selectedItemEchantillon.total_capture)+ parseInt(espece_capture.capture);
          majtotal_captureEchantillon(tot_cap,config);

          vm.espece_capture={};                  
                    
          NouvelItemEspece_capture=false;
        }

        vm.affichageMasqueEspece_capture = 0 ;

      })
        .error(function (data)
        {
          alert('Error');
        });
                
    }
//*****************************************************************

// Debut Mise à jour total-capture lors nouvelle insertion espece_capture      
      function majtotal_captureEchantillon(tot_cap,config)
      { var typeeffort='';
        if(vm.selectedItemEchantillon.unite_peche_nom=='PAB'){
        typeeffort='PAB';
        }else{
          typeeffort='CAB';
        }
        var datasmaj = $.param(
        {
          supprimer:                        0,
          typeeffort:                       typeeffort,
          id:vm.selectedItemEchantillon.id,
          fiche_echantillonnage_capture_id: vm.selectedItem.id,
          peche_hier:                       vm.selectedItemEchantillon.peche_hier,
          peche_avant_hier:                 vm.selectedItemEchantillon.peche_avant_hier,
          nbr_jrs_peche_dernier_sem:        vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem,
          total_capture:                    tot_cap,
          unique_code:                      vm.selectedItemEchantillon.unique_code,
          data_collect_id:                  vm.selectedItemEchantillon.data_collect.id,
          nbr_bateau_actif:                 vm.selectedItemEchantillon.nbr_bateau_actif,
          total_bateau_ecn:                 vm.selectedItemEchantillon.total_bateau_ecn,
          unite_peche_id:                   vm.selectedItemEchantillon.unite_peche.id,
          user_id:                          cookieService.get("id")                        
        });

//factory
        apiFactory.add("echantillon/index",datasmaj, config).success(function (data)
        {
          // Update or delete: id exclu
          var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");                                     
          vm.selectedItemEchantillon.fiche_echantillonnage_capture_id = vm.selectedItem.id;
          vm.selectedItemEchantillon.type_canoe_id              = vm.selectedItemEchantillon.type_canoe_id;
          vm.selectedItemEchantillon.type_canoe_nom             = vm.selectedItemEchantillon.type_canoe_nom;
          vm.selectedItemEchantillon.type_engin_id              = vm.selectedItemEchantillon.type_engin_id;
          vm.selectedItemEchantillon.type_engin_nom             = vm.selectedItemEchantillon.type_engin_nom;

          vm.selectedItemEchantillon.peche_hier                 = vm.selectedItemEchantillon.peche_hier;
          vm.selectedItemEchantillon.peche_avant_hier           = vm.selectedItemEchantillon.peche_avant_hier;
          vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem  = vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem; 
          vm.selectedItemEchantillon.total_capture              = tot_cap;
          vm.selectedItemEchantillon.unique_code                = vm.selectedItemEchantillon.unique_code;
                        
          vm.selectedItemEchantillon.data_collect_id            = vm.selectedItemEchantillon.data_collect_id;
          vm.selectedItemEchantillon.data_collect_nom           = vm.selectedItemEchantillon.data_collect_nom;
                        
          vm.selectedItemEchantillon.nbr_bateau_actif           = vm.selectedItemEchantillon.nbr_bateau_actif;
          vm.selectedItemEchantillon.total_bateau_ecn           = vm.selectedItemEchantillon.total_bateau_ecn;
                        
          vm.selectedItemEchantillon.user_id                    = cookieService.get("id");
          vm.selectedItemEchantillon.user_nom                   = cookieService.get("nom");
                        
          vm.selectedItemEchantillon.date_creation              = vm.selectedItemEchantillon.date_creation;
          vm.selectedItemEchantillon.date_modification          = current_date;
          
        }).error(function (data)
            {
              alert('Error');
            });          
      }




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
      

      $scope.removeBoutonEspece_capture = function() {
        vm.afficherboutonModifSuprEspece_capture = 0 ;
      }





        //function cache masque de saisie
        vm.ajouterEchantillon = function () 
        {        
          var confirm = $mdDialog.confirm({
              controller: DialogController,
              templateUrl: 'app/main/peche/fiche_echantillonnage_capture/dialog.html',
              parent: angular.element(document.body),
              
              })
                $mdDialog.show(confirm).then(function(data)
                  { 
                  }, 
                  function()
                  {//alert('rien');
                  });
        };

        vm.ajouterEspece_capture = function () {
        vm.selectedItemEspece_capture.$selected = false;
        vm.step3=false;
        vm.affichageMasqueEspece_capture = 1 ;
        vm.affichageMasque = 0 ;
        vm.affichageMasqueEchantillon = 0 ;
        vm.espece_capture = {} ;
        NouvelItemEspece_capture = true ;
        };



        vm.annulerEspece_capture = function() {
          vm.selectedItemEspece_capture = {} ;
          vm.selectedItemEspece_capture.$selected = false;
          vm.affichageMasqueEspece_capture = 0 ;
          vm.afficherboutonnouveauEspece_capture = 1 ;
          vm.afficherboutonModifSuprEspece_capture = 0 ;
          
          NouvelItemEspece_capture = false;
        };





        vm.modifierEspece_capture = function()
        {
          NouvelItemEspece_capture                 = false ;
          vm.affichageMasqueEspece_capture         = 1 ;
          vm.affichageMasqueEchantillon            = 0 ;
          vm.affichageMasque                       = 0 ;
          vm.espece_capture.id                     = vm.selectedItemEspece_capture.id ;
          vm.espece_capture.espece_id              =vm.selectedItemEspece_capture.espece.id ;
          vm.espece_capture.capture                =vm.selectedItemEspece_capture.capture;
          vm.espece_capture.prix                   =vm.selectedItemEspece_capture.prix;
          vm.espece_capture.id_user                =vm.selectedItemEspece_capture.user.id;
          vm.espece_capture.date_creation          =vm.selectedItemEspece_capture.date_creation;
          vm.afficherboutonModifSuprEspece_capture = 0;
          vm.afficherboutonnouveauEspece_capture   = 0;
          
         /* vm.allespece.forEach(function(esp)
          {
            if(esp.id==vm.selectedItemEspece_capture.espece_id)
            {
              vm.espece_capture.espece_id = esp.id ;
              vm.espece_capture.espece_nom = esp.nom_local ;
            }
          });*/

        };



        vm.supprimerEchantillon = function() 
        {
          vm.afficherboutonModifSuprEchantillon = 0 ;
          vm.affichageMasqueEchantillon = 0 ;
          var confirm = $mdDialog.confirm().title('Etes-vous sûr de supprimer cet enregistrement ?')
                                  .textContent('')
                                  .ariaLabel('Lucky day')
                                  .clickOutsideToClose(true)
                                  .parent(angular.element(document.body))
                                  .ok('ok')
                                  .cancel('annuler');

          $mdDialog.show(confirm).then(function()
          {
            ajoutEchantillon(vm.selectedItemEchantillon,1);
          }, function()
            {
              //alert('rien');
            });
        };

         vm.supprimerEspece_capture = function()
         {
            vm.affichageMasqueEspece_capture = 0 ;
            vm.afficherboutonModifSuprEspece_capture = 0 ;
            var confirm = $mdDialog.confirm().title('Etes-vous sûr de supprimer cet enregistrement ?')
                                    .textContent('')
                                    .ariaLabel('Lucky day')
                                    .clickOutsideToClose(true)
                                    .parent(angular.element(document.body))
                                    .ok('ok')
                                    .cancel('annuler');
            $mdDialog.show(confirm).then(function()
            {
              vm.ajoutEspece_capture(vm.selectedItemEspece_capture,1);
            }, function()
              {
                //alert('rien');
              });
        };

        /*var currentItemregion;
        vm.modifierregion = function (item) 
        {
          vm.allregion.forEach(function(reg)
          {
            if(reg.id==item.region_id)
            {
              item.region_id        = reg.id; 
              item.region_nom       = reg.nom;
              currentItemregion     =reg.id;                 
              
              vm.allcurrentdistrict = vm.alldistrict.filter(function(obj)
              {                 
                return obj.region_id == currentItemregion;
              });
                 
            }
          });
        }*/

       /* vm.modifierdistrict = function (item)
        {
          vm.alldistrict.forEach(function(dist)
          {
            if(dist.id==item.district_id)
            {
              item.district_id  = dist.id; 
              item.district_nom = dist.nom;
            }
          });
        }*/
       
      /*  vm.modifierunite_peche = function (item)
        {
          vm.allunite_peche.forEach(function(unite_p)
          {
            if(unite_p.id==item.unite_peche_id)
            {
              item.unite_peche_id  = unite_p.id; 
              item.unite_peche_nom = unite_p.libelle;
              item.type_canoe_id   =unite_p.type_canoe_id;
              item.type_canoe_nom  =unite_p.type_canoe_nom;
              item.type_engin_id =unite_p.type_engin_id;
              item.type_engin_nom=unite_p.type_engin_nom;         
            }
          });
 

        }*/




      /*  vm.modifiertype_canoe = function (item)
        {
          vm.alltype_canoe.forEach(function(type_c)
          {
            if(type_c.id==item.type_canoe_id)
            {
              item.type_canoe_id  = type_c.id; 
              item.type_canoe_nom = type_c.nom;
            }
          });
        }*/
      /*  vm.modifiertype_engin = function (item)
        {
          vm.alltype_engin.forEach(function(type_e)
          {
            if(type_e.id==item.type_engin_id)
            {
              item.type_engin_id  = type_e.id; 
              item.type_engin_nom = type_e.libelle;                 
            }
          });
        }*/
        vm.modifierdata_collect = function (item)
        {
          vm.alldata_collect.forEach(function(data_c)
          {
            if(data_c.id==item.data_collect_id)
            {
              item.data_collect_id  = data_c.id; 
              item.data_collect_nom = data_c.code;
               
            }
          });
          
          if(item.data_collect_nom=='PAB')
          {
            vm.pab=true;
          }
          else
          {
            vm.pab=false;
          }
        }

      /*  vm.modifierespece = function (item)
        {          
          vm.allespece.forEach(function(esp)
          {
            if(esp.id==item.espece_id)
            {
              item.espece_id  = esp.id; 
              item.espece_nom = esp.nom_local;
            }
          });

        }*/


        function test_existance (item,suppression) 
        {
           
            if (suppression!=1) 
            {
              vm.allfiche_echantillonnage_capture.forEach(function(fiche)
              {
                
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



        function test_existanceEspece_capture (item,suppression) 
        {
          if (suppression!=1) 
          {
            vm.allespece_capture.forEach(function(esp)
            {
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

function DialogController($mdDialog, $scope)
{ 
  var dg=$scope;
  dg.typeajout= {type : 'PAB'};

  dg.cancel = function()
  {
    $mdDialog.cancel();
  };

  dg.dialognouveauajout = function(typeajout)
  {
    if(typeajout=='PAB')
    {
      vm.pab=true;
      vm.selectedItemEchantillon.$selected = false;
      vm.step2=false;
      vm.step3=false;
      vm.affichageMasqueEchantillon = 1 ;
      vm.affichageMasque = 0 ;
      vm.affichageMasqueEspece_capture = 0 ;
      vm.echantillon.fiche_echantillonnage_capture_id='';
      vm.echantillon.type_canoe_id='';
      vm.echantillon.type_engin_id='';
      vm.echantillon.peche_hier='';
      vm.echantillon.peche_avant_hier='';
      vm.echantillon.nbr_jrs_peche_dernier_sem='';
      vm.echantillon.total_capture='';
      vm.echantillon.unique_code='';
      vm.echantillon.data_collect_id='';
      vm.echantillon.unite_peche_id='';
      vm.echantillon.date_creation='';
      vm.echantillon.date_modification='';

      NouvelItemEchantillon = true ;          


    }
    else
    {
      vm.pab=false;
      vm.selectedItemEchantillon.$selected = false;
      vm.step2=false;
      vm.step3=false;
      vm.affichageMasqueEchantillon = 1 ;
      vm.affichageMasque = 0 ;
      vm.affichageMasqueEspece_capture = 0 ;
      vm.echantillon.fiche_echantillonnage_capture_id='';
      vm.echantillon.type_canoe_id='';
      vm.echantillon.type_engin_id='';
      vm.echantillon.total_capture='';
      vm.echantillon.unique_code='';
      vm.echantillon.data_collect_id='';
      vm.echantillon.nbr_bateau_actif='';
      vm.echantillon.total_bateau_ecn='';
      vm.echantillon.unite_peche_id='';
      vm.echantillon.date_creation='';
      vm.echantillon.date_modification='';
      NouvelItemEchantillon = true ; 
    }
    $mdDialog.cancel();
    vm.input_data_collect     = false;
  }


}


    }
})();
