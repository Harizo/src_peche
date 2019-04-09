(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.analyse_parametrable')
        .controller('Analyse_parametrableController', Analyse_parametrableController);

    /** @ngInject */
    function Analyse_parametrableController($mdDialog, $scope, apiFactory, $state)
    {
      var vm = this;
      
      vm.filtre = {} ;
      vm.now_date = new Date();
      vm.annee = vm.now_date.getFullYear();
      vm.filtre.date_fin = vm.now_date ;
      vm.annees = [] ;
      vm.datas = [] ;
      vm.affiche_load = false ;
      for (var i = 2012; i <= vm.annee; i++) {
        vm.annees.push(i);
      }
      vm.filtre.annee = vm.annee ;

      //style
     vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

      vm.pivots = [
        {titre:"Région",id:"id_region"},
        {titre:"Unité de pêche",id:"id_unite_peche"},
        {titre:"Site de débarquement",id:"id_site_embarquement"},
        {titre:"Région et Unité de pêche",id:"id_region_and_id_unite_peche"},
        {titre:"Site de débarquement et Unité de pêche",id:"id_site_embarquement_and_id_unite_peche"},
      ];

      apiFactory.getAll("region/index").then(function(result)
      {
          vm.allregion= result.data.response;
      });

      apiFactory.getAll("district/index").then(function(result)
      {
          vm.alldistrict = result.data.response;
          vm.districts = vm.alldistrict ;
      });

      apiFactory.getAll("site_embarquement/index").then(function(result)
      {
          vm.allsite= result.data.response;
          vm.sites= result.data.response;
      });

      apiFactory.getAll("unite_peche/index").then(function(result)
      {
          vm.allunite_peche= result.data.response;
          vm.unite_peches= result.data.response;
      });

      vm.filtre_district = function()
      {
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

      vm.analysefiltrer = function(filtres)
      {
        vm.affiche_load = true ;
          apiFactory.getAPIgeneraliserREST("analyse_parametrable/index","menu","analyse_parametrable","annee",filtres.annee,
            "id_unite_peche",filtres.id_unite_peche,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement,"pivot",filtres.pivot).then(function(result)
          {
            vm.affiche_load = false ;
            vm.datas = result.data.response;
            vm.totals = result.data.total;
            var data = result.data.response;
            console.log(data);
          });        
      }

      vm.convertion_kg_tonne = function(val)
      {
        if (val > 1000) 
        {
          return (val/1000)+" t" ;
        }
        else
        {
          return val+" Kg"
        }
      }

      vm.formatMillier = function (nombre) 
      {
          if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
              nombre += '';
              var sep = ' ';
              var reg = /(\d+)(\d{3})/;
              while (reg.test(nombre)) {
                  nombre = nombre.replace(reg, '$1' + sep + '$2');
              }
              return nombre;
          } else {
              return "";
          }
      }

      vm.cacher_table = function(mot_a_cherecher,string)
      {
          if (!string) 
          {
            string = "id_region" ;
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
    }

})();