(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.nbr_echantillon_enqueteur', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_nbr_echantillon_enqueteur', {
            url      : '/donnees-de-base/nbr_echantillon_enqueteur',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/nbr_echantillon_enqueteur/nbr_echantillon_enqueteur.html',
                    controller : 'Nbr_echantillon_enqueteurController as vm'
                }
            },
            bodyClass: 'nbr_echantillon_enqueteur',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Echantillon par enquêteur"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.ddb.nbr_echantillon_enqueteur', {
            title: 'Max echantillon',
            icon  : 'icon-map-marker-circle',
            state: 'app.population_ddb_nbr_echantillon_enqueteur',
			weight: 1
        });
    }

})();
