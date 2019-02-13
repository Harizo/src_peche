(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.espece', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_ddb_espece', {
            url      : '/donnees-de-base/espece',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/espece/espece.html',
                    controller : 'EspeceController as vm'
                }
            },
            bodyClass: 'espece',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "espece"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.ddb.espece', {
            title: 'Espece',
            icon  : 'icon-blur',
            state: 'app.peche_ddb_espece',
			weight: 4
        });
    }

})();
