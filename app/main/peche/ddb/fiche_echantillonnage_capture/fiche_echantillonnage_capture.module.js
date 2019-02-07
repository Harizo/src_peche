
(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.fiche_echantillonnage_capture', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_fiche_echantillonnage_capture', {
            url      : '/donnees-de-base/fiche_echantillonnage_capture',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/fiche_echantillonnage_capture/fiche_echantillonnage_capture.html',
                    controller : 'Fiche_echantillonnage_captureController as vm'
                }
            },
            bodyClass: 'fiche_echantillonnage_capture',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche echantillonnage capture"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.ddb.fiche_echantillonnage_capture', {
            title: 'Fiche d\'echantillonnage',
            icon  : 'icon-clipboard-text',
            state: 'app.population_ddb_fiche_echantillonnage_capture',
            weight: 3
        });
    }

})();
