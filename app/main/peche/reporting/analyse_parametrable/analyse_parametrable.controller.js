(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.analyse_parametrable')
        .controller('Analyse_parametrableController', Analyse_parametrableController);

    /** @ngInject */
    function Analyse_parametrableController($cookieStore,$mdDialog, $scope, apiFactory, $state, apiUrlserver, apiUrlexcel)
    {
      var vm          = this;
      vm.apiUrlimage  = apiUrlserver;
      vm.filtre       = {} ;
      vm.now_date     = new Date();
      vm.annee        = vm.now_date.getFullYear();
      vm.filtre.date_fin  = vm.now_date ;
      vm.annees           = [] ;
      vm.datas            = [] ;
      vm.affiche_load     = false ;
      vm.req3_6           =false;
      for (var i = 2012; i <= vm.annee; i++) {
        vm.annees.push(i);
        
      }
      vm.filtre.annee = vm.annee ;

      vm.isADMIN = false;

      //style
     vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple'
      };

        // natambatra @L2.3{titre:"L2.4 Mois Région Unité de pêche",id:"mois_and_id_unite_peche_and_id_region"},
      vm.pivots = [
        {titre:"L1.2 Région(= Strate Mineur)",id:"id_region"},
        {titre:"L1.4 Région et Unité de pêche",id:"id_region_and_id_unite_peche"},
        {titre:"L1.3&L1.6 Unité de pêche",id:"id_unite_peche"},
        {titre:"L1.5 Site de débarquement et Unité de pêche",id:"id_site_embarquement_and_id_unite_peche"},
        {titre:"L2.1&L2.2 Mois Strate majeur",id:"mois_strate_majeur"},
        {titre:"L2.3&L2.4 Mois Unité de pêche",id:"mois_and_id_unite_peche"},
        {titre:"L2.5 Mois Site Unité de pêche",id:"mois_and_id_unite_peche_and_id_site_embarquement"},
        {titre:"L3.1&L3.2 Espèce",id:"id_espece"},
        {titre:"L3.3&L3.4 Unité de pêche et Espèce",id:"id_unite_peche_and_id_espece"},
        {titre:"L3.5 Site,Unité de pêche et Espèce",id:"id_site_embarquement_id_unite_peche_and_id_espece"},
        {titre:"L3.6 Unité de pêche,Espèce et Effort",id:"id_unite_peche_and_id_espece_and_cpue_effort"},
        {titre:"L4.1&L4.2 Mois Espèce",id:"mois_and_id_espece"},
        {titre:"L4.3&L4.4 Mois,Unité de pêche et Espèce",id:"mois_id_unite_peche_and_id_espece"},
        {titre:"L4.5 Mois,Site,Unité de pêche et Espèce",id:"mois_id_site_embarquement_id_unite_peche_and_id_espece"},
        //{titre:"Essai",id:"essai"}        
        
      ];

      apiFactory.getAll("region/index").then(function(result)
      {
          vm.allregion= result.data.response;
      });

      apiFactory.getAll("district/index").then(function(result)
      {
          vm.alldistrict  = result.data.response;
          vm.districts    = vm.alldistrict ;;
      });

      apiFactory.getAll("site_embarquement/index").then(function(result)
      {
          vm.allsite  = result.data.response;
          vm.sites    = result.data.response;
      });

      apiFactory.getAll("unite_peche/index").then(function(result)
      {
          vm.allunite_peche = result.data.response;
          vm.unite_peches   = result.data.response;
      });

      apiFactory.getAll("espece/index").then(function(result)
      {
          vm.allespece = result.data.response;
          
      });

      apiFactory.getOne("utilisateurs/index", $cookieStore.get('id')).then(function(result) 
      {
          var utilisateur = result.data.response;
          vm.filtre.id_region = result.data.response.id_region;
          if(utilisateur.roles.indexOf("ADMIN")!= -1)
          {
            vm.isADMIN = true;          
          }           
          
      });
      

      

      vm.filtre_district = function()
      {
          vm.filtre.id_district           ="*";
          vm.filtre.id_site_embarquement  ="*";
          var ds = vm.alldistrict ;
          if (vm.filtre.id_region != "*") 
          {
            vm.districts = ds.filter(function(obj)
            {
                return obj.region.id == vm.filtre.id_region;
            });
          }
          else
          {
            vm.districts = vm.alldistrict ;
          }          
      }

      vm.filtre_site = function()
      {
          var s = vm.allsite ;
          if (vm.filtre.id_district != "*") 
          {
            vm.sites = s.filter(function(obj)
            {
                if (obj.district) 
                {                
                    return obj.district.id == vm.filtre.id_district;
                }               
                
            });
          }
          else
          {
            vm.sites = vm.allsite ;
          }
      }

      vm.filtre_up = function()
      {
        vm.unite_peches = [];
        
        if (vm.filtre.id_site_embarquement != "*") 
        {
          apiFactory.getAPIgeneraliserREST("unite_peche_site/index","cle_etrangere",vm.filtre.id_site_embarquement).then(function(result)
          {
              vm.allunite_peche_site = result.data.response;
              vm.unite_peches = result.data.response;
             
          });
        }
        else 
        {
          vm.unite_peches = vm.allunite_peche ;
        }
          
      }

      vm.analysefiltrer = function(filtres)
      {
        vm.affiche_load = true ;
          apiFactory.getAPIgeneraliserREST("analyse_parametrable/index","menu","analyse_parametrable","annee",filtres.annee,
            "id_unite_peche",filtres.id_unite_peche,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement,
            "id_espece",filtres.id_espece,"pivot",filtres.pivot).then(function(result)
          {
            vm.affiche_load = false ;
            vm.datas  = result.data.response;
            vm.totals = result.data.total;
            var data  = result.data.response;
            if(filtres.pivot=='id_unite_peche_and_id_espece_and_cpue_effort')
            {
              vm.req3_6 = true;
            }
            console.log(vm.datas);
            console.log(vm.totals);
          });        
      }

      vm.exportExcel = function(filtres)
      {
        vm.affiche_load = true ;
        var repertoire = 'analyse_parametrable';
            apiFactory.getAPIgeneraliserREST("analyse_parametrable/index","menu","analyse_parametrable",
            "menu_excel","excel_analyse_parametrable","annee",filtres.annee,
            "id_unite_peche",filtres.id_unite_peche,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement,
            "id_espece",filtres.id_espece,"pivot",filtres.pivot,"repertoire",repertoire).then(function(result)
          {
            
            vm.status    = result.data.status; 
          
            if(vm.status)
            {
                vm.nom_file = result.data.nom_file;            
                window.location = apiUrlexcel+"analyse_parametrable/"+vm.nom_file ;
                vm.affiche_load =false; 

            }else{
                vm.message=result.data.message;
                vm.Alert('Export en excel',vm.message);
                vm.affiche_load =false; 
            }
          });        
      }

      vm.convertion_kg_tonne = function(val)
      { 
        if (val > 1000) 
        {
          var res = val/1000 ;
          var nbr=parseFloat(res).toFixed(3);
          var res_virg = vm.replace_point(nbr) ;

          return res_virg+" t" ;
        }
        else
        { var nbr=parseFloat(val).toFixed(3);
          var res_virg = vm.replace_point(nbr) ;

          return res_virg+" Kg" ;
        }
      }

      vm.convertion_point_virgule = function(val)
      {
        if (val) 
        { var nbr=parseFloat(val).toFixed(3);
          var res_virg = vm.replace_point(nbr) ;

          return res_virg ;
        }
      }

      vm.formatMillier = function (nombre) 
      {   //var nbr = nombre.toFixed(0);
        var nbr=parseFloat(nombre).toFixed(0);
          if (typeof nbr != 'undefined' && parseInt(nbr) >= 0) {
              nbr += '';
              var sep = ' ';
              var reg = /(\d+)(\d{3})/;
              while (reg.test(nbr)) {
                  nbr = nbr.replace(reg, '$1' + sep + '$2');
              }
              return nbr;
          } else {
              return "";
          }
      }

      vm.cacher_table = function(mot_a_cherecher,string)
      {
          if (!string) 
          {
            string = "" ;
          }
          var res = string.indexOf(mot_a_cherecher);
          if (res != -1) 
          {
            return true ;
          }
          else
          {
            return false ;
          }
      }

      vm.replace_point = function(nbr)
      {
        var str = ""+nbr ;
        var res = str.replace(".",",") ;
        return res ;
      }

      vm.Alert = function(titre,content)
      {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(false)
          .parent(angular.element(document.body))
          .title(titre)
          .textContent(content)
          .ariaLabel('Alert')
          .ok('Fermer')
          .targetEvent()
        );
      }
    }

})();
