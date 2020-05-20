(function ()
{
    'use strict';

    angular
        .module('app.peche.sip', [

        	'app.peche.sip.produit_halieutiques'

        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip', {
            title : 'S.I.P',
            icon  : 'icon-camera-iris',
            weight: 1
        });

    }
})();
