(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.type_engin')
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
        .controller('Type_enginController', Type_enginController);
    /** @ngInject */
    function Type_enginController($mdDialog, $scope, apiFactory, $state,apiUrl,apiUrlserver,$http)
    {
  		var vm                  = this;
  		vm.ajout                = ajout ;
  		var NouvelItem          =false;
  		var currentItem;
  		vm.selectedItem         = {} ;
  		vm.alltype_engin        = [] ; 		
  		vm.afficherboutonnouveau= 1 ; //variale affichage bouton nouveau		
  		vm.affichageMasque      = 0 ; //variable cache masque de saisie
  		
      //style
  		vm.dtOptions = {
  			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
  			pagingType: 'simple',
  			autoWidth: false,
  			responsive: true
  		};
  		//col table
  		vm.type_engin_column = [{titre:"Code"},{titre:"libelle"}];
      
  		apiFactory.getAll("type_engin/index").then(function(result) {
  			vm.alltype_engin = result.data.response;    
  		});
      
      $scope.uploadFile = function(event)
      {   
          var files =event.target.files;
          vm.myFile=files;
          vm.type_engin.url_image=vm.myFile[0].name;
      }  
      
      function ajout(type_engin,suppression)
      {
          if (NouvelItem==false)
          {
              test_existance (type_engin,suppression); 
          } 
          else 
          {
              insert_in_base(type_engin,suppression);
          }
      }
      
      function insert_in_base(type_engin,suppression)
      {
        //add
          var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
          var getId = 0;
          if (NouvelItem==false)
          {
              getId = vm.selectedItem.id; 
          } 
          var datas = $.param({
                supprimer:suppression,
                id:getId,      
                code: type_engin.code,
                libelle: type_engin.libelle,
                url_image: type_engin.url_image,                              
          });
          console.log(datas);
        //factory
        apiFactory.add("type_engin/index",datas, config).success(function (data)
        {
            var file       = vm.myFile[0];
            var repertoire = 'type_engin/';
            var uploadUrl  = apiUrl + "importerfichier/save_upload_file";
            var getIdurl   = 0;
            
            if (NouvelItem==false)
            {
                getIdurl = vm.selectedItem.id;

            }
            else
            { 
                getIdurl=String(data.response);
            }

            var name_image=type_engin.code+'_'+getIdurl;
            var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_image',name_image);

            if(file)
            { 
                var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                                    headers: {'Content-Type': undefined}, repertoire: repertoire})
                .success(function(data)
                {
                    if(data['erreur'])
                    {
                        var msg   = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function(){});              
                    }
                    else
                    {
                        type_engin.url_image=apiUrlserver+repertoire+data['nomImage'];                 
                        var dataurl = $.param(
                        {
                            supprimer:        suppression,
                            id:               getIdurl,      
                            code:             type_engin.code,
                            libelle:          type_engin.libelle,
                            url_image:        type_engin.url_image,                              
                        });
                        
                        apiFactory.add("type_engin/index",dataurl,config).success(function(data)
                        {
                            if (NouvelItem == false)
                            {
                                // Update or delete: id exclu                 
                                if(suppression==0)
                                {
                                    vm.selectedItem.libelle        = vm.type_engin.libelle;
                                    vm.selectedItem.code       = vm.type_engin.code;
                                    vm.selectedItem.url_image  = vm.type_engin.url_image;
                                    vm.afficherboutonModifSupr = 0 ;
                                    vm.afficherboutonnouveau   = 1 ;
                                    vm.selectedItem.$selected  = false;
                                    vm.selectedItem            ={};
                                      } 
                                      else
                                      {    
                                          vm.alltype_engin = vm.alltype_engin.filter(function(obj)
                                          {
                                              return obj.id !== currentItem.id;
                                          });
                                      }
                                  } 
                                  else
                                  {
                                      var item = {
                                          libelle: type_engin.libelle,
                                          code: type_engin.code,
                                          url_image: type_engin.url_image,
                                          id:getIdurl,
                                      };                
                                      vm.alltype_engin.push(item);
                                      vm.type_engin = {} ;                   
                                      NouvelItem=false;
                                  } 
                                  vm.affichageMasque = 0 ;
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
        				if (NouvelItem == false)
                {
                  // Update or delete: id exclu                 
                  if(suppression==0)
                  {
        						vm.selectedItem.libelle = vm.type_engin.libelle;
        						vm.selectedItem.code = vm.type_engin.code;
        						vm.afficherboutonModifSupr = 0 ;
        						vm.afficherboutonnouveau = 1 ;
        						vm.selectedItem.$selected = false;
        						vm.selectedItem ={};
                   
                  }
                  else
                  {    
        						  vm.alltype_engin = vm.alltype_engin.filter(function(obj)
                      {
        							return obj.id !== currentItem.id;
        						  });
                  }
        				}
                else
                {
                    var item = {
                          libelle: type_engin.libelle,
                          code: type_engin.code,
                          id:String(data.response),
                    };                
                    vm.alltype_engin.push(item);
                    vm.type_engin = {} ;                   
                    NouvelItem=false;
  				      }
  					   vm.affichageMasque = 0 ;
            }
              
            document.getElementById('fileid').value = null;  
        }).error(function (data)
        {
            alert('Error');
        });                
    }
  		
    vm.selection= function (item)
    {
  			vm.selectedItem            = item;
  			vm.nouvelItem              = item;
  			currentItem                = JSON.parse(JSON.stringify(vm.selectedItem));
  			vm.afficherboutonModifSupr = 1 ;
  			vm.affichageMasque         = 0 ;
  			vm.afficherboutonnouveau   = 1 ;
  	};
  		
    $scope.$watch('vm.selectedItem', function()
    {
  			if (!vm.alltype_engin) return;
  			vm.alltype_engin.forEach(function(item)
        {
  				  item.$selected = false;
  			});
  			vm.selectedItem.$selected = true;
  	});
    
    //function cache masque de saisie
    vm.ajouter = function ()
    {
  			vm.selectedItem.$selected = false;
  			vm.affichageMasque = 1 ;
        //vm.table=0;
  			vm.type_engin = {} ;
  			NouvelItem = true ;
    };
    
    vm.annuler = function()
    {
        vm.selectedItem            = {} ;
        vm.selectedItem.$selected  = false;
        vm.affichageMasque         = 0 ;
        vm.afficherboutonnouveau   = 1 ;
        vm.afficherboutonModifSupr = 0 ;
        NouvelItem                 = false;
    };
    
    vm.modifier = function()
    {
        NouvelItem                 = false ;
        vm.affichageMasque         = 1 ;
        vm.type_engin.id           = vm.selectedItem.id ;
        vm.type_engin.code         = vm.selectedItem.code ;
        vm.type_engin.libelle      = vm.selectedItem.libelle ;
        vm.type_engin.url_image = vm.selectedItem.url_image;
        vm.afficherboutonModifSupr = 0;
        vm.afficherboutonnouveau   = 0;  
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
        $mdDialog.show(confirm).then(function()
        {
            vm.ajout(vm.selectedItem,1);
        }, function()
          {
              //alert('rien');
          });
    };
    
    function test_existance (item,suppression)
    {          
        if (suppression!=1)
        {            
            var te = vm.alltype_engin.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(te[0])
                {
                   if((te[0].id!=item.id)
                       ||(te[0].code!=item.code)
                       ||(te[0].libelle!=item.libelle)
                       ||(te[0].url_image!=item.url_image))                    
                      { 
                         insert_in_base(item,suppression);
                         vm.affichageMasque = 0;
                      }
                      else
                      {  
                         vm.affichageMasque = 0;
                      }
                }
            /*vm.alltype_engin.forEach(function(reg)
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
        }
        else
            insert_in_base(item,suppression);
    }

    vm.changelocalhost = function (localhoste)
    {
        if (localhoste) 
        {
            var urlencien=localhoste;
            var urlnew= urlencien.toString().replace('http://localhost/assets/ddb/',apiUrlserver);
            
            return urlnew;
        }             
    }
  }
})();
