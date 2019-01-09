(function ()
{
    'use strict';

    angular
        .module('app.peche.accueil', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_accueil', {
            url      : '/accueil',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/peche/accueil/accueil.html',
                    controller : 'AccueilController as vm'
                }
            },
            bodyClass: 'accueil',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Acceuil"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/peche/accueil');

        // Navigation
        msNavigationServiceProvider.saveItem('peche.accueil', {
            title : 'Acceuil',
            icon  : 'icon-alarm-check',
            state : 'app.population_accueil',
            translate: 'accueil.menu.titre',
            weight: 1,
            hidden: function ()
            {
              //var permissions = ["ALLp"];
              //var x =  loginService.isPermitted(permissions);
            }
        });
    }

})();
