(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.nombre_echantillon')
        .controller('Nombre_echantillonController', Nombre_echantillonController);

    /** @ngInject */
    function Nombre_echantillonController($cookieStore,$mdDialog, $scope, apiFactory, $state,apiUrlexcel)
    {
      var vm      = this;      
      vm.filtre   = {} ;
      vm.now_date = new Date();
      vm.annee    = vm.now_date.getFullYear();
      vm.filtre.date_fin  = vm.now_date ;
      vm.annees           = [] ;
      vm.datas            = [] ;
      vm.affiche_load     = false ;
      for (var i = 2012; i <= vm.annee; i++) {
        vm.annees.push(i);
      }
      vm.filtre.annee = vm.annee ;

      vm.isADMIN = false;

      //style
      vm.dtOptions = {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        responsive: true/*,
        columnDefs : [
        {
           // your case first column
            "className": "dt-body-center", targets: [ 1, 2, 3 ,4,5,6,7,8,9,10,11,12]
         
       }]*/
      };

     /* vm.columns = [{titre:"Unié de pêche"},{titre:"Nbr unité de pêche dans l'enquête cadre"},{titre:'01'},{titre:"02"},{titre:"03"},{titre:"04"},
      {titre:"05"},{titre:"06"},{titre:"07"},{titre:"08"},{titre:"09"},{titre:"10"},{titre:"11"},{titre:"12"}];*/

      apiFactory.getAll("region/index").then(function(result)
      {
          vm.allregion= result.data.response;
      });

      apiFactory.getAll("district/index").then(function(result)
      {
          vm.alldistrict  = result.data.response;
          vm.districts    = vm.alldistrict ;
      });

      apiFactory.getAll("site_embarquement/index").then(function(result)
      {
          vm.allsite = result.data.response;
          vm.sites   = result.data.response;
      });

      apiFactory.getAll("unite_peche/index").then(function(result)
      {
          vm.allunite_peche = result.data.response;
          vm.unite_peches   = result.data.response;
      });

      vm.filtre_district = function()
      {
          vm.filtre.id_district           ="*";
          vm.filtre.id_site_embarquement  ="*";
          var ds = vm.alldistrict ;
          if (vm.filtre.id_region != "*") 
          {
            vm.districts = ds.filter(function(obj)
            {
                return obj.region.id == vm.filtre.id_region;
            });
          }
          else
          {
            vm.districts = vm.alldistrict ;
          }
          
      }

      apiFactory.getOne("utilisateurs/index", $cookieStore.get('id')).then(function(result) 
      {
          var utilisateur = result.data.response;
          vm.filtre.id_region = result.data.response.id_region;
          if(utilisateur.roles.indexOf("ADMIN")!= -1)
          {
            vm.isADMIN = true;          
          }           
          
      });

      vm.filtre_site = function()
      {
          var s = vm.allsite ;
          if (vm.filtre.id_district != "*") 
          {
            vm.sites = s.filter(function(obj)
            {
                if (obj.district) 
                {
                
                    return obj.district.id == vm.filtre.id_district;

                }
               
                
            });
          }
          else
          {

            vm.sites = vm.allsite ;

          }
          

      }

      function formatDateBDD(dat)
      {
        if (dat) 
        {
          var date  = new Date(dat);
          var mois  = date.getMonth()+1;
          var dates = (date.getFullYear()+"-"+mois+"-"+date.getDate());
          return dates;
        }
          

      }

      vm.couleur = function(val)
      {
        if (val < 50) 
        {
          
          return "#ff0000" ;
        }

        if (val > 75) 
        {
          
          return "#03af2b" ;
        }

        if ( (val >= 50)&&(val <= 75) ) 
        {
          
          return "#ffae00" ;
        }
      }

      vm.filtrer = function(filtres)
      {
        vm.affiche_load = true ;

        /*var annee_debut = filtres.date_debut.getFullYear() ;
        var annee_fin = filtres.date_fin.getFullYear() ;*/

      

        /*if (annee_debut != annee_fin) //raha tsy mitovy ny année anilay date debut sy fin
        {
          
          var confirm = $mdDialog.confirm().title('Attention!')
                                .textContent("Les dates doivent être dans la même année")
                                .ariaLabel('')
                                .clickOutsideToClose(true)
                                .parent(angular.element(document.body))
                                .ok('ok');
                                

          $mdDialog.show(confirm).then(function()
          {
            //success
          }, function()
          {
            //alert('rien');
          });

        }*/

       
        

          apiFactory.getAPIgeneraliserREST("reporting/index","menu","nombre_echantillon","annee",filtres.annee,
            "id_unite_peche",filtres.id_unite_peche,"id_espece",filtres.id_espece,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement).then(function(result)
          {
            vm.datas = result.data.response;
            vm.affiche_load = false ;
            
          });
        
      }

  
      vm.exportexcel = function(filtres)
      {
          vm.affiche_load = true ;
          var repertoire = "nombre_echantillon/"
          apiFactory.getAPIgeneraliserREST("reporting/index","menu","export_excel","annee",filtres.annee,
            "id_unite_peche",filtres.id_unite_peche,"id_espece",filtres.id_espece,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement,"repertoire",repertoire).then(function(result)
          {
            var status = result.data.status;
            if(status)
            {
              var nom_fiche = result.data.nom_file;              
              try
                { 
                  window.location = apiUrlexcel+"nombre_echantillon/"+nom_fiche ;
                }catch(error)
                {

                }finally
                {
                  vm.affiche_load = false ;
                }
            }
          });
      }
     

    


    }

})();
