(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting', [
            'app.peche.reporting.nombre_echantillon'

        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('peche.reporting', {
            title : 'Reporting/Analyses',
           // group : true,
            icon  : 'icon-calendar-text',
            weight: 6
        });

     
    }
})();
