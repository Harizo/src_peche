(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_type_espece', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_ddbsip_sip_type_espece', {
            url      : '/sip/donnees-de-base/type_espece',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/sip_type_espece/sip_type_espece.html',
                    controller : 'Type_especeController as vm'
                }
            },
            bodyClass: 'sip_type_espece',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Type espece"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.sip_type_espece', {
            title: 'Type Especes',
            icon  : 'icon-blur',
            state: 'app.peche_sip_ddbsip_sip_type_espece',
			weight: 1
        });
    }

})();
