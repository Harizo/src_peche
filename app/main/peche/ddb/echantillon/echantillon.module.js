(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.echantillon', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_echantillon', {
            url      : '/donnees-de-base/echantillon',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/echantillon/echantillon.html',
                    controller : 'EchantillonController as vm'
                }
            },
            bodyClass: 'echantillon',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche echantillonnage capture"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.ddb.echantillon', {
            title: 'Echantillon',
            icon  : 'icon-file-document-box',
            state: 'app.population_ddb_echantillon',
            weight: 3
        });
    }

})();
