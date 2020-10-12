(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.site_enqueteur', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_site_enqueteur', {
            url      : '/donnees-de-base/site_enqueteur',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/site_enqueteur/site_enqueteur.html',
                    controller : 'Site_enqueteurController as vm'
                }
            },
            bodyClass: 'site_enqueteur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Site Enqueteur"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.ddb.site_enqueteur', {
            title: 'Sites / enquêteurs',
            icon  : 'icon-map-marker-circle',
            state: 'app.population_ddb_site_enqueteur',
			weight: 1
        });
    }

})();
