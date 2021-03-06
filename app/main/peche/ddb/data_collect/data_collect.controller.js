(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.data_collect')
        .controller('Data_collectController', DatacollectController);
    
    /** @ngInject */
    function DatacollectController($mdDialog, $scope, apiFactory, $state)  
    {
  		var vm   = this;
  		vm.ajout = ajout ;  		
  		var currentItem;
      var NouvelItem     = false;
  		vm.selectedItem    = {} ;
  		vm.alldata_collect = [] ;
      vm.affichageMasque = 0 ;          //variable cache masque de saisie
  		vm.afficherboutonnouveau = 1 ;    //variale affichage bouton nouveau 	
      vm.titrepage='';
//style
      vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true
      };

//col table
      vm.data_collect_column = [{titre:"Code"},{titre:"Libelle"}];

      apiFactory.getAll("data_collect/index").then(function(result)
      { vm.alldata_collect = result.data.response;    
      });

      function ajout(data_collect,suppression)
      {
        if (NouvelItem==false)
        {
          test_existance (data_collect,suppression); 
        } 
        else
        {
          insert_in_base(data_collect,suppression);
        }
      }
 
 //add     
      function insert_in_base(data_collect,suppression) 
      {        
          var config =
          {
            headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
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
            code: data_collect.code,
            libelle: data_collect.libelle,                              
          });
        
//factory
        apiFactory.add("data_collect/index",datas, config).success(function (data)
        {
          if (NouvelItem == false)
          {
           // Update or delete: id exclu                 
            if(suppression==0)
            {
              vm.selectedItem.libelle    = vm.data_collect.libelle;
              vm.selectedItem.code       = vm.data_collect.code;					
              vm.afficherboutonModifSupr = 0 ;
              vm.afficherboutonnouveau   = 1 ;
              vm.selectedItem.$selected  = false;
              vm.selectedItem ={};
            } 
            else
            {    
            	vm.alldata_collect = vm.alldata_collect.filter(function(obj)
              {
            		return obj.id !== currentItem.id;
            	});
            }
          } 
          else 
          {
            var item =
            {
              libelle: data_collect.libelle,
              code:    data_collect.code,
              id:      String(data.response)                       
            };              
            vm.alldata_collect.push(item);
            vm.data_collect = {} ;                   
            NouvelItem      =false;
          }
          vm.affichageMasque = 0 ;
        }).error(function (data) {alert('Error');});                
      }
  		
      vm.selection= function (item)
      {
  			vm.selectedItem = item;
  			vm.nouvelItem   = item;
  			currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
  			vm.afficherboutonModifSupr = 1 ;
  			vm.affichageMasque         = 0 ;
  			vm.afficherboutonnouveau   = 1 ;
  		};
  		
      $scope.$watch('vm.selectedItem', function()
      {
  			if (!vm.alldata_collect) return;
  			vm.alldata_collect.forEach(function(item) 
        {
  				item.$selected = false;
  			});
  			vm.selectedItem.$selected = true;
  		});
      
      //function cache masque de saisie
      vm.ajouter = function ()
      {
  			vm.selectedItem.$selected = false;
  			vm.affichageMasque        = 1 ;
  			vm.data_collect           = {} ;
  			NouvelItem                = true ;
        vm.titrepage="Ajout d'effort de pêche"
      };
      
      vm.annuler = function()
      {
        NouvelItem                 = false;
        vm.selectedItem            = {} ;        
        vm.affichageMasque         = 0 ;
        vm.selectedItem.$selected  = false;        
        vm.afficherboutonnouveau   = 1 ;
        vm.afficherboutonModifSupr = 0 ;        
      };
       
      vm.modifier = function()
      {
          NouvelItem                 = false ;
          vm.affichageMasque         = 1 ;
          vm.data_collect.id         = vm.selectedItem.id ;
          vm.data_collect.code       = vm.selectedItem.code ;
          vm.data_collect.libelle    = vm.selectedItem.libelle ;		 
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonnouveau   = 0;
          vm.titrepage="modification d'effort de pêche"  
      };
        vm.supprimer = function()
        {
          vm.affichageMasque         = 0 ;
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
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {   
              var dc = vm.alldata_collect.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(dc[0])
                {
                   if((dc[0].id!=item.id)
                        ||(dc[0].code!=item.code)
                        ||(dc[0].libelle!=item.libelle))                    
                      { 
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0;
                      }
                      else
                      {  
                         vm.affichageMasque = 0;
                      }
                }
            }  else
              insert_in_base(item,suppression);
        }
    }
})();
