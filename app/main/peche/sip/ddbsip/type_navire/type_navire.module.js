(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.type_navire', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_ddbsip_type_navire', {
            url      : '/sip/donnees-de-base/type-navire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/type_navire/type_navire.html',
                    controller : 'Type_navireController as vm'
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
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.type_navire', {
            title: 'Type Navire',
            icon  : 'icon-map-marker-circle',
            state: 'app.peche_sip_ddbsip_type_navire',
			weight: 1
        });
    }

})();
