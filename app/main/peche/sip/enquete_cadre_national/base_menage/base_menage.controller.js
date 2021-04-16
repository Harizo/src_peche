(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.enquete_cadre_nationale.base_menage')
        .controller('base_menageController', base_menageController)      

    /** @ngInject */
    function base_menageController($mdDialog, $scope, apiFactory, $state)  
    {
    	var vm = this ;

    	vm.filtre = {};

    	vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			retrieve:'true',
			order:[] 
		};
		vm.affiche_load = true ;

		apiFactory.getParamsDynamic("SIP_base_menage/index?type_get=get_all_region").then(function(result)
		{
			vm.affiche_load = false ;
			vm.all_region = result.data.response;
		});

		vm.get_district_by_region = function()
		{
			vm.affiche_load = true ;
			apiFactory.getParamsDynamic("SIP_base_menage/index?type_get=get_all_district_by_region&region="+vm.filtre.region).then(function(result)
			{
				vm.filtre.district = null;
				vm.filtre.commune = null;

				vm.affiche_load = false ;
				vm.all_district = result.data.response;
			});
		}

		vm.get_all_commune_by_district = function()
		{
			vm.affiche_load = true ;
			apiFactory.getParamsDynamic("SIP_base_menage/index?type_get=get_all_commune_by_district&district="+vm.filtre.district).then(function(result)
			{
				
				vm.filtre.commune = null;
				
				vm.affiche_load = false ;
				vm.all_commune = result.data.response;
			});
		}

		vm.get_reporting_halieutique = function()
		{
			vm.affiche_load = true ;
			apiFactory.getParamsDynamic("SIP_base_menage/index?type_get=get_all&region="+vm.filtre.region+
				"&district="+vm.filtre.district+"&commune="+vm.filtre.commune).then(function(result)
			{
					vm.affiche_load = false ;
					vm.reporting_halieutique = result.data.response;
					
						
					vm.entete_etat = Object.keys(vm.reporting_halieutique[0]).map(function(cle) {
						
							return (cle);	
						
					});
				
			});
		}
    }

})();