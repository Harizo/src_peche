(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.ddbsip', [

            'app.peche.sip.ddbsip.base_cote',
            'app.peche.sip.ddbsip.base_geo',
            'app.peche.sip.ddbsip.sip_conservation' ,
            'app.peche.sip.ddbsip.sip_espece',
            'app.peche.sip.ddbsip.sip_famille',
            'app.peche.sip.ddbsip.navire',
            'app.peche.sip.ddbsip.sip_presentation' ,
            'app.peche.sip.ddbsip.sip_type_espece',
            'app.peche.sip.ddbsip.type_navire'

            ])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('peche.sip.ddbsip', {
            title : 'Données de Bases',
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
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
