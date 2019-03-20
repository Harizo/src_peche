(function ()
{
    'use strict';

    angular
        .module('app.peche.validation_fiche_echantillonnage_capture')
        .controller('Validation_fiche_echantillonnage_captureController', Validation_fiche_echantillonnage_captureController);

    /** @ngInject */
    function Validation_fiche_echantillonnage_captureController($mdDialog, $scope, $location, apiFactory, $cookieStore,cookieService)
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
      vm.allunite_peche_site                 = [];
      vm.step1                               = false;
      vm.step2                               = false;
      vm.step3                               = false;



      
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

     /* apiFactory.getAll("unite_peche/index").then(function(result)
      {vm.allunite_peche = result.data.response;});*/
   
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
      var validation = 0;
      apiFactory.getEchantillonnageByValidation("fiche_echantillonnage_capture/index",validation).then(function(result)
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
          vm.afficherboutonValidation          = 1 ;
          //vm.allechantillon                   = [];
          apiFactory.getFils("echantillon/index",item.id).then(function(result)
          {
              vm.allechantillon = result.data.response;
          });
          apiFactory.getFils("unite_peche_site/index",item.site_embarquement.id).then(function(result)
          {
              vm.allunite_peche_site = result.data.response;
              console.log(vm.allunite_peche_site);
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
                    ||(fiche.site_embarquement.id!=item.site_embarquement_id)
                    ||(fiche.enqueteur.id!=item.enqueteur_id)
                    ||(fiche.latitude!=item.latitude)
                    ||(fiche.longitude!=item.longitude)
                    ||(fiche.altitude!=item.altitude)
                    ||(fiche.date!=item.date)
                    ||(fiche.region.id!=item.region_id)
                    ||(fiche.district.id!=item.district_id))                    
                  {
                    insert_in_base(item,suppression);

                  }
                  else
                  {

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
          var date = new Date(fiche_echantillonnage_capture.date);       
          var date_jour = date.getDate();
          var date_mois = date.getMonth()+1;
          var date_annee = date.getFullYear();
          if(date_mois <10)
          {
              date_mois = '0'+date_mois;
          }
          var date_fiche= date_annee+"-"+date_mois+"-"+date_jour;

        var datas = $.param(
        {
          supprimer:            suppression,
          id:getId,
          code_unique:          fiche_echantillonnage_capture.code_unique,
          date:                 date_fiche,
          longitude:            fiche_echantillonnage_capture.longitude,
          latitude:             fiche_echantillonnage_capture.latitude,
          altitude:             fiche_echantillonnage_capture.altitude,
          site_embarquement_id: fiche_echantillonnage_capture.site_embarquement_id,
          enqueteur_id:         fiche_echantillonnage_capture.enqueteur_id,
          district_id:          fiche_echantillonnage_capture.district_id,
          region_id:            fiche_echantillonnage_capture.region_id,
          user_id:              cookieService.get("id"),
          validated:            1
                    
        });
             
    //factory
        apiFactory.add("fiche_echantillonnage_capture/index",datas, config).success(function (data)
        {
            //vm.allcurrentdistrict=vm.alldistrict;
            var user = {id:cookieService.get("id"),nom:cookieService.get("nom")};
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
                    vm.selectedItem.date              = date_fiche;
                    vm.selectedItem.date_creation     = vm.fiche_echantillonnage_capture.date_creation;
                    vm.selectedItem.date_modification = date_dujour;
                    vm.selectedItem.latitude          = vm.fiche_echantillonnage_capture.latitude;
                    vm.selectedItem.longitude         = vm.fiche_echantillonnage_capture.longitude;
                    vm.selectedItem.altitude          = vm.fiche_echantillonnage_capture.altitude;

                    vm.selectedItem.enqueteur          = enqt[0];
                    vm.selectedItem.site_embarquement  = site_emba[0];
                    vm.selectedItem.user          = user;          
                    
                    vm.selectedItem.region        = reg[0];
                    vm.selectedItem.district      = dist[0];                              
                    vm.afficherboutonValidation = 0 ;

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
                
                var item = 
                {
                  code_unique:          fiche_echantillonnage_capture.code_unique,
                  date:                 date_fiche,
                  date_creation:        date_dujour,
                  date_modification:    date_dujour,
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

              })
                .error(function (data)
                {
                alert('Error');
                });
                
    }


    $scope.removeBouton = function()
    {
        //vm.afficherboutonModifSuprEchantillon = 0 ;
    }

/************************************ Fin fiche_echantillonnage_capture  ***********************************************/
  

/******************************************** Debut echantillon  ******************************************************/
    vm.selectionechantillon= function (item)
    {
        vm.selectedItemEchantillon = item;
        vm.nouvelItemEchantillon = item;
        currentItemEchantillon = JSON.parse(JSON.stringify(vm.selectedItemEchantillon));
        //vm.afficherboutonModifSuprEchantillon = 1 ;
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
                    ||(echan.peche_hier!=item.peche_hier)
                    ||(echan.peche_avant_hier!=item.peche_avant_hier)
                    ||(echan.nbr_jrs_peche_dernier_sem!=item.nbr_jrs_peche_dernier_sem)
                    ||(echan.total_capture!=item.total_capture)
                    ||(echan.unique_code!=item.unique_code)
                    ||(echan.data_collect.id!=item.data_collect_id)
                    ||(echan.nbr_bateau_actif!=item.nbr_bateau_actif)
                    ||(echan.total_bateau_ecn!=item.total_bateau_ecn)
                    ||(echan.unite_peche.id!=item.unite_peche_id))
                {
                  insert_in_baseEchantillon(item,suppression);
 
                }
                else
                {

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
      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      var getIdEchantillon = 0;
      var total_captur=0;

      var effort_p=[];
      if (NouvelItemEchantillon==false) 
      {
          getIdEchantillon = vm.selectedItemEchantillon.id;                

      }
      else
      {
          echantillon.total_capture=total_captur;
      }
      

      var effort_p= vm.alldata_collect.filter(function(obj)
          {
              return obj.id == vm.echantillon.data_collect_id;
          });

      var datas = $.param(
      {
          supprimer:                        suppression,
          typeeffort:                       effort_p[0].code,      
          id:getIdEchantillon,
          fiche_echantillonnage_capture_id: vm.selectedItem.id,
          peche_hier:                       echantillon.peche_hier,
          peche_avant_hier:                 echantillon.peche_avant_hier,
          nbr_jrs_peche_dernier_sem:        echantillon.nbr_jrs_peche_dernier_sem,
          total_capture:                    echantillon.total_capture,
          unique_code:                      echantillon.unique_code,
          data_collect_id:                  echantillon.data_collect_id,
          nbr_bateau_actif:                 echantillon.nbr_bateau_actif,
          total_bateau_ecn:                 echantillon.total_bateau_ecn,
          unite_peche_id:                   echantillon.unite_peche_id,
          user_id:                          cookieService.get("id")                
      });
           
      //factory
      apiFactory.add("echantillon/index",datas, config).success(function (data)
      {  
          var user = {id:cookieService.get("id"),nom:cookieService.get("nom")};
          var unite_p= vm.allunite_peche_site.filter(function(obj)
          {
              return obj.unite_peche.id == vm.echantillon.unite_peche_id;
          });
          if (NouvelItemEchantillon == false) 
          {
              // Update or delete: id exclu
                  if(suppression==0) 
                  { // vm.selectedItem ={}; 
                  if(effort_p[0].code=='PAB'){
                      vm.selectedItemEchantillon.nbr_bateau_actif = '- -';
                      vm.selectedItemEchantillon.total_bateau_ecn = '- -';
                      vm.selectedItemEchantillon.peche_hier                 = vm.echantillon.peche_hier;
                      vm.selectedItemEchantillon.peche_avant_hier           = vm.echantillon.peche_avant_hier;
                      vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem  = vm.echantillon.nbr_jrs_peche_dernier_sem;
                  }else{
                      vm.selectedItemEchantillon.peche_hier                 = '- -';
                      vm.selectedItemEchantillon.peche_avant_hier           = '- -';
                      vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem  = '- -';
                      vm.selectedItemEchantillon.nbr_bateau_actif = vm.echantillon.nbr_bateau_actif;
                      vm.selectedItemEchantillon.total_bateau_ecn = vm.echantillon.total_bateau_ecn;

                  }                   
                  vm.selectedItemEchantillon.fiche_echantillonnage_capture_id = vm.selectedItem.id;
                  vm.selectedItemEchantillon.type_canoe_id   = vm.echantillon.type_canoe_id;
                  vm.selectedItemEchantillon.type_canoe_nom  = vm.echantillon.type_canoe_nom;
                  vm.selectedItemEchantillon.type_engin_id   = vm.echantillon.type_engin_id;
                  vm.selectedItemEchantillon.type_engin_nom  = vm.echantillon.type_engin_nom;

                 // vm.selectedItemEchantillon.peche_hier                 = vm.echantillon.peche_hier;
                 // vm.selectedItemEchantillon.peche_avant_hier           = vm.echantillon.peche_avant_hier;
                  //vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem  = vm.echantillon.nbr_jrs_peche_dernier_sem; 
                  vm.selectedItemEchantillon.total_capture              = vm.echantillon.total_capture;
                  vm.selectedItemEchantillon.unique_code                = vm.echantillon.unique_code;
                      
                  vm.selectedItemEchantillon.data_collect  = effort_p[0];
                      
                 // vm.selectedItemEchantillon.nbr_bateau_actif = vm.echantillon.nbr_bateau_actif;
                 // vm.selectedItemEchantillon.total_bateau_ecn = vm.echantillon.total_bateau_ecn;

                  vm.selectedItemEchantillon.unite_peche  = unite_p[0].unite_peche;
                      
                  vm.selectedItemEchantillon.user  = user;
                      
                  vm.selectedItemEchantillon.date_creation = vm.echantillon.date_creation;
                  vm.selectedItemEchantillon.date_modification = date_dujour;
                      
                 // vm.afficherboutonModifSuprEchantillon = 0 ;
                  vm.selectedItemEchantillon.$selected = false;
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
              if(effort_p[0].code=='PAB'){
                      echantillon.nbr_bateau_actif = '- -';
                      echantillon.total_bateau_ecn = '- -';
                      echantillon.peche_hier                 = echantillon.peche_hier;
                      echantillon.peche_avant_hier           = echantillon.peche_avant_hier;
                      echantillon.nbr_jrs_peche_dernier_sem  = echantillon.nbr_jrs_peche_dernier_sem;
                  }else{
                      echantillon.peche_hier                 = '- -';
                      echantillon.peche_avant_hier           = '- -';
                      echantillon.nbr_jrs_peche_dernier_sem  = '- -';
                      echantillon.nbr_bateau_actif = echantillon.nbr_bateau_actif;
                      echantillon.total_bateau_ecn = echantillon.total_bateau_ecn;

                  }
              
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
                  unite_peche:                      unite_p[0].unite_peche,
                  user:                             user,
                  date_creation:                    date_dujour,
                  date_modification:                date_dujour,
                  id:                               String(data.response) 
              };
               vm.allechantillon.push(item);
               vm.echantillon  ={};                  
               NouvelItemEchantillon=false;
          }

      }).error(function (data)
          {
              alert('Error');
          });
                
  }



/******************************************** Fin echantillon  ******************************************************/

/******************************************** Debut espece  ******************************************************/
  vm.selectionEspece_capture= function (item)
  {        
      vm.selectedItemEspece_capture = item;
      vm.nouvelItemEspece_capture = item;
      currentItemEspece_capture = JSON.parse(JSON.stringify(vm.selectedItemEspece_capture));
     // vm.afficherboutonModifSuprEspece_capture = 1 ; 
      vm.step3=true;
  };

  $scope.$watch('vm.selectedItemEspece_capture', function()
  {
      if (!vm.allespece_capture) return;
      vm.allespece_capture.forEach(function(item)
      {
          item.$selected = false;
      });
        vm.selectedItemEspece_capture.$selected = true;
  });


  function ajoutEspece_capture(espece_capture,suppression)
  {
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
        var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
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
        {
            var espece= vm.allespece.filter(function(obj)
            {
                return obj.id == vm.espece_capture.espece_id;
            });
            if (NouvelItemEspece_capture == false) 
            {
                // Update or delete: id exclu
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
                    vm.selectedItemEspece_capture.date_modification   = date_dujour;
                              
                   // vm.afficherboutonModifSuprEspece_capture          = 0 ;

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
                var user = {id:cookieService.get("id"),nom:cookieService.get("nom")};
                var item =
                {
                  espece:                           espece[0],
                  capture:                          espece_capture.capture,
                  prix:                             espece_capture.prix,                        
                  user:                             user,
                  date_creation:                    date_dujour,
                  date_modification:                date_dujour,
                  id:                   String(data.response) 
                };
              
                vm.allespece_capture.push(item);                          
                var tot_cap=parseInt(vm.selectedItemEchantillon.total_capture)+ parseInt(espece_capture.capture);
                majtotal_captureEchantillon(tot_cap,config);
                vm.espece_capture={};                         
                NouvelItemEspece_capture=false;
            }
        }).error(function (data)
          {
            alert('Error');
          });
                
    }

    function test_existanceEspece_capture (item,suppression) 
    {
        if (suppression!=1) 
        {
            vm.allespece_capture.forEach(function(esp)
            {
                if (esp.id==item.id) 
                {
                  if((esp.fiche_echantillonnage_capture.id!=item.fiche_echantillonnage_capture_id)
                    ||(esp.echantillon.id!=item.echantillon_id)
                    ||(esp.espece.id!=item.espece_id)
                    ||(esp.capture!=item.capture)
                    ||(esp.prix!=item.prix))
                  {
                      insert_in_baseEspece_capture(item,suppression);
                  }
                  else
                  {
                 
                  }
                }
            });
        }
        else
            insert_in_baseEspece_capture(item,suppression);
    }      

    $scope.removeBoutonEspece_capture = function()
    {
        //vm.afficherboutonModifSuprEspece_capture = 0 ;
    }


    }
})();
