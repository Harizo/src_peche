(function ()
{
    'use strict';

    angular
        .module('app.peche.validation_fiche_echantillonnage_capture')
        .controller('Valide_fiche_echantillonnage_captureController', Valide_fiche_echantillonnage_captureController);

    /** @ngInject */
    function Valide_fiche_echantillonnage_captureController($mdDialog, $scope, $location, apiFactory, $cookieStore,cookieService)
    {
      var vm                                 = this;      
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
      vm.afficherboutonfiltre               = 1;
      vm.step1                               = false;
      vm.step2                               = false;
      vm.step3                               = false;

      vm.id_region_user = 0;
      vm.isADMIN = false;
      
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

/*********** ************************Debut fi fiche_echantillonnage_capture  *******************************************/
     
      var date_today            = new Date();
      vm.filtrepardate          = {} ;
      vm.filtrepardate.date_fin = date_today ;
      vm.max_date               = date_today ;
      var date_dujour           = convertionDate(date_today);
      var validation            = 1;
      apiFactory.getOne("utilisateurs/index", $cookieStore.get('id')).then(function(result) 
      {
          var utilisateur = result.data.response;
          vm.id_region_user = result.data.response.id_region;
          if(utilisateur.roles.indexOf("ADMIN")!= -1)
          {
            vm.isADMIN = true;
            apiFactory.getEchantillonnageByDate("fiche_echantillonnage_capture/index",date_dujour,date_dujour,validation,'*').then(function(result)
            {
              vm.allfiche_echantillonnage_capture = result.data.response;
              console.log(vm.allfiche_echantillonnage_capture);
            });
          }else
          {          
            apiFactory.getEchantillonnageByDate("fiche_echantillonnage_capture/index",date_dujour,date_dujour,validation,vm.id_region_user).then(function(result)
            {
              vm.allfiche_echantillonnage_capture = result.data.response;
            });
          }           
          
      });

      vm.affichage_bool = function(int)
      {
        console.log(int);
        switch (int) {
          case "1":
            return "Oui" ;
            break;
          case "0":
            return "Non" ;
            break;
          default:
            
            break;
        }
      }

          //selection sur la liste
      vm.selection= function (item)
      {        
          vm.selectedItem = item;
          if(currentItem != vm.selectedItem)
          {
            vm.step1 = false;
            vm.step2 = false;
            vm.step3 = false;
          }
          currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
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
          apiFactory.getFils("unite_peche_site/index",item.site_embarquement.id).then(function(result)
          {
              vm.allunite_peche_site = result.data.response;
              
          });
          vm.checkboxPAB = true;
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

    vm.formfiltrepardate = function()
    {
        vm.affichageMasqueFiltrepardate = 1 ;
        
    }
   
    vm.recherchefiltrepardate= function (filtrepardate)
    {
        var date_debut = convertionDate(filtrepardate.date_debut);
        var date_fin   = convertionDate(filtrepardate.date_fin);
        var validation = 1;
        if (vm.isADMIN)
        {
          apiFactory.getEchantillonnageByDate("fiche_echantillonnage_capture/index",date_debut,date_fin,validation,'*').then(function(result)
          {
              vm.allfiche_echantillonnage_capture  = result.data.response;
              vm.affichageMasqueFiltrepardate = 0 ;
              vm.afficherboutonnouveau        = 1;
          });
        }else
        {
          apiFactory.getEchantillonnageByDate("fiche_echantillonnage_capture/index",date_debut,date_fin,validation,vm.id_region_user).then(function(result)
          {
              vm.allfiche_echantillonnage_capture  = result.data.response;
              vm.affichageMasqueFiltrepardate = 0 ;
              vm.afficherboutonnouveau        = 1;
          });
        }
    }

    $scope.removeBouton = function()
    {
        vm.afficherboutonModifSuprEchantillon = 0 ;
    }

    function convertionDate(date)
    {   if(date)
        {
            var d     = new Date(date);
            var jour  = d.getDate();
            var mois  = d.getMonth()+1;
            var annee = d.getFullYear();
            if(mois <10)
            {
                mois = '0' + mois;
            }
            var date_final = annee+"-"+mois+"-"+jour;
            return date_final
        }      
    }
    vm.annuler = function() 
      { 
          vm.afficherboutonfiltre    = 1;
          vm.affichageMasqueFiltrepardate = 0 ;
      };

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
            vm.checkboxCAB = true; 
          }
          vm.affichageMasqueEchantillon = 0;  
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
        vm.affichageMasqueEchantillon = 0;
      }

    vm.selectionechantillon= function (item)
    {
        vm.selectedItemEchantillon = item;
        currentItemEchantillon = JSON.parse(JSON.stringify(vm.selectedItemEchantillon));
        
          
        apiFactory.getFils("espece_capture/index",item.id).then(function(result)
        {
            vm.allespece_capture = result.data.response;            
        });
            vm.step2 = true;
            vm.step3 = false;         
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

/******************************************** Fin echantillon  ******************************************************/

/******************************************** Debut espece  ******************************************************/
  vm.selectionEspece_capture= function (item)
  {        
      vm.selectedItemEspece_capture = item;
      currentItemEspece_capture = JSON.parse(JSON.stringify(vm.selectedItemEspece_capture));    
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

    }
})();
