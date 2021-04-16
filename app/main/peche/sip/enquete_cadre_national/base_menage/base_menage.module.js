(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.enquete_cadre_nationale.base_menage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_enquete_cadre_nationale_base_menage', {
            url      : '/sip/enquete_cadre_nationale/base_menage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/enquete_cadre_national/base_menage/base_menage.html',
                    controller : 'base_menageController as vm'
                }
            },
            bodyClass: 'base_menage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "base_menage"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.enquete_cadre_nationale.base_menage', {
            title: 'Base ménage',
            icon  : 'icon-map-marker-circle',
            state: 'app.peche_sip_enquete_cadre_nationale_base_menage',
			weight: 1
        });
    }

})();
