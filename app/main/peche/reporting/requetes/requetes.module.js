(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.requetes', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_requetes', {
            url      : '/reporting/requetes',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/reporting/requetes/requetes.html',
                    controller : 'requetesController as vm'
                }
            },
            bodyClass: 'requetes',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "requetes"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.reporting.requetes', {
            title: "Requêtes",
            icon  : 'icon-check-circle',
            state: 'app.peche_reporting_requetes',
			weight: 1
        });
    }

})();
