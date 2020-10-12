(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.nbr_jrs_mois_unite_peche', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_nbr_jrs_mois_unite_peche', {
            url      : '/donnees-de-base/nbr_jrs_mois_unite_peche',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/nbr_jrs_mois_unite_peche/nbr_jrs_mois_unite_peche.html',
                    controller : 'Nbr_jrs_mois_unite_pecheController as vm'
                }
            },
            bodyClass: 'nbr_jrs_mois_unite_peche',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Nombre de jours par mois"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.ddb.nbr_jrs_mois_unite_peche', {
            title: 'Nbr de jrs pêche/mois/unité pêche',
            icon  : 'icon-map-marker-circle',
            state: 'app.population_ddb_nbr_jrs_mois_unite_peche',
			weight: 1
        });
    }

})();
