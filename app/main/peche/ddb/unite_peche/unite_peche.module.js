(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.unite_peche', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_ddb_unite_peche', {
            url      : '/donnees-de-base/unite_peche',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/unite_peche/unite_peche.html',
                    controller : 'Unite_pecheController as vm'
                }
            },
            bodyClass: 'unite_peche',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "unite_peche"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.ddb.unite_peche', {
            title: 'Unité de pêche',
            icon  : 'icon-houzz-box',
            state: 'app.peche_ddb_unite_peche',
			weight: 1
        });
    }

})();
