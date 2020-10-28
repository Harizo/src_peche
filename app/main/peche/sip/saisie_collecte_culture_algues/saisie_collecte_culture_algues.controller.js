
(function ()
{
   'use strict';

   angular
   .module('app.peche.sip.saisie_collecte_culture_algues')
   .controller('saisie_collecte_culture_alguesController', saisie_collecte_culture_alguesController);
   /** @ngInject */
   function saisie_collecte_culture_alguesController($mdDialog, $scope, apiFactory, $state, apiUrlExportexcel)  
   {
      var vm = this;
     
      var nouvel_col_cult_algue = false ;
      vm.affichage_masque_col_cult_algue = false ;    

      //VARIABLE CACHE MASQUE DE SAISIE
        vm.affichageMasqueExportExcel = false;
        vm.all_colect_cult_algue = [] ;

        vm.dtOptions =
        {
           dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
           pagingType: 'simple_numbers',
           order:[] 
        };

      //CLE ETRANGERE
          apiFactory.getAll("region/index").then(function(result)
         {  
            vm.allregion = result.data.response;
         });
     
      //FIN CLE ETRANGERE

      // Debut Filtre saisie_collecte_culture_algues
        vm.filtre   = {} ;
        vm.filtre.annee = null ;
        vm.filtre.mois = null ;

        vm.get_district = function()
        {
          vm.filtre.id_district = null ;
          vm.filtre.id_commune = null;
          vm.filtre.id_fokontany = null ;
          vm.afichebouton = false;
          vm.affiche_load=true; 
          vm.text_load = 'Chargement région en cours...' ;
          
          apiFactory.getAPIgeneraliserREST("district/index","id_region",vm.filtre.id_region).then(function(result)
          {
            vm.alldistrict = result.data.response;
            vm.affiche_load = false ;
          });
        }

         vm.get_commune = function()
        {
          vm.filtre.id_commune = null;
          vm.filtre.id_fokontany = null ;
          vm.afichebouton = false;
          vm.affiche_load=true; 
          vm.text_load = 'Chargement district en cours...' ;
          
          apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_district).then(function(result)
          {
            vm.allcommune = result.data.response;
            vm.affiche_load = false ;
            if (!nouvel_col_cult_algue && vm.selected_col_cult_algue.id_commune) 
              vm.filtre.id_commune = vm.selected_col_cult_algue.id_commune ; 
          });
        }

        vm.get_fokontany = function()
        {
          vm.afichebouton = true;
          vm.filtre.id_fokontany = null;
          vm.text_load = 'Chargement commune en cours...' ;
          apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
          {
            vm.allfokontany = result.data.response;
            vm.affiche_load = false ;
               
          });
        } 

        $scope.$watch('vm.filtre.id_commune', function()
        {
          if (!vm.filtre.id_commune) return;
          

          if (vm.filtre.id_commune) 
          {
            vm.get_fokontany() ;
          }

        }); 

        vm.formatMillier = function (nombre) 
        {  
          var nbr=parseFloat(nombre).toFixed(0) ;

          if (  nbr!='NaN' && typeof nombre=='string' && typeof nombre!='Object' ) 
          {
            if (typeof nbr != 'undefined' && parseInt(nbr) > 0) 
            {
              nbr += '';
              var sep = ' ';
              var reg = /(\d+)(\d{3})/;
              while (reg.test(nbr)) 
                nbr = nbr.replace(reg, '$1' + sep + '$2');
              var unite = parseFloat(nombre).toFixed(0) ; //variable temporaire
              for (var i = unite.length ; i <nombre.length; i++)
                  nbr+=nombre[i];
              return nbr = vm.replace_point(nbr) ;
            } 
          }
          else return nombre ; 
        }
        vm.replace_point = function(nbr)
        {
          var str = ""+nbr ;
          var res = str.replace(".",",") ;
          return res ;
        }

        vm.replace_espace = function(strings)
        {
          var str = ""+strings ;
          var res = str.replace("_"," ") ;
          res = res.replace("_"," ") ;
          res = res.replace("_"," ") ;
          res = res.replace("_"," ") ;
          return res ;
        }

        vm.affichage_mois = function(mois)
        {
          switch (Number(mois)) 
          {
            case 1:
              return "Janvier";
            case 2:
              return "Février";
            case 3:
              return "Mars";
            case 4:
              return "Avril";
            case 5:
              return "Mai";
            case 6:
              return "Juin";
            case 7:
              return "Juillet";
            case 8:
              return "Août";
            case 9:
              return "Septembre";
            case 10:
              return "Octobre";
            case 11:
              return "Novembre";
            case 12:
              return "Décembre";
              
            default:
              
              break;
          }
        }
      // Fin Filtre saisie_collecte_culture_algues

      // DEBUT saisie_collecte_culture_algues 
        vm.get_col_cult_algue_by_filtre = function()
        { 
          vm.affiche_load = true ;
          vm.text_load = "Chargement en cours... Veuillez patienter s'il vous plait!!!"  ;
          vm.nom_region = '';
         
         
          apiFactory.getParamsDynamic("SIP_saisie_collecte_culture_algues/index?id_commune="+vm.filtre.id_commune+"&id_fokontany="+
            vm.filtre.id_fokontany+"&annee="+vm.filtre.annee+"&mois="+vm.filtre.mois).then(function(result)
          {
            vm.all_colect_cult_algue = result.data.response;
            vm.affiche_load = false ;           
            vm.afichebouton = false;
            vm.selected_col_cult_algue = {};
            
            if (vm.all_colect_cult_algue.length>0) {  
              vm.desactiveExport = false ;
              vm.affichageMasqueExportExcel=true;
            }
            else 
              vm.affichageMasqueExportExcel = false ;
          });
        }

        vm.selected_col_cult_algue = {}; 

        vm.entete_liste_col_cult_algue = 
        [
          {titre:"Fokontany"},
          {titre:"Année"},
          {titre:"Mois"},
          {titre:"Village"},
          {titre:"Quantité"},
          {titre:"Montant"}
        ] ;

        vm.affichage_col_cult_algue = function(int)
        {
          if (int == '0') 
             return "Non";
          else
             return "Oui";
        }

        vm.selection_col_cult_algue = function(algue)
        {
          vm.selected_col_cult_algue = algue ;
        }

        $scope.$watch('vm.selected_col_cult_algue', function()
        {
          if (!vm.all_colect_cult_algue) return;
          vm.all_colect_cult_algue.forEach(function(item)
          {
             item.$selected = false;
          });
          vm.selected_col_cult_algue.$selected = true;

        });


        vm.ajout_col_cult_algue = function()
        { 
          vm.affiche_load = false ; 
          vm.col_cult_algue                     = {};
          vm.selected_col_cult_algue         = {};
          vm.affichage_masque_col_cult_algue = true ;
          nouvel_col_cult_algue                 = true ;
          vm.afficherboutonfiche_poisonnerie = 0 ;
        }

        vm.modif_col_cult_algue = function()
        {
          vm.affiche_load = false ; 
          nouvel_col_cult_algue = false ;
          vm.affichage_masque_col_cult_algue = true ;
          vm.afficherboutonfiche_poisonnerie = 0 ;

          vm.col_cult_algue.communes        = vm.selected_col_cult_algue.nom_commune ;
          vm.col_cult_algue.fokontany       = vm.selected_col_cult_algue.fokontany ;
          vm.filtre.annee                   = vm.selected_col_cult_algue.annee ;
          vm.filtre.mois                    = vm.selected_col_cult_algue.mois ;
          vm.col_cult_algue.village         = vm.selected_col_cult_algue.village;
          vm.col_cult_algue.quantite        = vm.selected_col_cult_algue.quantite ;
          vm.col_cult_algue.montant         = vm.selected_col_cult_algue.montant ;

          vm.filtre.id_commune              = vm.selected_col_cult_algue.id_commune ;
          vm.filtre.id_fokontany            = vm.selected_col_cult_algue.id_fokontany ;
        }

        vm.annuler_col_cult_algue = function()
        {
          nouvel_col_cult_algue = false ;
          vm.affiche_load = false ;
          vm.affichage_masque_col_cult_algue = false ;
          vm.selected_col_cult_algue = {};
          vm.afficherboutonfiche_poisonnerie=0;
        }

        vm.supprimer_col_cult_algue = function() 
        {
          vm.affichage_masque_col_cult_algue = false ;
          var confirm = $mdDialog.confirm()
            .title('Etes-vous sûr de supprimer cet enregistrement ?')
            .textContent('')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('ok')
            .cancel('annuler');
            $mdDialog.show(confirm).then(function() {
                vm.affiche_load = true ;
                vm.text_load = "Suppression est en cours... Veuillez patienter s'il vous plait!!!";
                vm.save_in_bdd(vm.selected_col_cult_algue,1);

                }, function() {
                  //alert('rien');
                });
        }

        vm.save_in_bdd = function(data_masque, etat_suppression)
        {
          
          // vm.affiche_load = true ;
          vm.text_load = "Chargement en cours... Veuillez patienter s'il vous plait!!!"  ;
          var config = {
            headers : {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
          };

          var id = 0 ;

          if (!nouvel_col_cult_algue) 
            id = vm.selected_col_cult_algue.id ;
          var datas = $.param(
          {
                          
            id:              id,      
            supprimer:       etat_suppression,
           
            id_commune:      vm.filtre.id_commune,
            id_fokontany:    vm.filtre.id_fokontany,
            annee:           vm.filtre.annee,
            mois:            vm.filtre.mois,

            village:         data_masque.village,
            quantite:        data_masque.quantite,
            montant:         data_masque.montant

          });

          apiFactory.add("SIP_saisie_collecte_culture_algues/index",datas, config).success(function (data)
          { 
            vm.affiche_load = false ;
            var comm = vm.allcommune.filter(function(obj)
            {
              return obj.id == vm.filtre.id_commune;
            });

            var fkt = vm.allfokontany.filter(function(obj)
            {
              return obj.id == vm.filtre.id_fokontany;
            });
               
            if (!nouvel_col_cult_algue) 
            {
              if (etat_suppression == 0) //mise à jour
              {
                vm.selected_col_cult_algue.village         = data_masque.village ;
                vm.selected_col_cult_algue.quantite        = data_masque.quantite ;
                vm.selected_col_cult_algue.montant         = data_masque.montant ;
                
                vm.selected_col_cult_algue.annee           = vm.filtre.annee ;
                vm.selected_col_cult_algue.mois            = vm.filtre.mois ;
              
                vm.selected_col_cult_algue.id_commune      = vm.filtre.id_commune ; 
                vm.selected_col_cult_algue.communes        =   comm[0].nom ;

                vm.selected_col_cult_algue.id_fokontany    = vm.filtre.id_fokontany ; 
                vm.selected_col_cult_algue.fokontany       =   fkt[0].nom ;

              }
              // Suppression
              else
              {
                vm.all_colect_cult_algue = vm.all_colect_cult_algue.filter(function(obj)
                {
                  return obj.id !== vm.selected_col_cult_algue.id;
                });
                vm.selected_col_cult_algue = {};
              }
            }
            else
            {
              vm.affiche_load = true ;
              vm.text_load = 'Enregistrement terminée!!!';
              var item =
              {
                id:String(data.response) ,
             
                id_commune:      vm.filtre.id_commune ,
                communes:        comm[0].nom,

                id_fokontany:    vm.filtre.id_fokontany ,
                fokontany:       fkt[0].nom,

                annee:           vm.filtre.annee,
                mois:            vm.filtre.mois,

                village:         data_masque.village,
                quantite:        data_masque.quantite,
                montant:         data_masque.montant
                                  
              } 
              vm.all_colect_cult_algue.unshift(item);
            }
            
            vm.affichage_masque_col_cult_algue = false ; //Fermeture de la masque de saisie
            nouvel_col_cult_algue = false;
            vm.affiche_load = false ;
          })
          .error(function (data) {alert("Une erreur s'est produit");}); 
        }

        
      // FIN saisie_collecte_culture_algues

      //EXPORT EXCEL Poissonnerie

        vm.masquefiche_poissonnerie = function()
        {
          vm.affichageMasqueExportExcel =true;
          vm.afficherboutonModifSupr    = 0;
          vm.afficherboutonModif        = 0;
          vm.affichageMasque            = 0 ; 
        }

        vm.creefiche_col_cult_algue = function(filtre)
        { 
          var reg = vm.allregion.filter(function(obj)
          {
            return obj.id == filtre.id_region;
          });
          vm.region = reg[0].nom ;
          
          var dist = vm.alldistrict.filter(function(obj)
          {
            return obj.id == filtre.id_district;
          });
          vm.district = dist[0].nom ;
          
          var comm = vm.allcommune.filter(function(obj)
          {
            return obj.id == filtre.id_commune;
          });
          vm.commune = comm[0].nom ;
          
          if (filtre.id_fokontany) {
            if (filtre.id_fokontany!='-') {
              var fkt = vm.allfokontany.filter(function(obj)
              {
                return obj.id == filtre.id_fokontany;
              });
              vm.fokontany = fkt[0].nom ;
            }
          }
          
          vm.affiche_load = true ;
          vm.text_load = 'Chargement export excel en cours...' ;
          vm.affichageMasqueExportExcel = true;
          var repertoire = 'fiche_collecte_culture_algues/';   
            apiFactory.getParamsDynamic("SIP_exportexcel_collecte_culture_algues/index?&repertoire="+repertoire+
              "&region="+vm.region+"&district="+vm.district+"&commune="+vm.commune+"&fokontany="+vm.fokontany+
              "&id_commune="+filtre.id_commune+"&id_fokontany="+filtre.id_fokontany+"&annee="+filtre.annee+
              "&mois="+filtre.mois+"&month="+vm.affichage_mois(filtre.mois)).success(function (result)
            {
              vm.status    = result.status; 
              if(vm.status)
              {
                vm.nom_file = result.nom_file;            
                window.location = apiUrlExportexcel+repertoire+vm.nom_file ;
                vm.affiche_load =false; 

              }
              else{
                vm.Alert('Export en excel',result.message);
                vm.affiche_load =false; 
              }
                 
            })
            .error(function (data)
            {
              alert('Error');
            });
        }

      // FIN EXPORT EXCEL
    
    // DEBUT REPORTING REQUETE
    
      vm.report_cult_alg = [] ; // données affichent au DOM à la data table
      vm.entete_etat = [] ;
      vm.pivots = [
        {titre:"Req 1 : Quantité par mois culture d'algues",id:"req8_1_quantite_par_mois_culture_dalgues"},
        {titre:"Req 2 : Quantité par village culture d'algues",id:"req8_2_quantite_par_villagee_culture_dalgues"},
        {titre:"Req 3 : Quantité par commune culture d'algues",id:"req8_3_quantite_par_commune_culture_dalgues"},
        {titre:"Req 4 : Montant par mois culture d'algues",id:"req8_4_montant_par_mois_culture_dalgues"},
        {titre:"Req 5 : Montant par village culture d'algues",id:"req8_5_montant_par_village_culture_dalgues"}
      ];

      vm.filtrerreports = function(filtres)
      {
        vm.affiche_load = true ;
        vm.text_load = "Chargement en cours... Veuillez patienter s'il vous plait!!!";
          apiFactory.getParamsDynamic("SIP_reporting_collecte_culture_algues/index?menu="+filtres.pivot).then(function(result)
          {
            
            vm.affiche_load = false ;
            vm.report_cult_alg  = result.data.response ;
            //recupère en tête
              vm.entete_etat = Object.keys(vm.report_cult_alg[0]).map(function(cle) {
              return (cle) ;
            });
          }); 
      } 

      vm.exportExcel = function(filtres)
      {
        vm.affiche_load = true ;
        vm.text_load = "Export Excel en cours... Veuillez patienter s'il vous plait!!!";
        var repertoire = 'reporting_collecte_culture_dalgues/'; 
        var choix_pivot = vm.pivots.filter(function(obj)
        {
          return obj.id == filtres.pivot ;
        });

        apiFactory.getParamsDynamic("SIP_reporting_collecte_culture_algues/index?menu_excel="+"excel_requetes"+"&menu="+
        filtres.pivot+"&repertoire="+repertoire+"&choix_pivot="+choix_pivot[0].titre).then(function(result)
        {
          vm.status    = result.data.status ; 
        
          if(vm.status)
          {
              vm.nom_file = result.data.nom_file;            
              window.location = apiUrlExportexcel+repertoire+vm.nom_file ;
              vm.affiche_load =false; 

          }
          else{
              vm.message=result.data.message;
              vm.Alert('Export en excel',vm.message);
              vm.affiche_load =false; 
          }
        });  
      }

      vm.Alert = function(titre,content)
      {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(false)
          .parent(angular.element(document.body))
          .title(titre)
          .textContent(content)
          .ariaLabel('Alert')
          .ok('Fermer')
          .targetEvent()
        );
      }
    // FIN REPORTING REQUETE
    

   }
})();