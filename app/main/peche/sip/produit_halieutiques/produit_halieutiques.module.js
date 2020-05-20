(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.produit_halieutiques', [])
       // .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_produit_halieutiques', {
            url      : '/sip/produit_halieutiques',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/produit_halieutiques/produit_halieutiques.html',
                    controller : 'produit_halieutiquesController as vm'
                }
            },
            bodyClass: 'produit_halieutiques',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "produit_halieutiques"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.produit_halieutiques', {
            title: "Produits halieutiques",
            icon  : 'icon-check-circle',
            state: 'app.peche_reporting_produit_halieutiques',
			weight: 1/*,
            hidden: function()
            {
                    return vs;
            }*/
        });
    }

  /*  function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;
                var permissions = ["RPT"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }*/

})();
