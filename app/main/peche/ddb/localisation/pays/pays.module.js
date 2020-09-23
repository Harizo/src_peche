(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.pays', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_localisation_pays', {
            url      : '/donnees-de-base/localisation/pays',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/localisation/pays/pays.html',
                    controller : 'PaysController as vm'
                }
            },
            bodyClass: 'pays',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Pays"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.localisation.pays', {
            title: 'Pays',
            icon  : 'icon-sitemap',
            state: 'app.population_ddb_localisation_pays',
			weight: 2
        });
    }

})();
