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
            'app.peche.sip.pecheur_pirogue',
            'app.peche.sip.coefficient_conversion',
            'app.peche.sip.production_commerce_region',
            'app.peche.sip.saisie_collecte_culture_algues',
            'app.peche.sip.ddbsip'


        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip', {
            //title : "Système d'information des pêches (S.I.P)",
            title : "SYSTEME D'INFORMATION DES PECHES (S.I.P)",
            icon  : 'icon-laptop-chromebook',
            //group : true,
            weight: 2
        });

    }
})();
