(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.localisation.commune')
        .controller('CommuneController', CommuneController);

    /** @ngInject */
    function CommuneController($mdDialog, $scope, $location, apiFactory, $cookieStore)
    {
      var vm = this;
      vm.ajout = ajout ;
      var NouvelItem=false;
      var currentItem;

      vm.selectedItem = {} ;
      vm.allcommune = [] ;
      

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
    vm.commune_column = [
      {
        titre:"Code"
      },
      {
        titre:"Nom"
      },
      {
        titre:"District"
      }
    ];
    
    apiFactory.getAll("district/index").then(function(result)
    {
      vm.alldistrict = result.data.response;
    });

    apiFactory.getAll("commune/index").then(function(result){
      vm.allcommune = result.data.response;
         /* for (var i = 0; i < vm.allcommuness.length; i++) 
          {
            var item = {
                    id: vm.allcommuness[i].id,
                    nom: vm.allcommuness[i].nom,
                    code: vm.allcommuness[i].code,
                    district_id: vm.allcommuness[i].district_id,
                    district_nom: vm.allcommuness[i].district.nom
                   
                };
                
                vm.allcommune.push(item);             
          } */
    });
    
     
        function ajout(commune,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (commune,suppression); 
              }
              else
              {
                insert_in_base(commune,suppression);
              }
                
                
            
        }

        function insert_in_base(commune,suppression)
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
                code: commune.code,
                nom: commune.nom,
                district_id:commune.district_id
                
            });
        
            //factory
            apiFactory.add("commune/index",datas, config)
                .success(function (data) {

                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    
                    if(suppression==0) 
                    {
                      vm.selectedItem.nom = vm.commune.nom;
                      vm.selectedItem.code = vm.commune.code;
                      vm.selectedItem.district_id = vm.commune.district_id;
                      vm.selectedItem.district_nom = vm.commune.district_nom;
                      vm.afficherboutonModifSupr = 0 ;
                      vm.afficherboutonnouveau = 1 ;
                      vm.selectedItem.$selected = false;
                      vm.selectedItem ={};
                    } 
                    else 
                    {    
                      vm.allcommune = vm.allcommune.filter(function(obj) {

                        return obj.id !== currentItem.id;
                      });
                    }
                  }
                  else
                  {
                    var item = {
                        nom: commune.nom,
                        code: commune.code,
                        id:String(data.response) ,
                        district_id:commune.district_id ,
                        district_nom:commune.district_nom 
                    };
                      console.log(commune );
                      console.log(item );
                    vm.allcommune.push(item);

                    vm.commune.code='';
                    vm.commune.nom='';
                    vm.commune.district='';
                    
                    NouvelItem=false;
                  }

                  vm.affichageMasque = 0 ;

                })
                .error(function (data) {
                    alert('Error');
                });
                
        }

      //*****************************************************************

     

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
        if (!vm.allcommune) return;
        vm.allcommune.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
          vm.selectedItem.$selected = false;
          vm.affichageMasque = 1 ;
          vm.commune.code='';
          vm.commune.nom='';
          vm.commune.district_id='';
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

          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.commune.id = vm.selectedItem.id ;
          vm.commune.code = vm.selectedItem.code ;
          vm.commune.nom = vm.selectedItem.nom ;
          vm.alldistrict.forEach(function(dist) {
            if(dist.id==vm.selectedItem.district_id) {
              vm.commune.district = dist.id ;
              vm.commune.district_nom = dist.nom ;
            }
          });

          
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau = 0;  

        };

        vm.supprimer = function() 
        {
          vm.afficherboutonModifSupr = 0 ;
          vm.affichageMasque = 0 ;
         var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

          $mdDialog.show(confirm).then(function() {

            ajout(vm.selectedItem,1);
          }, function() {
            //alert('rien');
          });
        };
        
        vm.modifierdistrict = function (item) {
          vm.alldistrict.forEach(function(dist) {
              if(dist.id==item.district_id) {
                 item.district_id = dist.id; 
                 item.district_nom = dist.nom;
                 console.log(item);
              }
          });
        }

        function test_existance (item,suppression) 
        {
           
            if (suppression!=1) 
            {   
                var co = vm.allcommune.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(co[0])
                {
                   if((co[0].nom!=item.nom)
                    ||(co[0].code!=item.code)
                    ||(co[0].district_id!=item.district_id))                    
                      { 
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0;
                      }
                      else
                      {  
                         vm.affichageMasque = 0;
                      }
                }
                /*vm.allcommune.forEach(function(comm) {
                
                  if (comm.id==item.id) 
                  {
                    if((comm.nom!=item.nom)
                    ||(comm.code!=item.code)
                    ||(comm.district_id!=item.district_id))
                    
                    {
                      insert_in_base(item,suppression);
                      vm.affichageMasque = 0 ;
                    }
                    else
                    {
                      vm.affichageMasque = 0 ;
                    }
                  }
                });*/
            }
            else
              insert_in_base(item,suppression);
        }
    }
})();
