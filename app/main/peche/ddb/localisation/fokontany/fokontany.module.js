(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.fokontany', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_localisation_fokontany', {
            url      : '/donnees-de-base/localisation/fokontany',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/localisation/fokontany/fokontany.html',
                    controller : 'FokontanyController as vm'
                }
            },
            bodyClass: 'fokontany',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fokontany"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.ddb.localisation.fokontany', {
            title: 'Fokontany',
            icon  : 'icon-tile-four',
            state: 'app.population_ddb_localisation_fokontany',
			weight: 4
        });
    }
})();
