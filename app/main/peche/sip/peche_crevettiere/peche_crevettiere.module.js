(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.peche_crevettiere', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_reporting_peche_crevettiere', {
            url      : '/sip/peche_crevettiere',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/peche_crevettiere/peche_crevettiere.html',
                    controller : 'peche_crevettiereController as vm'
                }
            },
            bodyClass: 'peche_crevettiere',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "peche_crevettiere"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.peche_crevettiere', {
            title: "Pêche crevettière",
            icon  : 'icon-numeric-2-box-multiple-outline',
            state: 'app.peche_reporting_peche_crevettiere',
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
                var permissions = ["ADMIN","SIP_PCH_CRV"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
