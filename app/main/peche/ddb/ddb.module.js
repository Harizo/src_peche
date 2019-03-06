(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb', [
			
            'app.peche.ddb.localisation', 
            'app.peche.ddb.type_engin',
            'app.peche.ddb.data_collect',
            'app.peche.ddb.espece',
            'app.peche.ddb.type_canoe',
            'app.peche.ddb.enqueteur',
            'app.peche.ddb.site_embarquement',
            'app.peche.ddb.site_enqueteur',
            'app.peche.ddb.unite_peche',
            'app.peche.ddb.enquete_cadre',
            'app.peche.ddb.unite_peche_site',
            //'app.peche.ddb.echantillon'


            ])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('peche.ddb', {
            title : 'Données de Bases',
            icon  : 'icon-data',
            weight: 2/*,
            hidden: function()
            {
                    return vs;
            }*/
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
