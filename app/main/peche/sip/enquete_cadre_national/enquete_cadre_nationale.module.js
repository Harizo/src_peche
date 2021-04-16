(function ()
{
    'use strict';

    var tab = [

            'app.peche.sip.enquete_cadre_nationale.base_village',
            'app.peche.sip.enquete_cadre_nationale.base_menage'

            ] ;

    angular
        .module('app.peche.sip.enquete_cadre_nationale', tab.sort())
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('peche.sip.enquete_cadre_nationale', {
            title : 'Enquête cadre national',
            icon  : 'icon-data',
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
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["ADMIN","SIP_DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
