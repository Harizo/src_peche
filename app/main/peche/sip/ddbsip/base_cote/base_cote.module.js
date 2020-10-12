(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.base_cote', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_ddbsip_base_cote', {
            url      : '/sip/donnees-de-base/base_cote',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/base_cote/base_cote.html',
                    controller : 'base_coteController as vm'
                }
            },
            bodyClass: 'base_cote',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Base côte"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.base_cote', {
            title: 'Base côte',
            icon  : 'icon-blur',
            state: 'app.peche_sip_ddbsip_base_cote',
			weight: 1
        });
    }

})();
