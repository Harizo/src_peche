(function ()
{
    'use strict';

    angular
        .module('app.peche.auth.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.peche_auth_login', {
            url      : '/auth/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.peche_auth_login': {
                    templateUrl: 'app/main/peche/auth/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            bodyClass: 'login',
            data : {
              authorizer : false,
              permitted : ["USER"],
              page: "Authentification"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/peche/auth/login');
    }

})();
