(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.type_canoe', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_ddb_type_canoe', {
            url      : '/donnees-de-base/type_canoe',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/type_canoe/type_canoe.html',
                    controller : 'Type_canoeController as vm'
                }
            },
            bodyClass: 'type_canoe',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Type_canoe"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.ddb.type_canoe', {
            title: 'Type canoe',
            icon  : 'icon-cup-water',
            state: 'app.peche_ddb_type_canoe',
			weight: 1
        });
    }

})();
