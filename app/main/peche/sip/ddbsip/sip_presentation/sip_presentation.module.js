(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_presentation',[])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_ddbsip_sip_presentation', {
            url      : '/sip/donnees-de-base/presentation',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/sip_presentation/sip_presentation.html',
                    controller : 'PresentationController as vm'
                }
            },
            bodyClass: 'sip_presentation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Presentation"
            }
        }); 

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.sip_presentation', {
            title: 'Presentation',
            icon  : 'icon-library-books',
            state: 'app.peche_sip_ddbsip_sip_presentation',
			weight: 1
        });
    }

})();
