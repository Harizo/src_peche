(function ()
{
    'use strict';

    angular
        .module('app.peche.validation_fiche_echantillonnage_capture')
        .controller('Validation_fiche_echantillonnage_captureController', Validation_fiche_echantillonnage_captureController);

    /** @ngInject */
    function Validation_fiche_echantillonnage_captureController($mdDialog, $scope, $location, apiFactory, $cookieStore,cookieService,apiUrlserver)
    {
      var vm                                 = this;
      vm.ajout                               = ajout;
      vm.apiUrlimage                         =apiUrlserver;
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
      vm.selectedItemEchantillon.$selected   = false;
      vm.selectedItemEspece_capture          = {};
      vm.selectedItemEspece_capture.$selected= false;
      
      vm.allfiche_echantillonnage_capture    = [];
      vm.allechantillon                      = [];
      vm.allespece_capture                   = [];
      vm.currrentSite_embarquement           = [];
      vm.allunite_peche_site                 = [];
      vm.echantillon                         = [];

      //variale affichage bouton nouveau
      vm.afficherboutonnouveau               = 1;
      vm.afficherboutonfiltre                = 1;
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
      //vm.pab                                 = false;
      
      vm.date_begin                          = false;
     // vm.checkboxPAB                         = false;
      //vm.checkboxCAB                         = false;
      vm.date_now = new Date();
      vm.filtrepardate = {} ;
      vm.filtrepardate.date_fin = new Date() ;
      vm.num_dernier_code = 0;
      vm.enableUnitepeche = false;
      
//style
      vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.step = [{step:1},{step:2},{step:3}];
    


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

      apiFactory.getOne("utilisateurs/index",cookieService.get("id")).then(function(result)
      {vm.allutilisateur = result.data.response;});

     /* apiFactory.getAll("unite_peche/index").then(function(result)
      {vm.allunite_peche = result.data.response;});*/
   
   /* apiFactory.getAll("fiche_echantillonnage_capture/index").then(function(result){
      vm.allfiche_echantillonnage_capture = result.data.response;
    });*/

/*********** ************************Debut fi fiche_echantillonnage_capture  *******************************************/
    
      var date_today  = new Date();
      var date_dujour = convertionDate(date_today);
      var validation = 0;
      apiFactory.getEchantillonnageByDate("fiche_echantillonnage_capture/index",date_dujour,date_dujour,validation).then(function(result)
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
            vm.enableUnitepeche = false;
          }
          currentItem = vm.selectedItem;
          vm.afficherboutonModifSupr          = 1 ;
          vm.afficherboutonModif              = 1 ;
          vm.afficherboutonnouveau            = 1 ;
          vm.afficherboutonfiltre             = 1;
          vm.afficherboutonnouveauEchantillon = 1 ;
          
          //recuperation echantillon quand id_echantillon = item.id                  = [];
          apiFactory.getFils("echantillon/index",item.id).then(function(result)
          {
              try
              {                  
                vm.allechantillon = result.data.response;                 
              }catch(e){

              }finally{
                vm.echantillonfiltre = vm.allechantillon.filter(function(obj)
                  {
                      return obj.data_collect.code == 'PAB';
                  });
              }
           });
          //recuperation unite_peche quand id_site_embarquement = item.site_embarquement.id
          apiFactory.getFils("unite_peche_site/index",item.site_embarquement.id).then(function(result)
          {
              vm.allunite_peche_site = result.data.response;
              
          });
          vm.checkboxPAB = true;
          vm.checkboxCAB = false;
          vm.step1       = true;  
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
          vm.fiche_echantillonnage_capture.date            = new Date(vm.selectedItem.date);
          vm.fiche_echantillonnage_capture.date_creation   = vm.selectedItem.date_creation;
          vm.fiche_echantillonnage_capture.latitude        = vm.selectedItem.latitude;
          vm.fiche_echantillonnage_capture.longitude       = vm.selectedItem.longitude;
          vm.fiche_echantillonnage_capture.altitude        = vm.selectedItem.altitude;
          vm.fiche_echantillonnage_capture.region_id       = vm.selectedItem.region.id ;
          vm.fiche_echantillonnage_capture.district_id     = vm.selectedItem.district.id ;
          vm.fiche_echantillonnage_capture.enqueteur_id    =vm.selectedItem.enqueteur.id ;
          vm.fiche_echantillonnage_capture.site_embarquement_id = vm.selectedItem.site_embarquement.id ;
          
          //liste site_embarquement quand id enqueteur vm.selectedItem.enqueteur.id 
          apiFactory.getFils("site_enqueteur/index",vm.selectedItem.enqueteur.id).then(function(result)
          {
            vm.allsite_enqueteur = result.data.response;
            vm.allsite_embarquement = vm.allsite_enqueteur;
            //console.log(vm.allsite_enqueteur);
          });
          
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonModif     = 1 ;
          vm.afficherboutonnouveau   = 0;
          vm.afficherboutonfiltre    = 0;  

      };

      vm.annuler = function() 
      {   vm.selectedItem = {} ;          
          vm.selectedItem.$selected = false;
          vm.affichageMasque         = 0 ;
          vm.afficherboutonnouveau   = 1 ;
          vm.afficherboutonfiltre    = 1;
          vm.afficherboutonModifSupr = 0 ;
          vm.afficherboutonModif     = 0 ;
          NouvelItem                 = false;
          vm.allcurrentdistrict      = vm.alldistrict;
          vm.affichageMasqueFiltrepardate = 0 ;
      };
//valider la fiche echantillonnage capture
      vm.valider =function()   
      {   var suppression = 0;
          var validation = 1;
          var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }};

          var date = new Date(vm.selectedItem.date);
          var date_fiche = convertionDate(date);
          var datas = $.param(
          {
            supprimer:            suppression,
            id:                   vm.selectedItem.id,
            code_unique:          vm.selectedItem.code_unique,
            date:                 date_fiche,
            longitude:            vm.selectedItem.longitude,
            latitude:             vm.selectedItem.latitude,
            altitude:             vm.selectedItem.altitude,
            validation:           validation,
            site_embarquement_id: vm.selectedItem.site_embarquement.id,
            enqueteur_id:         vm.selectedItem.enqueteur.id,
            district_id:          vm.selectedItem.district.id,
            region_id:            vm.selectedItem.region.id,
            user_id:              vm.selectedItem.user.id                      
          });
          var confirm = $mdDialog.confirm().title('Etes-vous sûr de vouloir faire cet action ?')
                                .textContent('')
                                .ariaLabel('Lucky day')
                                .clickOutsideToClose(true)
                                .parent(angular.element(document.body))
                                .ok('ok')
                                .cancel('annuler');

        $mdDialog.show(confirm).then(function()
        {
          apiFactory.add("fiche_echantillonnage_capture/index",datas, config).success(function (data)
          {
            vm.allfiche_echantillonnage_capture = vm.allfiche_echantillonnage_capture.filter(function(obj)
            {
                return obj.id !== currentItem.id;
            });
          }).error(function (data)
            {alert('Error');}); 
        }, function()
            {
              //alert('rien');
            });
                        
      };
