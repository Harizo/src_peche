(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.district', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_localisation_district', {
            url      : '/donnees-de-base/localisation/district',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/localisation/district/district.html',
                    controller : 'DistrictController as vm'
                }
            },
            bodyClass: 'district',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "District"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.localisation.district', {
            title: 'District',
            icon  : 'icon-map-marker-radius',
            state: 'app.population_ddb_localisation_district',
			weight: 2
        });
    }

})();
