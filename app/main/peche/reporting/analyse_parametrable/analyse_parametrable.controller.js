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
          apiFactory.getAPIgeneraliserREST("analyse_parametrable/index","menu","analyse_parametrable","annee",filtres.annee,
            "id_unite_peche",filtres.id_unite_peche,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement).then(function(result)
          {
            vm.datas = result.data.response;
            console.log(vm.datas);
          });        
      }
    }

})();
