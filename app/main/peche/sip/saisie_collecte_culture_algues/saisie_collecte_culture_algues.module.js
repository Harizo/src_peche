(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.saisie_collecte_culture_algues', [])
        .run(testPermission)  
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_sip_saisie_collecte_culture_algues', {
            url      : '/sip/saisie_collecte_culture_algues',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/sip/saisie_collecte_culture_algues/saisie_collecte_culture_algues.html',
                    controller : 'saisie_collecte_culture_alguesController as vm'
                }
            },
            bodyClass: 'saisie_collecte_culture_algues',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "saisie_collecte_culture_algues"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('peche.sip.saisie_collecte_culture_algues', {
            title: "Saisie collecte culture d'algues",
            icon  : 'icon-numeric-0-box-multiple-outline',
            state: 'app.peche_sip_saisie_collecte_culture_algues',
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
                var permissions = ["ADMIN","SIP_PCH_CLT_ALG"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();