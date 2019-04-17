(function ()
{
    'use strict';

    angular
        .module('app.peche.administration.utilisateur')
        .controller('UserController', UserController);

    /** @ngInject */
    function UserController(apiFactory, $location, $mdDialog, $scope)
    {
      var vm = this;

      vm.allSite = [];

      vm.selectedItem = {} ;
      vm.infoAssuj = {} ;

      vm.column = [{"titre":"Nom"},{"titre":"Prénom"},{"titre":"Email"},
      {"titre":"Etat"},{"titre":"Privilège"}];

      vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
    };


      apiFactory.getAPIgeneraliserREST("utilisateurs/index","type_get","findAll").then(function(result) {

        vm.listes_utilisateurs = result.data.response;

      });

      vm.formatMillier = function (nombre) 
      {
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return nombre;
            } else {
                return "";
            }
      }
       

      vm.sexe = function (s)
      {
          var x = Number(s);
          switch(x)
          {
              case 1:
              {
                  return "Mr";
                  break;
              }

              case 0:
              {
                  return "Mme";
                  break;
              }

              default:
              {
                  return "Mr/Mme ...?";
                  break;
              }
          }
      }

      
      vm.selection = function (item) 
      {        
        vm.selectedItem = item;
  
        vm.nouvelItem = item;
        //currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
        vm.afficherboutonModifSupr = 1 ;
        vm.user = {} ;
        vm.affichageMasque = 0 ;
        
      };

      function loadAll() 
      {

        var repos = vm.assujettis ;
        return repos.map( function (repo) {
          repo.value = repo.nom.toLowerCase();
      
          return repo;
        });
      }

      function loadAllforPersonnel() 
      {

        var repos = vm.personnels ;

        return repos.map( function (repo) {
          repo.value = repo.nom.toLowerCase();
      
          return repo;
        });
      }

      vm.changerAssujettis = function (item) 
      {
          vm.infoAssuj = item ;

      }

      vm.changerPers = function (item) 
      {
          vm.pers = item ;

      }



        // Fonction utilisées par balise autocomplete
        vm.querySearch = function  (query) {

            vm.repos = loadAll();
          var results = query ? vm.repos.filter( createFilterFor(query) ) : vm.repos,
              deferred;
          if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }

        vm.querySearchPersonnel = function  (query) {

            vm.reposPers = loadAllforPersonnel();
          var results = query ? vm.reposPers.filter( createFilterFor(query) ) : vm.reposPers,
              deferred;
          if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }

        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
          };
        }

    $scope.$watch('vm.selectedItem', function() 
    {
        if (!vm.listes_utilisateurs) return;
        vm.listes_utilisateurs.forEach(function(item) {
          item.$selected = false;
        });
        vm.selectedItem.$selected = true;
    });

      vm.testEnabled = function(valeur)
      {
          switch(valeur)
          {
              case '1':
              {
                  return 'Actif' ;
                  break;
              }
              default :
              {
                  return 'Inactif' ;
                  break;
              }
          }
      }

      vm.modifier = function()
      {
          vm.affichageMasque = 1 ;
          vm.user.id = vm.selectedItem.id ;
          vm.user.nom = vm.selectedItem.nom ;
          vm.user.prenom = vm.selectedItem.prenom ;
          vm.user.email = vm.selectedItem.email ;
          vm.user.enabled = vm.selectedItem.enabled ;
          /*vm.user.sigle = vm.selectedItem.sigle ;
		  vm.user.envoi_donnees = parseInt(vm.selectedItem.envoi_donnees) ;*/
        
          vm.searchText="";
          vm.searchTextPers="";
          

          angular.forEach(vm.selectedItem.roles, function(value, key)
          {
            
              switch(value)
              {
                  case 'USER':
                  {
                      vm.user.user = true ;
                      break ;
                  }

                  case 'DDB':
                  {
                      vm.user.ddb = true ;
                      break ;
                  }

                  case 'ADMIN':
                  {
                      vm.user.admin = true ;
                      break;
                  }

                  case 'SSI':
                  {
                      vm.user.ssi = true ;
                      break;
                  }

                  case 'VLD':
                  {
                      vm.user.vld = true ;
                      break;
                  }

                  case 'RPT':
                  {
                      vm.user.rpt = true ;
                      break;
                  }

                  default:
                  {
                      break ;
                  }
              }  
          });
      }
      vm.supprimer = function() 
      {
        vm.affichageMasque = 0 ;
        vm.afficherboutonModifSupr = 0 ;
        var confirm = $mdDialog.confirm()
          .title('Etes-vous sûr de supprimer cet enregistrement ?')
          .textContent('')
          .ariaLabel('Lucky day')
          .clickOutsideToClose(true)
          .parent(angular.element(document.body))
          .ok('ok')
          .cancel('annuler');
        $mdDialog.show(confirm).then(function() {
        
        vm.ajout(vm.selectedItem,1);
        }, function() {
        //alert('rien');
        });
      }
      vm.ajout = function(user,suppression)
      {
        var tab = [] ;
         

          angular.forEach(user, function(value, key)
          {
        
              if(key == 'user' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'ddb' && value == true)
                tab.push(key.toUpperCase());
              if(key == 'admin' && value == true)
                  tab.push(key.toUpperCase());
              if(key == 'ssi' && value == true)
                tab.push(key.toUpperCase());
              if(key == 'vld' && value == true)
                tab.push(key.toUpperCase());
              if(key == 'rpt' && value == true)
                tab.push(key.toUpperCase());
              
          });

          
          if (suppression == 0) 
          {//update

              var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
              };

              
              if (!vm.infoAssuj) 
              {
                  vm.infoAssuj = {};
                  vm.infoAssuj.id = "";
              };

              if (!vm.pers) 
              {
                  vm.pers = {};
                  vm.pers.id = "";
              };
              var datas = $.param(
              { 
                  gestion_utilisateur:1,
                  supprimer:suppression,
                  id:vm.selectedItem.id,
                  nom: user.nom,
                  prenom: user.prenom,                           
                 // sigle: user.sigle,                           
                  email: user.email ,
                  enabled: user.enabled ,
                 // envoi_donnees: user.envoi_donnees ,
                  roles: tab 
                             
                  
              });


              apiFactory.add("utilisateurs/index",datas, config)
              .success(function (data) 
              {
                  //*******************************confirmation mail
                 /* if (user.enabled == 1) 
                  {
                      apiFactory.getAll("mail/index?actif=4&dest="+user.email).then(function(value) {
                        if(value.status == 200){
                          
                        }
                        //
                      });
                  };*/
                  //*******************************
                  vm.selectedItem.roles = tab ;
                  vm.selectedItem.nom = user.nom;
                  vm.selectedItem.email = user.email;
                  vm.selectedItem.prenom = user.prenom;
                 // vm.selectedItem.sigle = user.sigle;
                  vm.selectedItem.enabled = user.enabled;
                 // vm.selectedItem.envoi_donnees = user.envoi_donnees;
                  //vm.selectedItem.assujettis = vm.infoAssuj;
                  //vm.selectedItem.personnel = vm.pers;

             /*     

                  angular.forEach(vm.allSite, function(value, key)
                  {
                      if (value.id == user.site_id) 
                      {
                          vm.selectedItem.site = value ;
                      };
                    
                  });*/


                  vm.user = {} ;
                  vm.affichageMasque = 0 ;


              })
              .error(function (data) 
              {
                  
              });

          }
          else//delete
          {
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
              };

              var datas = $.param(
              { 
                  gestion_utilisateur:1,
                  supprimer:suppression,
                  id:vm.selectedItem.id
                             
                  
              });
              apiFactory.add("utilisateurs/index",datas, config)
              .success(function (data) 
              {
                  vm.listes_utilisateurs = vm.listes_utilisateurs.filter(function(obj) {
            
                    return obj.id !== vm.selectedItem.id;
                  });
              })
              .error(function (data) 
              {
                  
              });
          }


          

      }

      vm.annuler = function()
      {
          vm.user = {} ;
          vm.affichageMasque = 0 ;
      }

     
    }
})();
