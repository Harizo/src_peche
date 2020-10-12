(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_famille', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_ddbsip_sip_famille', {
            url      : '/sip/donnees-de-base/famille',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/sip_famille/sip_famille.html',
                    controller : 'Sip_familleController as vm'
                }
            },
            bodyClass: 'sip_famille',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Famille"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.sip_famille', {
            title: 'Famille',
            icon  : 'icon-blur',
            state: 'app.peche_sip_ddbsip_sip_famille',
			weight: 1
        });
    }

})();
