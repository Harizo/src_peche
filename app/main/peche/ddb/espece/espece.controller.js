(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.espece')
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
        .directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;        
          element.bind('change', function(){
            scope.$apply(function(){
              //modelSetter(scope, element[0].files[0]);
               //console.log(element[0].files[0]);

            });
          });
        }
      };
    }])
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
        .controller('EspeceController', EspeceController);
    /** @ngInject */
    function EspeceController($mdDialog, $scope, apiFactory, $state,cookieService,apiUrl,$http,apiUrlserver,$window)
    { var vm                   = this;
  		vm.ajout                 = ajout;
      vm.apiUrlimage          =apiUrlserver;
  		var NouvelItem           =false;
  		var currentItem;
  		vm.selectedItem          = {} ;
  		vm.allespece             = [] ;
      vm.myFile={}; 
      //vm.url_image_par_defaut=apiUrlserver+'/espece';   
  		//variale affichage bouton nouveau
  		vm.afficherboutonnouveau = 1 ;
  		//variable cache masque de saisie
  		vm.affichageMasque       = 0 ;
      vm.affichageMasqueImage  = 0;
  		//style
  		vm.dtOptions =
      {
  			dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
  			pagingType: 'simple',
  			autoWidth : false,
  			responsive: true
  		};
  		//col table
      
  		vm.espece_column =
      [
        {titre:"Code 3 Alpha"},
        {titre:"Nom local"},
        {titre:"Nom scientifique"},
        {titre:"Image"}
      ];
  		
      apiFactory.getAll("espece/index").then(function(result)
      {
  			vm.allespece = result.data.response;
  		});

      function ajout(espece,suppression)
        { if (NouvelItem==false)
            {
              test_existance (espece,suppression); 
            } 
            else 
            {
              insert_in_base(espece,suppression);
            }
        }
      $scope.uploadFile = function(event)
       {
         // console.dir(event);
          var files =event.target.files;
          vm.myFile=files;
          vm.espece.url_image=vm.myFile[0].name;
        }  
      
      function insert_in_base(espece,suppression)
      {   
        var config ={ headers :{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var getId = 0;
        if (NouvelItem==false)
        {
            getId = vm.selectedItem.id;
        }
       
        var datas = $.param(
        {
            supprimer:        suppression,
            id:               getId,      
            code:             espece.code,
            nom_local:        espece.nom_local,
            nom_scientifique: espece.nom_scientifique,
            url_image:        espece.url_image,
            repertoire:       espece.url_image
                                       
        });
            //factory
        apiFactory.add("espece/index",datas, config).success(function (data)
        { 
            var file = vm.myFile[0];
            var repertoire = 'espece/';
            var uploadUrl = apiUrl + "importerfichier/save_upload_file";
            var getIdurl=0;
            
            if (NouvelItem==false)
            {
              getIdurl = vm.selectedItem.id;

            }else{ 
             getIdurl=String(data.response);
            }
            var name_image=espece.code+'_'+getIdurl;
            
            var fd = new FormData();
            fd.append('file', file);
            fd.append('repertoire',repertoire);
            fd.append('name_image',name_image);
            if(file)
            { 
                var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                headers: {'Content-Type': undefined}, repertoire: repertoire
                }).success(function(data)
                {
                    if(data['erreur'])
                    {
                      var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                      var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                      $mdDialog.show( alert ).finally(function()
                      {   
                          espece.url_image='';                
                          var dataurl = $.param(
                          {
                              supprimer:        suppression,
                              id:               getIdurl,      
                              code:             espece.code,
                              nom_local:        espece.nom_local,
                              nom_scientifique: espece.nom_scientifique, 
                              url_image:        espece.url_image,                              
                          });
                          
                          apiFactory.add("espece/index",dataurl,config).success(function(data)
                          { 
                            vm.majtable(espece,getIdurl,suppression);
                          }).error(function (data)
                              {
                                  alert('Error');
                              });
                      });              
                    }
                    else
                    { 
                      espece.url_image=repertoire+data['nomImage'];                
                      var dataurl = $.param(
                      {
                          supprimer:        suppression,
                          id:               getIdurl,      
                          code:             espece.code,
                          nom_local:        espece.nom_local,
                          nom_scientifique: espece.nom_scientifique, 
                          url_image:        espece.url_image,                              
                      });
                      
                      apiFactory.add("espece/index",dataurl,config).success(function(data)
                      {   
                        vm.majtable(espece,getIdurl,suppression);                       
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
            vm.majtable(espece,getIdurl,suppression);
            }
          document.getElementById('fileid').value = null;
        }).error(function (data)
          {
            alert('Error');
          });                
      }
      vm.majtable=function(espece,Id,suppression)
      {
        if (NouvelItem == false)
            { if(suppression == 0)
              { vm.selectedItem.nom_local        = vm.espece.nom_local;
                vm.selectedItem.nom_scientifique = vm.espece.nom_scientifique;
                vm.selectedItem.code             = vm.espece.code;
                vm.selectedItem.url_image        = vm.espece.url_image;
                vm.afficherboutonModifSupr       = 0;
                vm.afficherboutonnouveau         = 1;
                vm.selectedItem.$selected        = false;
                vm.selectedItem                  ={};            
              }
              else
              {    
                vm.allespece = vm.allespece.filter(function(obj)
                {
                  return obj.id !== currentItem.id;
                });
              }
            }
            else
            { var item =
                  { nom_local:        espece.nom_local,
                    nom_scientifique: espece.nom_scientifique,
                    code:             espece.code,
                    url_image:        espece.url_image,
                    id:               Id,
                  };                
                  vm.allespece.push(item);
                  vm.espece  = {} ;                   
                   NouvelItem = false;
            }
            vm.affichageMasque = 0;
      }
  //*****************************************************************
		vm.selection= function (item)
    {	vm.selectedItem                        = item;
  		vm.nouvelItem                          = item;
  		currentItem                            = JSON.parse(JSON.stringify(vm.selectedItem));
  		vm.afficherboutonModifSupr             = 1;
  		vm.affichageMasque                     = 0;
  		vm.afficherboutonnouveau               = 1;
		};
		
    $scope.$watch('vm.selectedItem', function()
    {	if (!vm.allespece) return;
			vm.allespece.forEach(function(item)
      {
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;
		});

    //function cache masque de saisie
    vm.ajouter = function ()
    { vm.selectedItem.$selected = false;
  		vm.affichageMasque        = 1;
      vm.espece                 = {};
  		NouvelItem                = true;
    };
    vm.ajouterImage = function ()
    { vm.affichageMasqueImage        = 1;  
    };

    vm.annuler = function()
    { vm.selectedItem            = {};
      vm.selectedItem.$selected  = false;
      vm.affichageMasque         = 0;
      vm.afficherboutonnouveau   = 1;
      vm.afficherboutonModifSupr = 0;          
      NouvelItem                 = false;
      vm.affichageMasqueImage    = 0;
      document.getElementById('fileid').value = null;
    };

    vm.modifier = function()
    { NouvelItem                 = false ;
      vm.affichageMasque         = 1;
      vm.espece.id               = vm.selectedItem.id ;
      vm.espece.code             = vm.selectedItem.code ;
      vm.espece.nom_local        = vm.selectedItem.nom_local ;
      vm.espece.nom_scientifique = vm.selectedItem.nom_scientifique ;
      vm.espece.url_image        = vm.selectedItem.url_image;
      vm.afficherboutonModifSupr = 0;
      vm.afficherboutonnouveau   = 0;
     
    };
 
    vm.supprimer = function()
    { vm.affichageMasque         = 0;
      vm.afficherboutonModifSupr = 0;
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
    { if (suppression!=1)
      { 
        var esp = vm.allespece.filter(function(obj)
        {
            return obj.id == item.id;
        });
        
        if(esp[0])
        {
            if (esp[0].id==item.id)
            { 
              if((esp[0].code!=item.code)
                ||(esp[0].nom_local!=item.nom_local)
                ||(esp[0].nom_scientifique!=item.nom_scientifique)
                ||(esp[0].url_image!=item.url_image))                    
              { 
                  insert_in_base(item,suppression);
                  vm.affichageMasque = 0;
              }
            else
            {  
                vm.affichageMasque = 0;
            }
          }
        } 
        /*vm.allespece.forEach(function(esp)
          { if (esp.id==item.id)
            { if((esp.code!=item.code)
                ||(esp.nom_local!=item.nom_local)
                ||(esp.nom_scientifique!=item.nom_scientifique)
                ||(esp.url_image!=item.url_image))
              {
                insert_in_base(item,suppression);
                vm.affichageMasque = 0;
              }
              else
              {
                vm.affichageMasque = 1;
              }
						}
					});*/
      }
      else
          insert_in_base(item,suppression);
    }

/*vm.changelocalhost = function (localhoste)
{
  if (localhoste) 
  {
    var urlencien=localhoste;
    var urlnew= urlencien.toString().replace('http://localhost/assets/ddb/',apiUrlserver);
  
    return urlnew;
  }
   
}*/
    }
})();
