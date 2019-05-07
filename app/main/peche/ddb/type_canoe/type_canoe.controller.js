(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.type_canoe')
        .directive('customOnChange', function() {
            return {
              restrict: 'A',
              require:'ngModel',
              link: function (scope, element, attrs,ngModel) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeHandler);
                element.on("change", function(e) {
                var files = element[0].files;
                ngModel.$setViewValue(files);
                })
                }
              };
            })
        .service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
              var fd = new FormData();
              var rep='test';
              fd.append('file', file);
              $http.post(uploadUrl, fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
              }).success(function(){
                 console.log('tafa');
              }).error(function(){
                 console.log('Rivotra');
              });
            }
          }])
        .controller('Type_canoeController', Type_canoeController);
    /** @ngInject */
    function Type_canoeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlserver) 
    {
    	var vm           = this;
    	vm.ajout         = ajout;
      vm.Urlimage      = apiUrlserver;
    	var NouvelItem   =false;
    	var currentItem;
    	vm.selectedItem  = {} ;
    	vm.alltype_canoe = [] ;
        vm.myFile      ={};
    	vm.afficherboutonnouveau = 1 ;
    	vm.affichageMasque = 0 ;
    	vm.dtOptions = {
    		dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
    		pagingType: 'simple',
    		autoWidth: false,
    		responsive: true
    	};
    	//col table
        //vm.table=1;
    	vm.type_canoe_column = [{titre:"Code"},{titre:"Nom"},{titre:"Image"}];
    	
        apiFactory.getAll("type_canoe/index").then(function(result)
        {
    		vm.alltype_canoe = result.data.response;    
    	});
        
        function ajout(type_canoe,suppression)
        {
            if (NouvelItem==false)
            {   
                test_existance (type_canoe,suppression); 
            } 
            else
            {
                insert_in_base(type_canoe,suppression);
            }
        }

        $scope.uploadFile = function(event)
        {   
          var files = event.target.files;
          vm.myFile = files;
          vm.type_canoe.url_image=vm.myFile[0].name;
        }
            
        function insert_in_base(type_canoe,suppression)
        {
            //add
            var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            var getId = 0;
            if (NouvelItem==false)
            {
                getId = vm.selectedItem.id; 
            }
 
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:      type_canoe.code,
                    nom:       type_canoe.nom,
                    url_image: type_canoe.url_image,  
             });
            
            //factory
            apiFactory.add("type_canoe/index",datas, config).success(function (data)
            { 
                var file        = vm.myFile[0];
                var repertoire  = 'type_canoe/';
                var uploadUrl   = apiUrl + "importerfichier/save_upload_file";
                var getIdurl    = 0;
                if (NouvelItem==false)
                {
                  getIdurl = vm.selectedItem.id;

                }else{ 
                 getIdurl = String(data.response);
                }
                
                var name_image = type_canoe.code+'_'+getIdurl;                
                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_image',name_image);

                if(file)
                { 
                    var upl = $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}, repertoire: repertoire
                        }).success(function(data)
                    {
                        if(data['erreur'])
                        {
                            var msg   = data['erreur'].error.replace(/<[^>]*>/g, '');
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            {
                                type_canoe.url_image = '';                 
                                var dataurl = $.param(
                                {
                                    supprimer:        suppression,
                                    id:               getIdurl,      
                                    code:             type_canoe.code,
                                    nom:              type_canoe.nom,
                                    url_image:        type_canoe.url_image,                              
                                });
                                
                                apiFactory.add("type_canoe/index",dataurl,config).success(function(data)
                                {
                                  vm.majtable(type_canoe,getIdurl,suppression);
                                }).error(function (data)
                                    {
                                        alert('Error');
                                    });
                            });              
                        }
                        else
                        {    
                            type_canoe.url_image = repertoire+data['nomImage'];                 
                            var dataurl = $.param(
                            {
                                supprimer: suppression,
                                id:        getIdurl,      
                                code:      type_canoe.code,
                                nom:       type_canoe.nom,
                                url_image: type_canoe.url_image,                              
                            });
                            apiFactory.add("type_canoe/index",dataurl,config).success(function(data)
                            {
                                vm.majtable(type_canoe,getIdurl,suppression);
                            }).error(function (data)
                              {
                                alert('Error');
                              });
                      }
                    
                    }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                }
                else
                {
            			vm.majtable(type_canoe,getIdurl,suppression);
                }
              document.getElementById('fileid').value = null; 
            }).error(function (data) {
                        alert('Error');
                });                
        }

        vm.majtable = function(type_canoe,Id,suppression)
        {
            if (NouvelItem == false)
            {
                // Update or delete: id exclu                 
                if(suppression==0)
                {
                    vm.selectedItem.nom        = vm.type_canoe.nom;
                    vm.selectedItem.code       = vm.type_canoe.code;
                    vm.selectedItem.url_image  = vm.type_canoe.url_image;
                    vm.afficherboutonModifSupr = 0 ;
                    vm.afficherboutonModif     = 0 ;
                    vm.afficherboutonnouveau   = 1 ;
                    vm.selectedItem.$selected  = false;
                    vm.selectedItem            = {};
                } 
                else
                {    
                    vm.alltype_canoe = vm.alltype_canoe.filter(function(obj)
                    {
                        return obj.id !== currentItem.id;
                    });
                }
            } 
            else
            {
                var item = {
                          id:        Id,
                          nom:       type_canoe.nom,
                          code:      type_canoe.code,
                          url_image: type_canoe.url_image,
                          
                      };                
                vm.alltype_canoe.push(item);
                vm.type_canoe = {} ;                   
                NouvelItem    = false;
            }                
            vm.affichageMasque = 0 ;
        }
    		vm.selection= function (item)
        {
      			vm.selectedItem  = item;
      			vm.nouvelItem    = item;
      			currentItem      = JSON.parse(JSON.stringify(vm.selectedItem));
      			vm.afficherboutonModifSupr = 1 ;
            vm.afficherboutonModif     = 1 ;
      			vm.affichageMasque         = 0 ;
      			vm.afficherboutonnouveau   = 1 ;
    		};
    		$scope.$watch('vm.selectedItem', function()
        {
      			if (!vm.alltype_canoe) return;
      			vm.alltype_canoe.forEach(function(item)
            {
      				item.$selected = false;
      			});
      			vm.selectedItem.$selected = true;
    		});
        
        //function cache masque de saisie
        vm.ajouter = function ()
        {
      			vm.selectedItem.$selected  = false;
      			vm.affichageMasque         = 1 ;
      			vm.type_canoe              = {} ;
      			NouvelItem                 = true ;
            vm.afficherboutonModifSupr = 0;
            vm.afficherboutonModif     = 0 ;
            vm.afficherboutonnouveau   = 1;
        };
        
        vm.annuler = function()
        {
            vm.selectedItem             = {} ;
            vm.selectedItem.$selected   = false;
            vm.affichageMasque          = 0 ;
            vm.afficherboutonnouveau    = 1 ;
            vm.afficherboutonModifSupr  = 0 ;
            vm.afficherboutonModif      = 0 ;
            NouvelItem                  = false;
            document.getElementById('fileid').value = null;
        };
        
        vm.modifier = function()
        {
            NouvelItem          = false ;
            vm.affichageMasque  = 1 ;
            vm.type_canoe.id    = vm.selectedItem.id ;
            vm.type_canoe.code  = vm.selectedItem.code ;
            vm.type_canoe.nom   = vm.selectedItem.nom ;
            vm.type_canoe.url_image    = vm.selectedItem.url_image;
            vm.afficherboutonModifSupr = 0;
            vm.afficherboutonModif     = 1 ;
            vm.afficherboutonnouveau   = 0; 
        };
        
        vm.supprimer = function()
        {
            vm.affichageMasque         = 0 ;
            vm.afficherboutonModifSupr = 0 ;
            vm.afficherboutonModif     = 0 ;
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
                var tc = vm.alltype_canoe.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(tc[0])
                {
                   if((tc[0].id!=item.id)
                       ||(tc[0].code!=item.code)
                       ||(tc[0].nom!=item.nom)
                       ||(tc[0].url_image!=item.url_image))                    
                      { 
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0;
                      }
                      else
                      {  
                         vm.affichageMasque = 0;
                      }
                }
               /* vm.alltype_canoe.forEach(function(reg)
                {               
        			if (reg.id==item.id)
                     {
        				insert_in_base(item,suppression);
        				vm.affichageMasque = 0 ;
        			} 
                    else
                    {
        				vm.affichageMasque = 0 ;
        			}
    			})*/
            } else
                  insert_in_base(item,suppression);
        }
        vm.changelocalhost = function (localhoste)
        {
            if (localhoste) 
            {
              var urlencien = localhoste;
              var urlnew    = urlencien.toString().replace('http://localhost/assets/ddb/',apiUrlserver);
            
              return urlnew;
            }
             
        }
    }
})();
