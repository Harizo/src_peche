(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation', [   
            
           //  'app.peche.ddb.localisation.pays',     
            //'app.peche.ddb.localisation.commune',
            'app.peche.ddb.localisation.district',
            'app.peche.ddb.localisation.region',
           //'app.peche.ddb.localisation.fokontany',
           'app.peche.ddb.localisation.ddb.decoup_admin'

        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('peche.localisation', {
            title : 'Localisation',
            icon  : 'icon-map-marker-multiple',
            weight: 1
        });
    }

})();
