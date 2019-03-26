
(function ()
{
    'use strict';

    angular
        .module('app.peche.valide_fiche_echantillonnage_capture', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_valide_fiche_echantillonnage_capture', {
            url      : '/valide_fiche_echantillonnage_capture',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/valide_fiche_echantillonnage_capture/valide_fiche_echantillonnage_capture.html',
                    controller : 'Valide_fiche_echantillonnage_captureController as vm'
                }
            },
            bodyClass: 'valide_fiche_echantillonnage_capture',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Fiche echantillonnage capture valide"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.valide_fiche_echantillonnage_capture', {
            title: 'Données validées',
            icon  : 'icon-clipboard-text',
            state: 'app.population_valide_fiche_echantillonnage_capture',
            weight: 3
        });
    }

})();
