(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.unite_peche_site', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_unite_peche_site', {
            url      : '/donnees-de-base/unite_peche_site',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/unite_peche_site/unite_peche_site.html',
                    controller : 'Unite_peche_siteController as vm'
                }
            },
            bodyClass: 'unite_peche_site',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Site unite peche"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.ddb.unite_peche_site', {
            title: 'Sites / unités de pêche',
            icon  : 'icon-map-marker-circle',
            state: 'app.population_ddb_unite_peche_site',
			weight: 1
        });
    }

})();
