(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.enqueteur')
        .controller('EnqueteurController', EnqueteurController);

    /** @ngInject */
    function EnqueteurController($mdDialog, $scope, apiFactory, $state)
    {
      var vm = this;
      vm.ajout = ajout ;

      var NouvelItem=false;
      var currentItem;
    vm.titrepage="Ajout enqueteur";
      vm.selectedItem = {} ;
      vm.allenqueteur = [] ;
      

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
    vm.enqueteur_column = [
      {
        titre:"Nom"
      },
      {
        titre:"Prenom"
      },
       {
        titre:"Cin"
      },
      {
        titre:"Region"
      }
    ];

      apiFactory.getAll("region/index").then(function(result)
      {
        vm.allregion= result.data.response;
      });

      apiFactory.getAll("enqueteur/index").then(function(result){
        vm.allenqueteurss = result.data.response;

        for (var i = 0; i < vm.allenqueteurss.length; i++) 
        {
          var item = {
                  id: vm.allenqueteurss[i].id,
                  nom: vm.allenqueteurss[i].nom,
                  prenom: vm.allenqueteurss[i].prenom,
                  cin: vm.allenqueteurss[i].cin,
                  region_id: vm.allenqueteurss[i].region_id,
                  region_nom: vm.allenqueteurss[i].region.nom
                 
              };
              
              vm.allenqueteur.push(item);
                          
        }
      });


       function ajout(enqueteur,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (enqueteur,suppression); 
              }
              else
              {
                insert_in_base(enqueteur,suppression);
              }
                
                
            
        }

        function insert_in_base(enqueteur,suppression)
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
                prenom: enqueteur.prenom,
                nom: enqueteur.nom,
                cin: enqueteur.cin,
                region_id:enqueteur.region_id
                
            });
       
            //factory
            apiFactory.add("enqueteur/index",datas, config)
                .success(function (data) {

                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    
                    if(suppression==0) 
                    {
                      vm.selectedItem.nom = vm.enqueteur.nom;
                      vm.selectedItem.prenom = vm.enqueteur.prenom;
                      vm.selectedItem.cin = vm.enqueteur.cin;
                      vm.selectedItem.region_id = vm.enqueteur.region_id;
                      vm.selectedItem.region_nom = vm.enqueteur.region_nom;
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItem.$selected = false;
                      vm.selectedItem ={};
                    } 
                    else 
                    {    
                      vm.allenqueteur = vm.allenqueteur.filter(function(obj) {

                        return obj.id !== currentItem.id;
                      });
                    }
                  }
                  else
                  {
                    var item = {
                        nom: enqueteur.nom,
                        prenom: enqueteur.prenom,
                        cin: enqueteur.cin,
                        id:String(data.response) ,
                        region_id:enqueteur.region_id ,
                        region_nom:enqueteur.region_nom 
                    };
                  console.log(enqueteur.region_nom);
                    vm.allenqueteur.push(item);
                    vm.enqueteur.prenom='';
                    vm.enqueteur.nom='';
                    vm.enqueteur.cin='';
                    vm.enqueteur.region_id='';
                    
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
        if (!vm.allenqueteur) return;
        vm.allenqueteur.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
      vm.titrepage="Ajout enqueteur";
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 1 ;
          vm.enqueteur.cin='';
          vm.enqueteur.nom='';
          vm.enqueteur.prenom='';
          vm.enqueteur.enqueteur_id='';
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
      vm.titrepage="Modifier enqueteur";
          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.enqueteur.id = vm.selectedItem.id ;
          vm.enqueteur.prenom = vm.selectedItem.prenom ;
          vm.enqueteur.cin = vm.selectedItem.cin ;
          vm.enqueteur.nom = vm.selectedItem.nom ;
         
          vm.allregion.forEach(function(reg) {
            if(reg.id==vm.selectedItem.region_id) {

              vm.enqueteur.region_id = reg.id ;
              vm.enqueteur.region_nom = reg.nom ;
            }
          });

          
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
                vm.allenqueteur.forEach(function(dist) {
                
                  if (dist.id==item.id) 
                  {
                    if((dist.nom!=item.nom)
                    ||(dist.prenom!=item.prenom)
                    ||(dist.cin!=item.cin)
                    ||(dist.region_id!=item.region_id))
                    
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