//function cache masque de saisie
      vm.ajouter = function () 
      {           
          vm.selectedItem.$selected = false;
          vm.step1 = false;
          vm.step2 = false;
          vm.step3=  false;
          vm.affichageMasque          = 1 ;
          vm.afficherboutonfiltre     = 0;
          vm.afficherboutonModifSupr  =0;
          vm.afficherboutonModif      = 0 ;
          vm.fiche_echantillonnage_capture = {};
          NouvelItem    = true ;
          vm.enqueteur =   false;
          vm.fiche_echantillonnage_capture.date = vm.date_now;
      };

    function ajout(fiche_echantillonnage_capture,suppression,validation)   
    {
      if (NouvelItem==false) 
      {
        test_existance (fiche_echantillonnage_capture,suppression,validation); 
      }
      else
      {
        insert_in_base(fiche_echantillonnage_capture,suppression,validation);
      }
    }
    
    function test_existance (item,suppression,validation) 
    {
           
        if (suppression!=1) 
        {
            var fiche = vm.allfiche_echantillonnage_capture.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(fiche[0])
                {
                   if((fiche[0].site_embarquement.id!=item.site_embarquement_id)
                    ||(fiche[0].enqueteur.id!=item.enqueteur_id)
                    ||(fiche[0].latitude!=item.latitude)
                    ||(fiche[0].longitude!=item.longitude)
                    ||(fiche[0].altitude!=item.altitude)
                    ||(fiche[0].date!=item.date)
                    ||(fiche[0].region.id!=item.region_id)
                    ||(fiche[0].district.id!=item.district_id))                    
                      {
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0;
                      }
                      else
                      {  
                         vm.affichageMasque = 0;
                      }
                }
        }
          else
              insert_in_base(item,suppression,validation);
    }

    function insert_in_base(fiche_echantillonnage_capture,suppression,validation)
    {
           
//add
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }};

        var getId      = 0;
        var userId     = vm.allutilisateur.id;
        var codeunique = '';
        if (NouvelItem==false) 
        {
          getId       = vm.selectedItem.id;
          userId      = vm.selectedItem.user.id;
          codeunique  = vm.selectedItem.code_unique;         
        } 
       
          var date = new Date(fiche_echantillonnage_capture.date);
          var date_fiche= convertionDate(date);

        var datas = $.param(
        {
          supprimer:            suppression,
          id:                   getId,
          date:                 date_fiche,
          code_unique:          codeunique,
          longitude:            fiche_echantillonnage_capture.longitude,
          latitude:             fiche_echantillonnage_capture.latitude,
          altitude:             fiche_echantillonnage_capture.altitude,
          validation:           fiche_echantillonnage_capture.validation,
          site_embarquement_id: fiche_echantillonnage_capture.site_embarquement_id,
          enqueteur_id:         fiche_echantillonnage_capture.enqueteur_id,
          district_id:          fiche_echantillonnage_capture.district_id,
          region_id:            fiche_echantillonnage_capture.region_id,
          user_id:              userId
                    
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
           // console.log(enqt[0]);
            var reg = vm.allregion.filter(function(obj)
            {
              return obj.id == vm.fiche_echantillonnage_capture.region_id;
            });

            var dist = vm.alldistrict.filter(function(obj)
            {
              return obj.id == vm.fiche_echantillonnage_capture.district_id;
            });
            
          /*  var utili= vm.allutilisateur.filter(function(obj)
            {
              return obj.id == userId;
            });*/
            
            if (NouvelItem == false) 
              {
                // Update or delete: id exclu
                //var current_date = new Date().toJSON("yyyy/MM/dd HH:mm");
                if(suppression==0) 
                  { // vm.selectedItem ={};                    
                    vm.selectedItem.code_unique       = codeunique;
                    vm.selectedItem.date              = date_fiche;
                    vm.selectedItem.date_creation     = vm.fiche_echantillonnage_capture.date_creation;
                    vm.selectedItem.date_modification = date_dujour;
                    vm.selectedItem.latitude          = vm.fiche_echantillonnage_capture.latitude;
                    vm.selectedItem.longitude         = vm.fiche_echantillonnage_capture.longitude;
                    vm.selectedItem.altitude          = vm.fiche_echantillonnage_capture.altitude;

                    vm.selectedItem.enqueteur          = enqt[0];
                    vm.selectedItem.site_embarquement  = site_emba[0];
                    vm.selectedItem.user          = vm.selectedItem.user;          
                    
                    vm.selectedItem.region        = reg[0];
                    vm.selectedItem.district      = dist[0];                              
                    vm.afficherboutonModifSupr = 0 ;
                    vm.afficherboutonModif     = 0 ;
                    vm.afficherboutonnouveau = 1 ;
                    vm.afficherboutonfiltre  = 1;
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
                var id=data.response.id;
                var code_unique=data.response.code_unique;

                var item = 
                {
                  code_unique:          code_unique,
                  date:                 date_fiche,
                  date_creation:        date_dujour,
                  date_modification:    date_dujour,
                  longitude:            fiche_echantillonnage_capture.longitude,
                  latitude:             fiche_echantillonnage_capture.latitude,
                  altitude:             fiche_echantillonnage_capture.altitude,
                  site_embarquement:    site_emba[0],
                  user:                 vm.allutilisateur, 
                  enqueteur:            enqt[0], 
                  district:             dist[0], 
                  region:               reg[0],
                  id:                   id
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
               // console.log(vm.allsite_embarquement);
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
        vm.afficherboutonfiltre         = 1;
        vm.afficherboutonModifSupr      =0;
        vm.afficherboutonModif          = 0 ;
        vm.afficherboutonnouveau        =0;
    }

    vm.recherchefiltrepardate= function (filtrepardate)
    {
        var date_debut= convertionDate(filtrepardate.date_debut);
        var date_fin= convertionDate(filtrepardate.date_fin);
        var validation = 0;
        apiFactory.getEchantillonnageByDate("fiche_echantillonnage_capture/index",date_debut,date_fin,validation).then(function(result)
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
      vm.recuperationPab = function(pab)
      {         
         if(pab){
              vm.echantillonfiltre = vm.allechantillon.filter(function(obj)
              {
                  return obj.data_collect.code == 'PAB';
              });
              vm.checkboxCAB=false;   
          }else
          { 
            vm.echantillonfiltre = vm.allechantillon.filter(function(obj)
              {
                  return obj.data_collect.code == 'CAB';
              });
            vm.checkboxCAB=true; 
          }
          vm.affichageMasqueEchantillon       = 0;
          vm.afficherboutonnouveauEchantillon =1;
          vm.afficherboutonModifEchantillon   =0;
          vm.afficherboutonModifSuprEchantillon=0;  
      }
      vm.recuperationCab = function(cab){
        if(cab)
        {
          vm.echantillonfiltre = vm.allechantillon.filter(function(obj)
                {
                    return obj.data_collect.code == 'CAB';
                });
          
          vm.checkboxPAB=false;
        }
        else
        { 
            vm.echantillonfiltre = vm.allechantillon.filter(function(obj)
            {
                return obj.data_collect.code == 'PAB';
            });
            vm.checkboxPAB=true; 
        }
        vm.affichageMasqueEchantillon       = 0;
        vm.afficherboutonnouveauEchantillon =1;
        vm.afficherboutonModifEchantillon   =0;
        vm.afficherboutonModifSuprEchantillon=0;
      }
      

    vm.selectionechantillon= function (item)
    {
        vm.selectedItemEchantillon  = item;
        vm.nouvelItemEchantillon    = item;
        currentItemEchantillon      = vm.selectedItemEchantillon;
        vm.afficherboutonModifSuprEchantillon   = 1 ;
        vm.afficherboutonModifEchantillon       = 1 ;
        vm.afficherboutonnouveauEspece_capture  = 1 ;
        vm.affichageMasqueEchantillon           = 0 ;
        
        //find espece_capture where id echantillon item.id  
        apiFactory.getFils("espece_capture/index",item.id).then(function(result)
        {
            vm.allespece_capture = result.data.response;            
        });
            vm.step2=true;
            vm.step3=false;
            vm.enableUnitepeche = false; 

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
        NouvelItemEchantillon = false ;
        vm.enableUnitepeche = true;
        vm.affichageMasqueEchantillon    = 1 ;
        vm.affichageMasque               = 0 ;
        vm.affichageMasqueEspece_capture = 0 ;
        
        vm.echantillon.id         = vm.selectedItemEchantillon.id ;       
        vm.echantillon.date       = vm.selectedItemEchantillon.date;
        vm.echantillon.latitude   = vm.selectedItemEchantillon.latitude;
        vm.echantillon.longitude  = vm.selectedItemEchantillon.longitude;
        vm.echantillon.altitude   = vm.selectedItemEchantillon.altitude;

        vm.echantillon.unite_peche_id   = vm.selectedItemEchantillon.unite_peche.id;
       // vm.echantillon.peche_hier       = parseInt(vm.selectedItemEchantillon.peche_hier) ;
       // vm.echantillon.peche_avant_hier = parseInt(vm.selectedItemEchantillon.peche_avant_hier) ; 
        vm.echantillon.total_capture    = vm.selectedItemEchantillon.total_capture;
        vm.echantillon.nbr_bateau_actif = parseInt(vm.selectedItemEchantillon.nbr_bateau_actif) ;
        vm.echantillon.total_bateau_ecn = parseInt(vm.selectedItemEchantillon.total_bateau_ecn) ;
        vm.echantillon.data_collect_id  = vm.selectedItemEchantillon.data_collect.id;
        
        if(vm.selectedItemEchantillon.peche_hier==1)
        {vm.echantillon.peche_hier=true;}
        else
        {vm.echantillon.peche_hier=false;}

        if(vm.selectedItemEchantillon.peche_avant_hier==1)
        {vm.echantillon.peche_avant_hier=true;}
        else
        {vm.echantillon.peche_avant_hier=false;}

        vm.echantillon.nbr_jrs_peche_dernier_sem = parseInt(vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem);          
        
        vm.afficherboutonModifSuprEchantillon = 0;
        vm.afficherboutonModifEchantillon = 1;
        vm.afficherboutonnouveauEchantillon = 0;  
        vm.prix = true;
    };

    vm.annulerEchantillon = function() 
    {   
        try
        {
          vm.selectedItemEchantillon            = {} ;        
          vm.affichageMasqueEchantillon         = 0 ;
          vm.afficherboutonnouveauEchantillon   = 1 ;
          vm.afficherboutonModifSuprEchantillon = 0 ;
          vm.afficherboutonModifEchantillon     = 0 ;
          NouvelItemEchantillon                 = false;
          vm.prix = false;
          vm.enableUnitepeche = false;
        }catch(e){}
        finally
        {
          vm.selectedItemEchantillon.$selected  = false;
        }
        
        
    };

    vm.ajouterEchantillon = function () 
    {         
        vm.selectedItemEchantillon.$selected = false;
        vm.enableUnitepeche = false;
        vm.prix   = false;
        vm.step2  = false;
        vm.step3  = false;
        vm.affichageMasqueEchantillon     = 1 ;
        vm.affichageMasque                = 0 ;
        vm.affichageMasqueEspece_capture  = 0 ;
        vm.echantillon={};
        NouvelItemEchantillon = true ;
        vm.afficherboutonnouveauEchantillon   = 1;
        vm.afficherboutonModifEchantillon     = 0;
        vm.afficherboutonModifSuprEchantillon =0;
        var effort_p=[];
        if(vm.checkboxPAB)
        {
          effort_p= vm.alldata_collect.filter(function(obj)
          {
                return obj.code == 'PAB';
          });
        }
        else
        {
          effort_p= vm.alldata_collect.filter(function(obj)
          {
                return obj.code == 'CAB';
          });
        }
        vm.echantillon.data_collect_id=effort_p[0].id;


      var nbrEchantillon = vm.allechantillon.length;
      if(nbrEchantillon)
      {
          var code=vm.allechantillon[nbrEchantillon-1].unique_code;
          var numcode=code.split(' ')[1];
          vm.num_dernier_code=numcode;
      }
      
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
           var nbr_echantion_recent=0;
            vm.allechantillon.forEach(function(item)
            { if(item.id>vm.selectedItemEchantillon.id)
              {
                nbr_echantion_recent=nbr_echantion_recent+1;
              }
                
            });
            if(nbr_echantion_recent==0)
            {
                ajoutEchantillon(vm.selectedItemEchantillon,1); 
            }
            else
            {
                $mdDialog.show(
                    $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title('Impossible de supprimer')
                      .textContent('Vous devrez suprimer l(es) echantillon(s) plus recent')
                      .ariaLabel('Offscreen Demo')
                      .parent(angular.element(document.body))
                      .ok('Fermer')
                      // Or you can specify the rect to do the transition from
                      .openFrom({
                        top: -50,
                        width: 30,
                        height: 80
                      })
                      .closeTo({
                        left: 1500
                      })
                  );
            }
          
        }, function()
        {
              //alert('rien');
        });
    };

  function ajoutEchantillon(echantillon,suppression)   
  {   
      if(echantillon.peche_hier)
      {
          echantillon.peche_hier=1;
      }
      else
      {
          echantillon.peche_hier=0;
      }

      if(echantillon.peche_avant_hier)
      {
          echantillon.peche_avant_hier=1;
      }
      else
      {
          echantillon.peche_avant_hier=0;
      }
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
          var echan = vm.allechantillon.filter(function(obj)
          {
              return obj.id == item.id;
          });
          if(echan[0])
          {
              if((echan[0].fiche_echantillonnage_capture_id!=item.fiche_echantillonnage_capture_id)
                ||(echan[0].peche_hier!=item.peche_hier)
                ||(echan[0].peche_avant_hier!=item.peche_avant_hier)
                ||(echan[0].nbr_jrs_peche_dernier_sem!=item.nbr_jrs_peche_dernier_sem)
                ||(echan[0].total_capture!=item.total_capture)
                ||(echan[0].data_collect.id!=item.data_collect_id)
                ||(echan[0].nbr_bateau_actif!=item.nbr_bateau_actif)
                ||(echan[0].total_bateau_ecn!=item.total_bateau_ecn)
                ||(echan[0].unite_peche.id!=item.unite_peche_id))                    
              {
                  insert_in_baseEchantillon(item,suppression);
                  vm.affichageMasqueEchantillon = 0 ;
              }
              else
              {  
                  vm.affichageMasqueEchantillon = 0 ;
              }
          }
        }
          else
            insert_in_baseEchantillon(item,suppression);
  }

  function insert_in_baseEchantillon(echantillon,suppression)
  {          
      //add
      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
      var getIdEchantillon  = 0;
      var total_captur      = 0;
      var userId            = vm.allutilisateur.id;
      var effort_p=[];
      var uniquecode        ='';     
      if (NouvelItemEchantillon==false) 
      {
          getIdEchantillon  = vm.selectedItemEchantillon.id;             
          userId            = vm.selectedItemEchantillon.user.id;
          uniquecode = vm.selectedItemEchantillon.unique_code;
      }
      else
      {
          echantillon.total_capture=total_captur;
      }
      
      if(suppression==1)
      {
        var effort_p= vm.alldata_collect.filter(function(obj)
        {
            return obj.id == echantillon.data_collect.id;
        });
      }
      else
      {
        var effort_p = vm.alldata_collect.filter(function(obj)
        {
            return obj.id == echantillon.data_collect_id;
        });
      }
      var datas = $.param(
      {   num_dernier_code:                 vm.num_dernier_code,
          supprimer:                        suppression,
          typeeffort:                       effort_p[0].code,      
          id:                               getIdEchantillon,
          fiche_echantillonnage_capture_id: vm.selectedItem.id,
          peche_hier:                       echantillon.peche_hier,
          peche_avant_hier:                 echantillon.peche_avant_hier,
          nbr_jrs_peche_dernier_sem:        echantillon.nbr_jrs_peche_dernier_sem,
          total_capture:                    echantillon.total_capture,
          unique_code:                      uniquecode,
          data_collect_id:                  echantillon.data_collect_id,
          nbr_bateau_actif:                 echantillon.nbr_bateau_actif,
          total_bateau_ecn:                 echantillon.total_bateau_ecn,
          unite_peche_id:                   echantillon.unite_peche_id,
          user_id:                          userId                
      });
           
      //factory
      apiFactory.add("echantillon/index",datas, config).success(function (data)
      {           
          var unite_p= vm.allunite_peche_site.filter(function(obj)
          {
              return obj.unite_peche.id == vm.echantillon.unite_peche_id;
          });
         /* var utili= vm.allutilisateur.filter(function(obj)
          {
              return obj.id == userId;
          });*/
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

                  vm.selectedItemEchantillon.total_capture              = vm.echantillon.total_capture;
                  vm.selectedItemEchantillon.unique_code                = uniquecode;
                      
                  vm.selectedItemEchantillon.data_collect  = effort_p[0];

                  vm.selectedItemEchantillon.unite_peche  = unite_p[0].unite_peche;
                      
                  vm.selectedItemEchantillon.user  = vm.selectedItemEchantillon.user;
                      
                  vm.selectedItemEchantillon.date_creation = vm.echantillon.date_creation;
                  vm.selectedItemEchantillon.date_modification = date_dujour;
                      
                  vm.afficherboutonModifSuprEchantillon = 0 ;
                  vm.afficherboutonModifEchantillon     = 0 ;
                  vm.afficherboutonnouveauEchantillon   = 1 ;
                  vm.selectedItemEchantillon.$selected  = false;
                  // console.log(vm.selectedItemEchantillon);
                  vm.selectedItemEchantillon            = {};
              } 
              else 
              {    
                  vm.allechantillon = vm.allechantillon.filter(function(obj)
                  {
                      return obj.id !== currentItemEchantillon.id;
                  });
                  vm.echantillonfiltre = vm.echantillonfiltre.filter(function(obj)
                  {
                      return obj.id !== currentItemEchantillon.id;
                  });

              }

          }
          else
          {   var id=data.response.id;
              var unique_code=data.response.unique_code;
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
                  unique_code:                      unique_code,
                  data_collect:                     effort_p[0],
                  nbr_bateau_actif:                 echantillon.nbr_bateau_actif,
                  total_bateau_ecn:                 echantillon.total_bateau_ecn,
                  unite_peche:                      unite_p[0].unite_peche,
                  user:                             vm.allutilisateur,
                  date_creation:                    date_dujour,
                  date_modification:                date_dujour,
                  id:                               id 
              };
               vm.allechantillon.push(item);
               vm.echantillonfiltre.push(item);
               vm.echantillon  ={};                  
               NouvelItemEchantillon=false;
          }
          vm.affichageMasqueEchantillon = 0 ;
          vm.num_dernier_code=0;
      }).error(function (data)
          {
              alert('Error');
          });
                
  }

 /* function DialogController($mdDialog, $scope)
  { 
      var dg=$scope;

      apiFactory.getAll("data_collect/index").then(function(result)
       {dg.alldata_collect = result.data.response;});

      dg.cancel = function()
      {$mdDialog.cancel();};

      dg.dialognouveauajout = function(typeajout)
      {   //console.log(typeajout);
          var effort_p= dg.alldata_collect.filter(function(obj)
          {
                return obj.id == dg.echantillon.data_collect_id;
          });

        if(effort_p[0].code=='PAB')
        {   
            vm.pab=true;
            
        }
        else
        {
            vm.pab=false;
        }
        vm.selectedItemEchantillon.$selected = false;
        vm.step2=false;
        vm.step3=false;
        vm.affichageMasqueEchantillon = 1 ;
        vm.affichageMasque = 0 ;
        vm.affichageMasqueEspece_capture = 0 ;
        vm.echantillon={};
        NouvelItemEchantillon = true ;
        $mdDialog.cancel();
        vm.input_data_collect = false;
        vm.echantillon.data_collect_id=dg.echantillon.data_collect_id;
      }


}*/
    vm.modifierunite_peche = function(unite_peche)
      { var year = vm.date_now.getFullYear();
       // console.log(year);
       var unite_peche_recent = 0;
       
       if (vm.selectedItemEchantillon.$selected)
       {
          unite_peche_recent= vm.selectedItemEchantillon.unite_peche.id;
       }

       // console.log(unite_peche_recent);
       // console.log(unite_peche.unite_peche_id);
        if (unite_peche_recent!=unite_peche.unite_peche_id)
        {
            apiFactory.getAPIgeneraliserREST("unite_peche_site/index","menus","nbr_echantillon",
          "id_unite_peche",unite_peche.unite_peche_id,"id_site_embarquement",
          vm.selectedItem.site_embarquement.id,"annee",year,"id_enqueteur",vm.selectedItem.enqueteur.id).then(function(result)
          {
            var nbr_predefini = parseInt(result.data.response.nbr_echantillon_predefini);
            var nbr_actuel = parseInt(result.data.response.nbr_echantillon_actuel);

            var nbr_enqueteur_predefini = parseInt(result.data.response.nbr_echantillon_enqueteur_predefini);
            var nbr_enqueteur_actuel = parseInt(result.data.response.nbr_echantillon_enqueteur_actuel);

              
              if (nbr_predefini==0 || nbr_enqueteur_predefini==0) 
              { 
                  vm.enableUnitepeche = false;                  
                  var msg = 'Le nombre de cet unite de pêche n\'est pas definie';
                  vm.dialog(msg);
              }
              else if (nbr_actuel>=nbr_predefini || nbr_enqueteur_actuel>=nbr_enqueteur_predefini)
              {
                  vm.enableUnitepeche = false;
                  var msg = 'Nombre maximal atteint pour cet unité de peche'
                  vm.dialog(msg);
              }
              else
              {                  
                  vm.enableUnitepeche = true;
              }
              /*
              console.log(nbr_actuel);
              console.log(nbr_enqueteur_predefini);
              console.log(nbr_enqueteur_actuel);
              console.log(vm.enableUnitepeche);*/

          });
        }
        else
        {
          vm.enableUnitepeche = true;
          console.log(vm.selectedItemEchantillon);
        }

        
      }

      vm.dialog = function(msg)
      {
        $mdDialog.show(
                    $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title('Selection impossible')
                      .textContent(msg)
                      .ariaLabel('Offscreen Demo')
                      .parent(angular.element(document.body))
                      .ok('Fermer')
                      // Or you can specify the rect to do the transition from
                      .openFrom({
                        top: -50,
                        width: 30,
                        height: 80
                      })
                      .closeTo({
                        left: 1500
                      })
                  );
      }

