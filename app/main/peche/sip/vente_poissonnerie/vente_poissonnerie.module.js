(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.vente_poissonnerie', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_vente_poissonnerie', {
            url      : '/sip/vente_poissonnerie',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/vente_poissonnerie/vente_poissonnerie.html',
                    controller : 'vente_poissonnerieController as vm'
                }
            },
            bodyClass: 'vente_poissonnerie',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "vente_poissonnerie"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.vente_poissonnerie', {
            title: "Vente poissonnerie",
            icon  : 'icon-numeric-7-box-multiple-outline',
            state: 'app.peche_reporting_vente_poissonnerie',
			weight: 1,
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
                var permissions = ["ADMIN","SIP_PCH_VNT_PSN"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
