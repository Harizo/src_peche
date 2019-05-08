(function ()
{
    'use strict';

    angular
        .module('app.peche.ddb.site_embarquement')
        .controller('Site_embarquementController', Site_embarquementController);

    /** @ngInject */
    function Site_embarquementController($mdDialog, $scope, $location, apiFactory, $cookieStore)
    {
      var vm   = this;
      vm.ajout = ajout ;
      vm.ajoutsite_enqueteur   = ajoutsite_enqueteur ;
      vm.ajoutunite_peche_site = ajoutunite_peche_site ;
      var NouvelItem                 = false;
      var NouvelItemsite_enqueteur   = false;
      var NouvelItemunite_peche_site = false;
      var currentItem;
      var currentItemsite_enqueteur;
      var currentItemunite_peche_site;

      vm.selectedItem                 = {} ;
      vm.selectedItemsite_enqueteur   = {} ;
      vm.allsite_embarquement         = [] ;
      vm.selectedItemunite_peche_site = {} ;
      vm.allsite_enqueteur            = [] ;
      vm.allunite_peche_site          = [] ;
      vm.allcurrentdistrict           = [];
      vm.site_enqueteur               = {};
      

      //variale affichage bouton nouveau
      vm.afficherboutonnouveau                 = 1 ;
      vm.afficherboutonnouveausite_enqueteur   = 1 ;
      vm.afficherboutonnouveauunite_peche_site = 1 ;

      //variable cache masque de saisie
      vm.affichageMasque                 = 0 ;
      vm.affichageMasquesite_enqueteur   = 0 ;
      vm.affichageMasqueunite_peche_site = 0 ;

      //step
      vm.step1 = false;
      vm.step2 = false;
      vm.step  = [{step:1},{step:2},{step:3}];
      //style
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true
    };

    //col table
    vm.site_embarquement_column = [
      {
        titre:"Code"
      },
      {
        titre:"Libelle"
      }/*,
      {
        titre:"Code unique"
      }*/,
      {
        titre:"Region"
      },
      {
        titre:"District"
      },
      {
        titre:"Latitude"
      },
      {
        titre:"Longitude"
      },
      {
        titre:"Altitude"
      },
      {
        titre:"Limite"
      },
      {
        titre:"Type d'effort"
      }
    ];

    //col table site_enqueteur
    vm.site_enqueteur_column = [
      {
        titre:"Nom"
      },
      {
        titre:"Prenom"
      },
       {
        titre:"Téléphone"
      }
    ];
//col table unite_peche_site
    vm.unite_peche_site_column = [    
         {
           titre:"Libelle"
         },
         {
           titre:'Type engin'
         },
         {
           titre:"Type canoe"
         },
         {
           titre:"Nombre echantillon"
         }
         
      ];
    
    apiFactory.getAll("district/index").then(function(result)
    {
      vm.alldistrict = result.data.response;
      vm.allcurrentdistrict=vm.alldistrict;
    });

    apiFactory.getAll("region/index").then(function(result)
      {
        vm.allregion= result.data.response;
      });

    apiFactory.getAll("site_embarquement/index").then(function(result){
      vm.allsite_embarquement = result.data.response;

    });
    apiFactory.getAll("enqueteur/index").then(function(result)
    {
        vm.allenqueteur = result.data.response;
    });
    
   /*  apiFactory.getAll("type_canoe/index").then(function(result)
      {
         vm.alltype_canoe = result.data.response;
      });

      apiFactory.getAll("type_engin/index").then(function(result)
      {
         vm.alltype_engin= result.data.response;
      });*/
       apiFactory.getAll("unite_peche/index").then(function(result)
    {
        vm.allunite_peche = result.data.response;
    });
/*********** ************************Debut site d'embarquement  *******************************************/     
        
        function ajout(site_embarquement,suppression)   
        {
              if (NouvelItem==false) 
              {
                test_existance (site_embarquement,suppression); 
              }
              else
              {
                insert_in_base(site_embarquement,suppression);
              }   
            
        }

        function insert_in_base(site_embarquement,suppression)
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
                supprimer:         suppression,
                id:                getId,      
                code:              site_embarquement.code,
                libelle:           site_embarquement.libelle,
                code_unique:       site_embarquement.code_unique,
                latitude:          site_embarquement.latitude,
                longitude:         site_embarquement.longitude,
                altitude:          site_embarquement.altitude,
                region_id:         site_embarquement.region_id,
                district_id:       site_embarquement.district_id,
                limite:            site_embarquement.limite,
                type_effort_peche: site_embarquement.type_effort_peche
                
            });
            //factory
            apiFactory.add("site_embarquement/index",datas, config).success(function (data)
            {
              var reg = vm.allregion.filter(function(obj)
               {
                  return obj.id == vm.site_embarquement.region_id;
               });

               var dist = vm.alldistrict.filter(function(obj)
               {
                  return obj.id == vm.site_embarquement.district_id;
               });
                  
                  vm.allcurrentdistrict=vm.alldistrict;
                  if (NouvelItem == false) 
                  {
                    // Update or delete: id exclu
                    
                    if(suppression==0) 
                    { 
                      vm.selectedItem.type_effort_peche = vm.site_embarquement.type_effort_peche;
                      vm.selectedItem.code_unique       = vm.site_embarquement.code_unique;                     
                      vm.selectedItem.code      = vm.site_embarquement.code;
                      vm.selectedItem.libelle   = vm.site_embarquement.libelle;
                      vm.selectedItem.latitude  = vm.site_embarquement.latitude;
                      vm.selectedItem.longitude = vm.site_embarquement.longitude;
                      vm.selectedItem.altitude  = vm.site_embarquement.altitude;
                      vm.selectedItem.limite    = vm.site_embarquement.limite;
                      vm.selectedItem.region    = reg[0];
                      vm.selectedItem.district  = dist[0];
                      vm.afficherboutonModifSupr= 0 ;
                      vm.afficherboutonModif    = 0 ;
                      vm.afficherboutonnouveau  = 1 ;
                      vm.selectedItem.$selected = false;
                      vm.selectedItem ={};
                    } 
                    else 
                    {    
                      vm.allsite_embarquement = vm.allsite_embarquement.filter(function(obj) {

                        return obj.id !== currentItem.id;
                      });
                    }
                  }
                  else
                  {
                    var item = {
                        code:        site_embarquement.code,
                        libelle:     site_embarquement.libelle,
                        code_unique: site_embarquement.code_unique,
                        latitude:    site_embarquement.latitude,
                        longitude:   site_embarquement.longitude,
                        altitude:    site_embarquement.altitude,
                        limite:      site_embarquement.limite,
                        region:      reg[0],
                        id:          String(data.response) ,
                        district:    dist[0],
                        type_effort_peche:site_embarquement.type_effort_peche
                    };
       
                    vm.allsite_embarquement.push(item);
                    vm.site_embarquement={};
                    
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
           if(currentItem != vm.selectedItem)
          {
            vm.step1 = false;
            vm.step2 = false;
            vm.step3 = false;
          }
          vm.selectedItem = item;
          vm.nouvelItem   = item;          
          currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
          vm.afficherboutonModifSupr = 1 ;
          vm.afficherboutonModif     = 1 ;
          vm.affichageMasque         = 0 ;
          vm.afficherboutonnouveau   = 1 ;
          vm.afficherboutonModifSuprsite_enqueteur = 0 ;
          vm.afficherboutonModifsite_enqueteur     = 0 ;
          vm.affichageMasquesite_enqueteur         = 0 ;
         
          apiFactory.getFilsEnqueteur("site_enqueteur/index",item.id).then(function(result)
          {
              vm.allsite_enqueteur = result.data.response;
              
          });
          apiFactory.getFilsSiteCanoeEngin("unite_peche_site/index",item.id).then(function(result)
          {
              vm.allunite_peche_site = result.data.response;
                         
          });
          vm.step1=true;
      };

      $scope.$watch('vm.selectedItem', function() {
        if (!vm.allsite_embarquement) return;
        vm.allsite_embarquement.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItem.$selected = true;
      });

      //function cache masque de saisie
        vm.ajouter = function () 
        {
          vm.selectedItem.$selected = false;
          vm.affichageMasque        = 1 ;
          vm.site_embarquement      = {};
          NouvelItem                = true ;
          vm.site_embarquement.type_effort_peche = 0;
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
          vm.allcurrentdistrict       = vm.alldistrict;
        };

        vm.modifier = function() 
        {

          NouvelItem = false ;
          vm.affichageMasque = 1 ;
          vm.site_embarquement.id          = vm.selectedItem.id ;
          vm.site_embarquement.code        = vm.selectedItem.code ;        
          vm.site_embarquement.libelle     = vm.selectedItem.libelle;
          vm.site_embarquement.code_unique = vm.selectedItem.code_unique;
          vm.site_embarquement.limite      = parseInt(vm.selectedItem.limite);
          vm.site_embarquement.type_effort_peche = vm.selectedItem.type_effort_peche;
          vm.afficherboutonModifSupr = 0;
          vm.afficherboutonModif     = 1 ;
          vm.afficherboutonnouveau   = 0; 
          vm.allcurrentdistrict = vm.alldistrict.filter(function(obj)
            {                 
                return obj.region.id == vm.selectedItem.region.id;
            }); 

          vm.site_embarquement.latitude    = vm.selectedItem.latitude;
          vm.site_embarquement.longitude   = vm.selectedItem.longitude;
          vm.site_embarquement.altitude    = vm.selectedItem.altitude;
          vm.site_embarquement.region_id   = vm.selectedItem.region.id;
          vm.site_embarquement.district_id = vm.selectedItem.district.id;
        };

        vm.supprimer = function() 
        {
          vm.afficherboutonModifSupr = 0 ;
          vm.afficherboutonModif     = 0 ;
          vm.affichageMasque = 0 ;

          if(vm.allsite_enqueteur=='' && vm.allunite_peche_site==''){
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
          }
          else
          {
             
              var confirm = $mdDialog.confirm()
                    .title('vous devez d\'abord supprimmer l\'enqueteur et\\ou l\'unité de pêche')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');

              $mdDialog.show(confirm).then(function() {

              }, function() {
                //alert('rien');
              });
          }
        };
                
        vm.modifierregion = function (item) 
        {            
            vm.allcurrentdistrict = vm.alldistrict.filter(function(obj)
            {                 
                return obj.region.id == item.region_id;
            });
             
        
        }


        function test_existance (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allsite_embarquement.forEach(function(comm) {
                
                  if (comm.id==item.id) 
                  {
                    if((comm.code!=item.code)
                    ||(comm.code_unique!=item.code_unique)
                    ||(comm.latitude!=item.latitude)
                    ||(comm.longitude!=item.longitude)
                    ||(comm.altitude!=item.altitude)
                    ||(comm.libelle!=item.libelle)
                    ||(comm.region.id!=item.region_id)
                    ||(comm.district.id!=item.district_id)
                    ||(comm.limite!=item.limite)
                    ||(comm.type_effort_peche!=item.type_effort_peche))
                    
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

/*********** ************************Fin site d'embarquement  *******************************************/     
 

 /*********** ************************Debut site_enqueteur  *******************************************/     
 
        //selection sur la liste
      vm.selectionsite_enqueteur= function (item) { 
          vm.selectedItemsite_enqueteur = item;
          vm.NouvelItemsite_enqueteur   = item;
          currentItemsite_enqueteur     = JSON.parse(JSON.stringify(vm.selectedItemsite_enqueteur));
          vm.afficherboutonModifSuprsite_enqueteur  = 1 ;
          vm.afficherboutonModifsite_enqueteur      = 1 ;
          vm.affichageMasquesite_enqueteur          = 0 ;
          vm.afficherboutonnouveausite_enqueteur    = 1 ;
          vm.step2 = true;
          
      };

      $scope.$watch('vm.selectedItemsite_enqueteur', function() {
        if (!vm.allsite_enqueteur) return;
        vm.allsite_enqueteur.forEach(function(item) {
            item.$selected = false;
        });
        vm.selectedItemsite_enqueteur.$selected = true;
      });

      //function cache masque de saisie
        vm.ajoutersite_enqueteur = function () 
        {
          vm.titrepage="Ajout site_enqueteur";
          vm.selectedItemsite_enqueteur.$selected = false;
          vm.affichageMasquesite_enqueteur = 1 ;
          vm.site_enqueteur={};
          NouvelItemsite_enqueteur = true ;

        };

        function ajoutsite_enqueteur(site_enqueteur,suppression)   
        {
              if (NouvelItemsite_enqueteur==false) 
              {
                test_existancesite_enqueteur (site_enqueteur,suppression); 
              }
              else
              {
                insert_in_basesite_enqueteur(site_enqueteur,suppression);
              }     
            
        }
        vm.modifiersite_enqueteur = function() 
        { 
          vm.titrepage="Modifier site_enqueteur";
          NouvelItemsite_enqueteur = false ;
          vm.affichageMasquesite_enqueteur = 1 ;

          vm.site_enqueteur.id                  = vm.selectedItemsite_enqueteur.id;
          vm.site_enqueteur.enqueteur_id        = vm.selectedItemsite_enqueteur.enqueteur.id;
          vm.site_enqueteur.enqueteur_telephone = vm.selectedItemsite_enqueteur.enqueteur.telephone;
          vm.site_enqueteur.enqueteur_prenom    = vm.selectedItemsite_enqueteur.enqueteur.prenom;  
          vm.afficherboutonModifSuprsite_enqueteur  = 0;
          vm.afficherboutonModifsite_enqueteur      = 1;
          vm.afficherboutonnouveausite_enqueteur    = 0;  

        };
        vm.annulersite_enqueteur = function() 
        {
          vm.selectedItemsite_enqueteur             = {} ;
          vm.selectedItemsite_enqueteur.$selected   = false;
          vm.affichageMasquesite_enqueteur          = 0 ;
          vm.afficherboutonnouveausite_enqueteur    = 1 ;
          vm.afficherboutonModifSuprsite_enqueteur  = 0 ;
          vm.afficherboutonModifsite_enqueteur      = 0;
          NouvelItemsite_enqueteur                  = false;

        };
        vm.supprimersite_enqueteur = function() 
        {
          vm.affichageMasquesite_enqueteur          = 0 ;
          vm.afficherboutonModifSuprsite_enqueteur  = 0 ;
          vm.afficherboutonModifsite_enqueteur      = 0;
         var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('ok')
                .cancel('annuler');

          $mdDialog.show(confirm).then(function() {

            vm.ajoutsite_enqueteur(vm.selectedItemsite_enqueteur,1);
          }, function() {
            //alert('rien');
          });
        };
        function test_existancesite_enqueteur (item,suppression) 
        {
           
            if (suppression!=1) 
            {
                vm.allsite_enqueteur.forEach(function(dist) {
                
                  if (dist.id==item.id) 
                  {
                    if((dist.enqueteur.id!=item.enqueteur_id))
                    
                    {
                      insert_in_basesite_enqueteur(item,suppression);
                      vm.affichageMasquesite_enqueteur = 0 ;
                    }
                    else
                    {
                      vm.affichageMasquesite_enqueteur = 0 ;
                    }
                  }
                });
            }
            else
              insert_in_basesite_enqueteur(item,suppression);
        }
        function insert_in_basesite_enqueteur(site_enqueteur,suppression)
        {   
            //add
            var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
            };
            
            var getId = 0;
            if (NouvelItemsite_enqueteur==false)
            {
                getId = vm.selectedItemsite_enqueteur.id; 
            } 
            
            var datas = $.param({
                    supprimer:            suppression,
                    id:                   getId,      
                    site_embarquement_id: vm.selectedItem.id,
                    enqueteur_id:         site_enqueteur.enqueteur_id             
            });
            
            //factory
            apiFactory.add("site_enqueteur/index",datas, config).success(function (data)
            {

              var enq = vm.allenqueteur.filter(function(obj)
              {
                  return obj.id == vm.site_enqueteur.enqueteur_id;
              });
              if (NouvelItemsite_enqueteur == false)
              {               
                  if(suppression==0)
                  {
                      vm.selectedItemsite_enqueteur.enqueteur   = enq[0];
                      vm.afficherboutonModifSuprsite_enqueteur  = 0 ;
                      vm.afficherboutonModifsite_enqueteur      = 0;
                      vm.afficherboutonnouveausite_enqueteur    = 1 ;
                      vm.selectedItemsite_enqueteur.$selected   = false;
                      vm.selectedItemsite_enqueteur             = {};

                  } 
                  else
                  {    
                      vm.allsite_enqueteur = vm.allsite_enqueteur.filter(function(obj) 
                      {
                           return obj.id !== currentItemsite_enqueteur.id;
                      });
                  }
              } 
              else
              {
                  var item = 
                  {
                      id:String(data.response) ,
                      enqueteur: enq[0], 
                  };   
                                
                      vm.allsite_enqueteur.push(item);
                     
                      vm.site_enqueteur         = {};                 
                      NouvelItemsite_enqueteur  = false;
              }
              vm.affichageMasquesite_enqueteur  = 0 ;
            }).error(function (data) {
                        alert('Error');
              });   
        

    }
    vm.typeEffort = function(type)
    {
      if(type==0)
      {
        return 'PAB'
      }
      else if(type==1)
      {
        return 'CAB'
      }
      else
      {
        return 'PAB & CAB'
      }
    }
    vm.modifierenqueteur = function(enqueteur)
    {
      var enqu = vm.allenqueteur.filter(function(obj)
      {
          return obj.id == enqueteur.enqueteur_id;
      });
      
      vm.site_enqueteur.enqueteur_prenom =    enqu[0].prenom;
      vm.site_enqueteur.enqueteur_telephone = enqu[0].telephone;
    }
/*********** ************************Fin site d'embarquement  *******************************************/

/*********** ************************Fin unite_peche_site  *******************************************/
      vm.selectionunite_peche_site= function (item)
      {  vm.selectedItemunite_peche_site            = item;
         vm.NouvelItemunite_peche_site              = item;
         currentItemunite_peche_site                = JSON.parse(JSON.stringify(vm.selectedItemunite_peche_site));
         vm.afficherboutonModifSuprunite_peche_site = 1 ;
         vm.afficherboutonModifunite_peche_site     = 1 ;
         vm.affichageMasqueunite_peche_site         = 0 ;
         vm.afficherboutonnouveauunite_peche_site   = 1 ;   

            
      };

      $scope.$watch('vm.selectedItemunite_peche_site', function()
      {  if (!vm.allunite_peche_site) return;
         vm.allunite_peche_site.forEach(function(item)
         {
            item.$selected = false;
         });
         vm.selectedItemunite_peche_site.$selected = true;
      });

      vm.modifierunite_peche_site = function() 
      {  NouvelItemunite_peche_site             = false ;
         vm.affichageMasqueunite_peche_site     = 1 ;
         vm.unite_peche_site.id      = vm.selectedItemunite_peche_site.id; 

        vm.unite_peche_site.unite_peche_id = vm.selectedItemunite_peche_site.unite_peche.id ; 
        vm.unite_peche_site.nbr_echantillon = parseInt(vm.selectedItemunite_peche_site.nbr_echantillon) ;      
         vm.afficherboutonModifSuprunite_peche_site = 0;
         vm.afficherboutonModifunite_peche_site     = 1 ;
         vm.afficherboutonnouveauunite_peche_site   = 0; 
      };

      vm.ajouterunite_peche_site = function () 
      {  vm.selectedItemunite_peche_site.$selected  = false;
         vm.affichageMasqueunite_peche_site         = 1 ;
         vm.unite_peche_site = {} ;
         NouvelItemunite_peche_site                 = true ;
         vm.afficherboutonModifSuprunite_peche_site = 0;
         vm.afficherboutonModifunite_peche_site     = 0 ;
         vm.afficherboutonnouveauunite_peche_site   = 1;
         
      };
      
      vm.annulerunite_peche_site = function() 
      {  vm.selectedItemunite_peche_site            = {} ;
         vm.selectedItemunite_peche_site.$selected  = false;
         vm.affichageMasqueunite_peche_site         = 0 ;
         vm.afficherboutonnouveauunite_peche_site   = 1 ;
         vm.afficherboutonModifSuprunite_peche_site = 0 ;
         vm.afficherboutonModifunite_peche_site     = 0 ;
         NouvelItemunite_peche_site                 = false;
      };
      vm.supprimerunite_peche_site = function() 
      {  vm.afficherboutonModifSuprunite_peche_site = 0;
        vm.afficherboutonModifunite_peche_site      = 0 ;
         vm.affichageMasqueunite_peche_site         = 0;
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
            ajoutunite_peche_site(vm.selectedItemunite_peche_site,1);
         }, function() {
            //alert('rien');
          });
      };

      function test_existanceunite_peche_site (item,suppression) 
      {  if (suppression!=1) 
         {  
            var unite_p = vm.allunite_peche_site.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(unite_p[0])
                {
                   if((unite_p[0].type_canoe.id!=item.type_canoe_id)
                    ||(unite_p[0].type_engin.id!=item.type_engin_id)
                    ||(unite_p[0].libelle!=item.libelle))                    
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
         else
            insert_in_baseunite_peche_site(item,suppression);
      }

      function ajoutunite_peche_site(unite_peche_site,suppression)   
      {  
        if (NouvelItemunite_peche_site == false) 
         {
           test_existanceunite_peche_site (unite_peche_site,suppression); 
         }
         else
         {          
           insert_in_baseunite_peche_site(unite_peche_site,suppression);
         }
      }

      function insert_in_baseunite_peche_site(unite_peche_site,suppression)
      {    //add
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
        };
        
        var getId = 0;
        if (NouvelItemunite_peche_site==false)
        {
            getId = vm.selectedItemunite_peche_site.id; 
        } 
        
        var datas = $.param({
                supprimer:            suppression,
                id:                   getId,      
                site_embarquement_id: vm.selectedItem.id,
                unite_peche_id:       unite_peche_site.unite_peche_id,
                nbr_echantillon:      unite_peche_site.nbr_echantillon              
        });
        
        //factory
        apiFactory.add("unite_peche_site/index",datas, config).success(function (data)
        {
          var up = vm.allunite_peche.filter(function(obj)
          {
              return obj.id == vm.unite_peche_site.unite_peche_id;
          });
          if (NouvelItemunite_peche_site == false)
          {               
              if(suppression==0)
              {
                  vm.selectedItemunite_peche_site.unite_peche     = up[0];
                  vm.selectedItemunite_peche_site.nbr_echantillon = vm.unite_peche_site.nbr_echantillon;
                  vm.afficherboutonModifSuprunite_peche_site      = 0 ;
                  vm.afficherboutonModifunite_peche_site          = 0 ;
                  vm.afficherboutonnouveauunite_peche_site        = 1 ;
                  vm.selectedItemunite_peche_site.$selected       = false;
                  vm.selectedItemunite_peche_site                 = {};

              } 
              else
              {    
                  vm.allunite_peche_site = vm.allunite_peche_site.filter(function(obj) 
                  {
                       return obj.id !== currentItemunite_peche_site.id;
                  });
              }
          } 
          else
          {
              var item = 
              {
                  id:String(data.response) ,
                  unite_peche:     up[0],
                  type_engin:      up[0].type_engin,
                  type_canoe:      up[0].type_canoe,
                  nbr_echantillon: vm.unite_peche_site.nbr_echantillon 
              };   
                       
                  vm.allunite_peche_site.push(item);
               
                  vm.unite_peche_site = {};                 
                  NouvelItemunite_peche_site = false;
          }
          vm.affichageMasqueunite_peche_site = 0 ;
        }).error(function (data) {
                    alert('Error');
          });                
      }
      

/*********** ************************Fin unite_peche_site   *******************************************/     
         

    }
})();