/******************************************** Fin echantillon  ******************************************************/

/******************************************** Debut espece  ******************************************************/
  vm.selectionEspece_capture= function (item)
  {        
      vm.selectedItemEspece_capture = item;
      vm.nouvelItemEspece_capture   = item;
      currentItemEspece_capture     = vm.selectedItemEspece_capture;
      vm.afficherboutonModifSuprEspece_capture  = 1 ;
      vm.afficherboutonModifEspece_capture      = 1;
      vm.affichageMasqueEspece_capture          = 0 ; 
      vm.step3 = true;
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

  vm.modifierEspece_capture = function()
  {
      NouvelItemEspece_capture                 = false ;
      vm.affichageMasqueEspece_capture         = 1 ;
      vm.affichageMasqueEchantillon            = 0 ;
      vm.affichageMasque                       = 0 ;
      vm.espece_capture.id                     = vm.selectedItemEspece_capture.id ;
      vm.espece_capture.espece_id              = vm.selectedItemEspece_capture.espece.id ;
      vm.espece_capture.capture                = parseFloat(vm.selectedItemEspece_capture.capture);
      vm.espece_capture.prix                   = parseInt(vm.selectedItemEspece_capture.prix);
  //    vm.espece_capture.id_user                =vm.selectedItemEspece_capture.user.id;
      vm.espece_capture.date_creation          = vm.selectedItemEspece_capture.date_creation;
      vm.afficherboutonModifSuprEspece_capture = 0;
      vm.afficherboutonModifEspece_capture     = 1;
      vm.afficherboutonnouveauEspece_capture   = 0;
      vm.prix=true;
  };
  
  vm.annulerEspece_capture = function()
  {
      vm.selectedItemEspece_capture             = {} ;
      vm.selectedItemEspece_capture.$selected   = false;
      vm.affichageMasqueEspece_capture          = 0 ;
      vm.afficherboutonnouveauEspece_capture    = 1 ;
      vm.afficherboutonModifSuprEspece_capture  = 0 ;
      vm.afficherboutonModifEspece_capture      = 0;          
      NouvelItemEspece_capture                  = false;
  };

  vm.ajouterEspece_capture = function ()
  {
      vm.selectedItemEspece_capture.$selected = false;
      vm.prix   = false;
      vm.step3  = false;
      vm.affichageMasqueEspece_capture  = 1 ;
      vm.affichageMasque                = 0 ;
      vm.affichageMasqueEchantillon     = 0 ;
      vm.espece_capture                 = {} ;
      NouvelItemEspece_capture           = true ;
      vm.afficherboutonModifEspece_capture      = 0;
      vm.afficherboutonModifSuprEspece_capture  = 0;
      vm.afficherboutonnouveauEspece_capture    = 1;
  };

  vm.supprimerEspece_capture = function()
  {
      vm.affichageMasqueEspece_capture          = 0 ;
      vm.afficherboutonModifSuprEspece_capture  = 0 ;
      vm.afficherboutonModifEspece_capture      = 0;
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
        var userId              = vm.allutilisateur.id;
        if (NouvelItemEspece_capture == false) 
        {
            getIdEspece_capture = vm.selectedItemEspece_capture.id;
            userId              = vm.selectedItemEspece_capture.user.id;                
        }

        var datas = $.param(
        {
            supprimer:                         suppression,
            id:                                getIdEspece_capture,
            espece_id:                         espece_capture.espece_id,
            fiche_echantillonnage_capture_id:  vm.selectedItem.id,
            echantillon_id:                    vm.selectedItemEchantillon.id,
            capture:                           espece_capture.capture,
            prix:                              espece_capture.prix,
            user_id:                           userId                  
        });
          
      //factory
        apiFactory.add("espece_capture/index",datas, config).success(function (data)
        {
            var espece= vm.allespece.filter(function(obj)
            {
                return obj.id == vm.espece_capture.espece_id;
            });
            
            /*var utili= vm.allutilisateur.filter(function(obj)
            {
                return obj.id == userId;
            });*/
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
                              
                    vm.selectedItemEspece_capture.user                = vm.selectedItemEspece_capture.user;
                              
                    vm.selectedItemEspece_capture.date_creation       = vm.espece_capture.date_creation;
                    vm.selectedItemEspece_capture.date_modification   = date_dujour;
                              
                    vm.afficherboutonModifSuprEspece_capture          = 0 ;
                    vm.afficherboutonnouveauEspece_capture            = 1 ;
                    vm.selectedItemEspece_capture.$selected           = false;                   
                           
                    var tot_cap1=parseFloat(vm.selectedItemEchantillon.total_capture)- parseFloat(total_capture_selected) ;
                    var tot_cap=parseFloat(tot_cap1)+parseFloat(vm.espece_capture.capture);
                 
                    majtotal_captureEchantillon(tot_cap,config);
                    vm.selectedItemEspece_capture ={};
                } 
                else 
                {    
                  vm.allespece_capture = vm.allespece_capture.filter(function(obj)              
                  {
                    return obj.id !== currentItemEspece_capture.id;
                  });
                  var tot_cap=parseFloat(vm.selectedItemEchantillon.total_capture)- parseFloat(currentItemEspece_capture.capture) ;                 
                  console.log(tot_cap)
                  majtotal_captureEchantillon(tot_cap,config);
                }
            }
            else
            {                
                var item =
                {
                  espece:            espece[0],
                  capture:           espece_capture.capture,
                  prix:              espece_capture.prix,                        
                  user:              vm.allutilisateur,
                  date_creation:     date_dujour,
                  date_modification: date_dujour,
                  id:                String(data.response) 
                };
                
                vm.allespece_capture.push(item);                          
                var tot_cap=parseFloat(vm.selectedItemEchantillon.total_capture)+ parseFloat(espece_capture.capture);
                majtotal_captureEchantillon(tot_cap,config);
                vm.espece_capture={};                         
                NouvelItemEspece_capture=false;
            }
            vm.affichageMasqueEspece_capture = 0 ;
            vm.prix = false;
        }).error(function (data)
          {
            alert('Error');
          });
                
    }


