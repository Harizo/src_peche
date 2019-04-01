(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.nombre_echantillon', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_nombre_echantillon', {
            url      : '/reporting/nombre_echantillon',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/reporting/nombre_echantillon/nombre_echantillon.html',
                    controller : 'Nombre_echantillonController as vm'
                }
            },
            bodyClass: 'nombre_echantillon',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "nombre_echantillon"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.reporting.nombre_echantillon', {
            title: "Nombres d'echantillon",
            icon  : 'icon-check-circle',
            state: 'app.peche_reporting_nombre_echantillon',
			weight: 1
        });
    }

})();
