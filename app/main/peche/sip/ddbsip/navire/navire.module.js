(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.navire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_ddbsip_navire', {
            url      : '/sip/donnees-de-base/navire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/navire/navire.html',
                    controller : 'NavireController as vm'
                }
            },
            bodyClass: 'navire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Navire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.navire', {
            title: 'Navire',
            icon  : 'icon-map-marker-circle',
            state: 'app.peche_sip_ddbsip_navire',
			weight: 1
        });
    }

})();
