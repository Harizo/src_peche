(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_conservation', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.sip_ddbsip_sip_conservation', {
            url      : '/sip/donnees-de-base/conservation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/sip_conservation/sip_conservation.html',
                    controller : 'Sip_conservationController as vm'
                }
            },
            bodyClass: 'sip_conservation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Conservation"
            }
        }); 

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.sip_conservation', {
            title: 'Conservation',
            icon  : 'icon-library-books',
            state: 'app.sip_ddbsip_sip_conservation',
			weight: 2
        });
    }

})();
