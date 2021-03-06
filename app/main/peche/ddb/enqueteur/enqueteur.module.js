(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.enqueteur', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_enqueteur', {
            url      : '/donnees-de-base/enqueteur',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/enqueteur/enqueteur.html',
                    controller : 'EnqueteurController as vm'
                }
            },
            bodyClass: 'enqueteur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Enqueteur"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.ddb.enqueteur', {
            title: 'Enquêteur',
            icon  : 'icon-clipboard-account',
            state: 'app.population_ddb_enqueteur',
			weight: 1
        });
    }

})();
