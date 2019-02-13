
(function ()
{
    'use strict';

    angular
        .module('app.peche.fiche_echantillonnage_capture', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_fiche_echantillonnage_capture', {
            url      : '/fiche_echantillonnage_capture',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/fiche_echantillonnage_capture/fiche_echantillonnage_capture.html',
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
        msNavigationServiceProvider.saveItem('peche.fiche_echantillonnage_capture', {
            title: 'Fiche d\'echantillonnage',
            icon  : 'icon-clipboard-text',
            state: 'app.population_fiche_echantillonnage_capture',
            weight: 3
        });
    }

})();
