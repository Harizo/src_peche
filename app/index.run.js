(function ()
{
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $location, $timeout, $state, loginService, cookieService, storageService)
    {
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams)
        {
            $rootScope.loadingProgress = true;

            var enabled = loginService.isEnabled();
            var authorized = toState.data.authorizer;
            var AllPermitted = toState.data.permitted;
            if(cookieService.get("roles"))
            {
              var Permitted = cookieService.get("roles");
            }else{
              var Permitted = ["USER"];
            }
            var exist = storageService.get('exist');
            var getPermis = loginService.isPermitted(AllPermitted, Permitted);

            if(!enabled && authorized) {
              $location.path("/auth/login");
            }else if(enabled && exist!=9) {
              $location.path("/auth/lock");
            }else if(enabled && authorized && !getPermis){
              $location.path("/erreur");
            }

        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams)
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
                $rootScope.pagetitre = toState.data.page;
            });
        });


        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });

    }
})();
