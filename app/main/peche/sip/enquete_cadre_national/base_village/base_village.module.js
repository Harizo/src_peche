(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.enquete_cadre_nationale.base_village', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_enquete_cadre_nationale_base_village', {
            url      : '/sip/enquete_cadre_nationale/base_village',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/enquete_cadre_national/base_village/base_village.html',
                    controller : 'base_villageController as vm'
                }
            },
            bodyClass: 'base_village',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "base_village"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.enquete_cadre_nationale.base_village', {
            title: 'Base village',
            icon  : 'icon-map-marker-circle',
            state: 'app.peche_sip_enquete_cadre_nationale_base_village',
			weight: 1
        });
    }

})();
