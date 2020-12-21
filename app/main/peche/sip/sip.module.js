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
        .run(testPermission) 
        .config(config);
var vs ;
    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip', {
            //title : "Système d'information des pêches (S.I.P)",
            title : "SYSTEME D'INFORMATION DES PECHES (S.I.P)",
            icon  : 'icon-laptop-chromebook',
            //group : true,
            weight: 2,
            hidden: function()
            {
                    return vs;
            }
        });

    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;

                var permissions = [ "ADMIN",
                                    "SIP_PCH_HAL",
                                    "SIP_PCH_CRV",
                                    "SIP_PCH_TNRM",
                                    "SIP_PCH_TNRE",
                                    "SIP_PSN_DEM",
                                    "SIP_PCH_ART",
                                    "SIP_PCH_BRPP",
                                    "SIP_PROD_COM",
                                    "SIP_PCH_CLT_ALG",
                                    "SIP_DDB",
                                    "SIP_RPT",
                                    "SIP_PCH_VNT_PSN"
                                  ];


                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }
})();
