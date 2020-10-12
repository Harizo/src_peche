(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.region', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_localisation_region', {
            url      : '/donnees-de-base/localisation/region',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/localisation/region/region.html',
                    controller : 'RegionController as vm'
                }
            },
            bodyClass: 'region',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Région"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.localisation.region', {
            title: 'Région',
            icon  : 'icon-map-marker-circle',
            state: 'app.population_ddb_localisation_region',
			weight: 1
        });
    }

})();