//Mise à jour echantillon (total-capture) lors nouvelle insertion espece_capture      
    function majtotal_captureEchantillon(tot_cap,config)
    { 
        var typeeffort='';
        if(vm.selectedItemEchantillon.data_collect.code=='PAB')
        {
            typeeffort='PAB';
        }
        else
        {
            typeeffort='CAB';
        }
        
        var datasmaj = $.param(
        {
            supprimer:                        0,
            typeeffort:                       typeeffort,
            id:                               vm.selectedItemEchantillon.id,
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
            user_id:                          vm.selectedItemEchantillon.user.id                        
        });
        
//factory
        apiFactory.add("echantillon/index",datasmaj, config).success(function (data)
        {
            // Update or delete: id exclu                                    
            vm.selectedItemEchantillon.fiche_echantillonnage_capture_id = vm.selectedItem.id;

            vm.selectedItemEchantillon.peche_hier                 = vm.selectedItemEchantillon.peche_hier;
            vm.selectedItemEchantillon.peche_avant_hier           = vm.selectedItemEchantillon.peche_avant_hier;
            vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem  = vm.selectedItemEchantillon.nbr_jrs_peche_dernier_sem; 
            vm.selectedItemEchantillon.total_capture              = tot_cap;
            vm.selectedItemEchantillon.unique_code                = vm.selectedItemEchantillon.unique_code;
                          
            vm.selectedItemEchantillon.data_collect.id            = vm.selectedItemEchantillon.data_collect.id;
                          
            vm.selectedItemEchantillon.nbr_bateau_actif           = vm.selectedItemEchantillon.nbr_bateau_actif;
            vm.selectedItemEchantillon.total_bateau_ecn           = vm.selectedItemEchantillon.total_bateau_ecn;
                          
            vm.selectedItemEchantillon.user_id                    = vm.selectedItemEchantillon.user.id;
                          
            vm.selectedItemEchantillon.date_creation              = vm.selectedItemEchantillon.date_creation;
            vm.selectedItemEchantillon.date_modification          = date_dujour;
          
        }).error(function (data)
            {
              alert('Error');
            });          
    }

    function test_existanceEspece_capture (item,suppression) 
    {
        if (suppression!=1) 
        {
          var esp = vm.allespece_capture.filter(function(obj)
          {
              return obj.id == item.id;
          });
          if(esp[0])
          {
              if((esp[0].espece.id!=item.espece_id)
                    ||(esp[0].capture!=item.capture)
                    ||(esp[0].prix!=item.prix))                   
              {
                  insert_in_baseEspece_capture(item,suppression);
                  vm.affichageMasqueEspece_capture = 0 ;
              }
              else
              {  
                  vm.affichageMasqueEspece_capture = 1 ;
              }
          }
        }
        else
            insert_in_baseEspece_capture(item,suppression);
    }      

    $scope.removeBoutonEspece_capture = function()
    {
        vm.afficherboutonModifSuprEspece_capture = 0 ;
    }

    //format date affichage sur datatable

        vm.formatDateListe = function (dat)
        {
          if (dat) 
          {
            var date  = new Date(dat);
            var mois  = date.getMonth()+1;
            var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
            return dates;
          }            

        }

      function convertionDate(date)
      {   
        if(date)
          {
              var d     = new Date(date);
              var jour  = d.getDate();
              var mois  = d.getMonth()+1;
              var annee = d.getFullYear();
              if(mois <10)
              {
                  mois = '0' + mois;
              }
              var date_final= annee+"-"+mois+"-"+jour;
              return date_final
          }      
      }
      vm.modif_capture = function()
      {
        vm.prix = true;
      }

    }
})();
