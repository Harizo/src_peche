(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.base_geo', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_ddbsip_base_geo', {
            url      : '/sip/donnees-de-base/base_geo',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/base_geo/base_geo.html',
                    controller : 'base_geoController as vm'
                }
            },
            bodyClass: 'base_geo',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Base Géo"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.base_geo', {
            title: 'Base Géo',
            icon  : 'icon-blur',
            state: 'app.peche_sip_ddbsip_base_geo',
			weight: 2
        });
    }

})();
