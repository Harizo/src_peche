(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.data_collect', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_data_collect', {
            url      : '/donnees-de-base/data_collect',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/ddb/data_collect/data_collect.html',
                    controller : 'Data_collectController as vm'
                }
            },
            bodyClass: 'data_collect',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "data_collect"
            }
        });

        // Navigation
       /* msNavigationServiceProvider.saveItem('peche.ddb.data_collect', {
            title: 'Data collect',
            icon  : 'icon-library-books',
            state: 'app.population_ddb_data_collect',
			weight: 1
        });*/
    }

})();
