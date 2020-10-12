(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.type_engin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_ddb_type_engin', {
            url      : '/donnees-de-base/type_engin',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/type_engin/type_engin.html',
                    controller : 'Type_enginController as vm'
                }
            },
            bodyClass: 'type_engin',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Type_engin"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.openartfish.ddb.type_engin', {
            title: 'Type engin',
            icon  : 'icon-houzz-box',
            state: 'app.peche_ddb_type_engin',
			weight: 1
        });
    }

})();
