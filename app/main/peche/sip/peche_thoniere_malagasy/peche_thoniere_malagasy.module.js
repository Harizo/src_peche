(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.peche_thoniere_malagasy', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_peche_thoniere_malagasy', {
            url      : '/sip/peche-thoniere-malagasy',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/peche_thoniere_malagasy/peche_thoniere_malagasy.html',
                    controller : 'Peche_thoniere_malagasyController as vm'
                }
            },
            bodyClass: 'peche_thoniere_malagasy',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Pêche thoniere Malagasy"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.peche_thoniere_malagasy', {
            title: "Pêche thonière Malagasy",
            icon  : 'icon-numeric-3-box-multiple-outline',
            state: 'app.peche_reporting_peche_thoniere_malagasy',
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
                var permissions = ["ADMIN","SIP_PCH_TNRM"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
