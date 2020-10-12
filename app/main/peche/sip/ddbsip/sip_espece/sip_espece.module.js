(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip.sip_espece', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_ddbsip_sip_espece', {
            url      : '/sip/ddbsip/espece',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/ddbsip/sip_espece/sip_espece.html',
                    controller : 'Sip_especeController as vm'
                }
            },
            bodyClass: 'sip_espece',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Espece"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip.sip_espece', {
            title: ' Especes',
            icon  : 'icon-blur',
            state: 'app.peche_sip_ddbsip_sip_espece',

            weight: 1

        });
    }

})();