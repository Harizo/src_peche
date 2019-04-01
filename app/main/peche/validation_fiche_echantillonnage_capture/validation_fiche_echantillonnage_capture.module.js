
(function ()
{
    'use strict';

    angular
        .module('app.peche.validation_fiche_echantillonnage_capture', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_validation_fiche_echantillonnage_capture', {
            url      : '/validation_fiche_echantillonnage_capture',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/validation_fiche_echantillonnage_capture/validation_fiche_echantillonnage_capture.html',
                    controller : 'Validation_fiche_echantillonnage_captureController as vm'
                }
            },
            bodyClass: 'validation_fiche_echantillonnage_capture',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Validation fiche echantillonnage capture"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.validation_fiche_echantillonnage_capture', {
<<<<<<< HEAD
            title: 'Données validées',
            icon  : 'icon-calendar-check',
=======
            title: 'Validation des données',
            icon  : 'icon-clipboard-text',
>>>>>>> origin/master
            state: 'app.population_validation_fiche_echantillonnage_capture',
            weight: 3
        });
    }

})();
