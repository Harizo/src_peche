(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.peche_thoniere_etranger', [])
       // .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_peche_thoniere_etranger', {
            url      : '/sip/peche-thoniere-etranger',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/peche_thoniere_etranger/peche_thoniere_etranger.html',
                    controller : 'Peche_thoniere_etrangerController as vm'
                }
            },
            bodyClass: 'peche_thoniere_etranger',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Pêche thoniere étranger"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.peche_thoniere_etranger', {
            title: "Pêche thonière Etranger",
            icon  : 'icon-numeric-4-box-multiple-outline',
            state: 'app.peche_peche_thoniere_etranger',
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
