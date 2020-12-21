(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.pecheur_pirogue', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_pecheur_pirogue', {
            url      : '/sip/pecheur_pirogue',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/pecheur_pirogue/pecheur_pirogue.html',
                    controller : 'pecheur_pirogueController as vm'
                }
            },
            bodyClass: 'pecheur_pirogue',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "pecheur_pirogue"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.pecheur_pirogue', {
            title: "Base de registre pêcheurs et pirogues",
            icon  : 'icon-numeric-8-box-multiple-outline',
            state: 'app.peche_reporting_pecheur_pirogue',
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
                var permissions = ["ADMIN","SIP_PCH_BRPP"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
