(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.pays')
        .controller('PaysController', PaysController);

    /** @ngInject */
    function PaysController($mdDialog, $scope, apiFactory, $state)
    {
      var vm = this;
      vm.ajout = ajout ;

      var NouvelItem=false;
      var currentItem;
		vm.titrepage="Ajout pays";
      vm.selectedItem = {} ;
      vm.allpays = [] ;
      

      //variale affichage bouton nouveau
      vm.afficherboutonnouveau = 1 ;

      //variable cache masque de saisie
      vm.affichageMasque = 0 ;

      //style
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true
    };

    //col table
    vm.pays_column = [
      {
        titre:"Code"
      },
      {
        titre:"Nom"
      },
    ];
      apiFactory.getAll("pays/index").then(function(result){
        vm.allpays = result.data.response;

       /* for (var i = 0; i < vm.allpaysss.length; i++) 
        {
          var item = {
                  id: vm.allpaysss[i].id,
                  nom: vm.allpaysss[i].nom,
                  code: vm.allpaysss[i].code
                 
              };
              
              vm.allpays.push(item);             
        }*/
      });


       function ajout(pays,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (pays,suppression); 
              }
              else
              {
                insert_in_base(pays,suppression);
              }
                
                
            
        }

        function insert_in_base(pays,suppression)
        {
           
            //add
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var getId = 0;

            if (NouvelItem==false) 
            {
               getId = vm.selectedItem.id; 
            } 
            var datas = $.param(
            {
                supprimer:suppression,
                id:getId,      
                code: pays.code,
                nom: pays.nom               
                
            });
        
            //factory
            apiFactory.add("pays/index",datas, config)
                .success(function (data) {

                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    
                    if(suppression==0) 
                    {
                      vm.selectedItem.nom = vm.pays.nom;
                      vm.selectedItem.code = vm.pays.code;
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItem.$selected = false;
                      vm.selectedItem ={};
                    } 
                    else 
                    {    
                      vm.allpays = vm.allpays.filter(function(obj) {

                        return obj.id !== currentItem.id;
                      });
                    }
                  }
                  else
                  {
                    var item = {
                        nom: pays.nom,
                        code: pays.code,
                        id:String(data.response)
                    };
                  
                    vm.allpays.push(item);
                    vm.pays.code='';
                    vm.pays.nom='';
                    //vm.pays.region_id='';
                    
                    NouvelItem=false;
                  }

                  vm.affichageMasque = 0 ;

                })
                .error(function (data) {
                    alert('Error');
                });
                
        }


      //selection sur la liste
      vm.selection= function (item) {
  //      vm.modifiercategorie(item);
        
          vm.selectedItem = item;
          vm.nouvelItem = item;
          currentItem = JSON.parse(JSON.stringify(vm.selectedItem));
          vm.afficherboutonModifSupr = 1 ;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
      };

      $scope.$watch('vm.selectedItem', function() {
        if (!vm.allpays) return;
        vm.allpays.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
			vm.titrepage="Ajout pays";
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 1 ;
          vm.pays.code='';
          vm.pays.nom='';
          vm.pays.pays_id='';
          NouvelItem = true ;

        };

        vm.annuler = function() 
        {
          vm.selectedItem = {} ;
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 0 ;
          vm.afficherboutonnouveau = 1 ;
          vm.afficherboutonModifSupr = 0 ;
          NouvelItem = false;

        };

        vm.modifier = function() 
        {
			vm.titrepage="Modifier pays";
          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.pays.id = vm.selectedItem.id ;
          vm.pays.code = vm.selectedItem.code ;
          vm.pays.nom = vm.selectedItem.nom ;

          
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0;  

        };

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
        };
        
        vm.modifierregion = function (item) 
        {
          vm.allregion.forEach(function(reg) {
              if(reg.id==item.region_id) {
                 item.region_id = reg.id; 
                 item.region_nom = reg.nom;
                 
              }
          });
        }

        function test_existance (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allpays.forEach(function(dist) {
                
                  if (dist.id==item.id) 
                  {
                    if((dist.nom!=item.nom)
                    ||(dist.code!=item.code)
                    ||(dist.region.id!=item.region_id))
                    
                    {
                      insert_in_base(item,suppression);
                      vm.affichageMasque = 0 ;
                    }
                    else
                    {
                      vm.affichageMasque = 0 ;
                    }
                  }
                });
            }
            else
              insert_in_base(item,suppression);
        }
    }

})();
