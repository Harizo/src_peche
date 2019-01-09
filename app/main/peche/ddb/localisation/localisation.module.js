(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation', [   
            'app.peche.ddb.localisation.fokontany',     
            'app.peche.ddb.localisation.commune',
            'app.peche.ddb.localisation.district',
            'app.peche.ddb.localisation.region'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('peche.ddb.localisation', {
            title : 'Localisation',
            icon  : 'icon-map-marker-multiple',
            weight: 6
        });
    }

})();
