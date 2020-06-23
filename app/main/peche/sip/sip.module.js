(function ()
{
    'use strict';

    angular
        .module('app.peche.sip', [

        	'app.peche.sip.produit_halieutiques',
            'app.peche.sip.peche_crevettiere',
            'app.peche.sip.peche_thoniere_malagasy',
            'app.peche.sip.peche_thoniere_etranger',
            'app.peche.sip.poisson_demersaux',
            'app.peche.sip.peche_artisanale',
            'app.peche.sip.vente_poissonnerie',
            'app.peche.sip.pecheur_pirogue'

        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip', {
            title : "Système d'information des pêches(S.I.P)",
            icon  : 'icon-desktop-mac',
            weight: 1
        });

    }
})();
