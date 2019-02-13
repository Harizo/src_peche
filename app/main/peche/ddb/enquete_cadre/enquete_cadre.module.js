(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.enquete_cadre', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_ddb_enquete_cadre', {
            url      : '/donnees-de-base/enquete_cadre',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/enquete_cadre/enquete_cadre.html',
                    controller : 'Enquete_cadreController as vm'
                }
            },
            bodyClass: 'enquete_cadre',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "enquete_cadre"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.ddb.enquete_cadre', {
            title: 'Enquête cadre',
            icon  : 'icon-houzz-box',
            state: 'app.peche_ddb_enquete_cadre',
			weight: 1
        });
    }

})();
