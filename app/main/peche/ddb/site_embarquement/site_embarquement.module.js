(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.site_embarquement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_site_embarquement', {
            url      : '/donnees-de-base/site_embarquement',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/site_embarquement/site_embarquement.html',
                    controller : 'Site_embarquementController as vm'
                }
            },
            bodyClass: 'site_embarquement',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Site_embarquement"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.ddb.localisation.site_embarquement', {
            title: 'Site d\'enquête',
            icon  : 'icon-compass-outline',
            state: 'app.population_ddb_site_embarquement',
			weight: 10
        });
    }

})();
