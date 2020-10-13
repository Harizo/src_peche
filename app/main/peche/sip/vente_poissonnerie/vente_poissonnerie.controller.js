
(function ()
{
   'use strict';

   angular
   .module('app.peche.sip.vente_poissonnerie')
   .controller('vente_poissonnerieController', vente_poissonnerieController);
   /** @ngInject */
   function vente_poissonnerieController($mdDialog, $scope, apiFactory, $state, apiUrlExportexcel)  
   {
     
      var vm = this;
      var nouvel_vente_poissonnerie = false ;
      var nouvel_col_poiss = false ;
      vm.affichage_masque_poissonnerie = false ;    

      //VARIABLE CACHE MASQUE DE SAISIE
        vm.affichageMasqueExportExcel = false;
        vm.all_poissonnerie = [] ;
       // vm.filtre.id_region = null ;
        //  vm.filtre.id_commune = null;
         // vm.filtre.id_district = null ;

        vm.dtOptions =
        {
           dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
           pagingType: 'simple_numbers',
           order:[] 
        };

      //CLE ETRANGERE
         apiFactory.getAll("SIP_presentation/index").then(function(result)
         {
            vm.all_presentation = result.data.response;
         });

          apiFactory.getAll("region/index").then(function(result)
         {  
            vm.allregion = result.data.response;
         });

         apiFactory.getAll("SIP_conservation/index").then(function(result)
         {
            vm.all_conservation = result.data.response;
         });

          apiFactory.getAll("sip_famille/index").then(function(result)
         {
            vm.all_famille= result.data.response;
         });
     
      //FIN CLE ETRANGERE

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
        return res ;
      }

      // Debut Filtre poissonnerie

        vm.get_district = function()
        {
          vm.filtre.id_district = null ;
          vm.filtre.id_commune = null;
          vm.afichebouton = true;
          vm.affiche_load=true; 
          vm.text_load = 'Chargement région en cours...' ;
          apiFactory.getAPIgeneraliserREST("district/index","id_region",vm.filtre.id_region).then(function(result)
          {
            
            vm.alldistrict = result.data.response;
            
            if (!vm.affichage_masque_poissonnerie)
             { vm.affiche_load = false ; }
            else vm.text_load = vm.tmp ;
          });
        }

        vm.get_commune = function()
        {
          vm.afichebouton = true;
          vm.filtre.id_commune = null;
          vm.affiche_load=true; 
          vm.text_load = 'Chargement district en cours...' ;
          apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_district).then(function(result)
          {
            
            vm.allcommune = result.data.response;
            

            if (!nouvel_col_poiss && vm.selected_poissonnerie.id_commune) 
              vm.filtre.id_commune = vm.selected_poissonnerie.id_commune ;
            
            if (!vm.affichage_masque_poissonnerie)
              vm.affiche_load = false ;
            else vm.text_load = vm.tmp ;    
          });
        } 

        $scope.$watch('vm.filtre.id_region', function()
        {
          if (!vm.filtre.id_region) return;
          

          if (vm.filtre.id_region) 
          {
            vm.get_district() ;
          }

        });

        $scope.$watch('vm.filtre.id_district', function()
        {
          if (!vm.filtre.id_district) return;
          

          if (vm.filtre.id_district) 
          {
            vm.get_commune() ;
          }

        });

      // poissonnerie 
        vm.get_poissonnerie_by_filtre = function()
        { 
          vm.affiche_load = true ;
          vm.text_load = 'Chargement en cours... Veuillez patienter s\'il vous plait!!! ' ;
          vm.nom_region = '';
         
         
          apiFactory.getParamsDynamic("sip_poissonnerie/index?id_region="+vm.filtre.id_region+"&id_commune="+vm.filtre.id_commune+"&id_district="+vm.filtre.id_district).then(function(result)
          {
            vm.nom_commune = '' ;
            vm.nom_district = '' ;
            vm.afichebouton = false;
          
            vm.all_poissonnerie = result.data.response;
            vm.selected_poissonnerie = {};
            
            if (vm.all_poissonnerie.length>0) {  
              vm.desactiveExport = false ;
              
              if (vm.filtre.id_district=='null') 
                return ;
              else
                vm.nom_district = vm.all_poissonnerie[0].districts ; 
                
              if (vm.filtre.id_commune=='null')
                return ;
              else
                vm.nom_commune = vm.all_poissonnerie[0].communes ; 

              vm.nom_region=vm.all_poissonnerie[0].nom_region;
              vm.affichageMasqueExportExcel=true;
            }
            else 
              vm.affichageMasqueExportExcel = false ;
            vm.affiche_load = false ;           
          });
        }

        vm.selected_poissonnerie = {}; 

        vm.entete_liste_poissonnerie = 
        [
          {titre:"Région"},
          {titre:"District"},
          {titre:"Commune"},
          {titre:"Nom"},
          {titre:"Localisation"},
          {titre:"Adresse"},
          {titre:"Rcs"},
          {titre:"Stat"},
          {titre:"Nif"},
          {titre:"Tèl"}
        ] ;

        vm.affichage_col_poiss = function(int)
        {
          if (int == '0') 
             return "Non";
          else
             return "Oui";
        }

        vm.selection_poissonnerie = function(poiss)
        {
          vm.selected_poissonnerie = poiss ;
            
          //désélection fils
            vm.selected_vente_poissonnerie = {} ;
          //fin désélection fils
        }

        $scope.$watch('vm.selected_poissonnerie', function()
        {
          if (!vm.all_poissonnerie) return;
          vm.all_poissonnerie.forEach(function(item)
          {
             item.$selected = false;
          });
          vm.selected_poissonnerie.$selected = true;

        });


        vm.ajout_col_poiss = function()
        { 
          vm.affiche_load = false ; 
          vm.col_poiss                     = {};
          vm.selected_poissonnerie         = {};
          vm.tmp = vm.text_load ;
          vm.affichage_masque_poissonnerie = true ;
          nouvel_col_poiss                 = true ;
          vm.afficherboutonfiche_poisonnerie = 0 ;
        }

        vm.modif_col_poiss = function()
        {
          vm.affiche_load = false ; 
          nouvel_col_poiss = false ;
          vm.affichage_masque_poissonnerie = true ;
          vm.afficherboutonfiche_poisonnerie = 0 ;
          vm.tmp = vm.text_load ;

          vm.col_poiss.nom           = vm.selected_poissonnerie.nom ;
          vm.col_poiss.localisation  = vm.selected_poissonnerie.localisation ;
          vm.col_poiss.adresse       = vm.selected_poissonnerie.adresse ;
          vm.col_poiss.rcs           = vm.selected_poissonnerie.rcs ;
          vm.col_poiss.stat          = vm.selected_poissonnerie.stat;
          vm.col_poiss.nif           = vm.selected_poissonnerie.nif ;
          vm.col_poiss.tel           = vm.selected_poissonnerie.tel ;

          vm.filtre.id_region        = vm.selected_poissonnerie.id_region ;
          vm.filtre.id_district      = vm.selected_poissonnerie.id_district ;
          vm.filtre.id_commune       = vm.selected_poissonnerie.id_commune ;
        }

        vm.annuler_col_poiss = function()
        {
          nouvel_col_poiss = false ;
          vm.affiche_load = false ;
          vm.affichage_masque_poissonnerie = false ;
          vm.selected_poissonnerie = {};
          vm.afficherboutonfiche_poisonnerie=0;
        }

        vm.supprimer_col_poiss = function() 
        {
          vm.affichage_masque_poissonnerie = false ;
          vm.filtre.id_district      = vm.selected_poissonnerie.id_district ;
          vm.filtre.id_commune       = vm.selected_poissonnerie.id_commune ;
          
          var confirm = $mdDialog.confirm()
            .title('Etes-vous sûr de supprimer cet enregistrement ?')
            .textContent('')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('ok')
            .cancel('annuler');
            apiFactory.getParamsDynamic("sip_saisie_vente_poissonnerie/index?id_poissonnerie="+vm.selected_poissonnerie.id+"&mois="+null+"&annee="+null).then(function(result)
            {
              if(result.data.response.length>0) 
              {
                vm.dialog();
                vm.saisie_vente = result.data.response.length;
              }
              else
              { 
                $mdDialog.show(confirm).then(function() {
                  vm.affiche_load = true ;
                  vm.text_load = 'Suppression est en cours... Veuillez patienter s\'il vous plait!!!';
                  vm.save_in_bdd(vm.selected_poissonnerie,1);

                  }, function() {
                    //alert('rien');
                  });
              }
            });
        }

        vm.dialog = function (ev)
        {
          var confirm = $mdDialog.confirm({
          controller: dialogController,
          templateUrl: 'app/main/peche/sip/ddbsip/dialogue/dialog_Fils.html',
          parent: angular.element(document.body),
          targetEvent: ev, 
          
          })
          $mdDialog.show(confirm).then(function(data)
          {
            //ato no mapifandray ny controller roa ireo
        
            vm.affiche_load = false ;

          }, function(){//alert('rien');
          });

        }

        function dialogController($mdDialog, $scope, apiFactory, $state)  
        {
          var dg=$scope;
          var nombre ;
          //style
          dg.tOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: false          
          };
          dg.nbr1 = vm.saisie_vente ;          
          dg.titre_column = [ {titre:" Saisie vente Poissonnerie"} ]; 
          dg.cancel = function()
          {
            $mdDialog.hide('ok');
          };
        }

        vm.save_in_bdd = function(data_masque, etat_suppression)
        {
          
          // vm.affiche_load = true ;
          vm.text_load = 'Chargement en cours... Veuillez patienter s\'il vous plait!!! ' ;
          var config = {
            headers : {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
          };

          var id = 0 ;

          if (!nouvel_col_poiss) 
            id = vm.selected_poissonnerie.id ;
          var datas = $.param(
          {
                          
            id:              id,      
            supprimer:       etat_suppression,

            id_region:       vm.filtre.id_region,
            id_district:     vm.filtre.id_district,
            id_commune:      vm.filtre.id_commune,

            localisation:    data_masque.localisation,
            nom:             data_masque.nom,
            adresse:         data_masque.adresse,
            stat:            data_masque.stat,
            rcs:             data_masque.rcs,
            tel:             data_masque.tel,
            nif:             data_masque.nif

          });

          apiFactory.add("SIP_poissonnerie/index",datas, config).success(function (data)
          { 
            vm.affiche_load = false ;

            var reg = vm.allregion.filter(function(obj)
            {
              return obj.id == vm.filtre.id_region;
            });

            var dist = vm.alldistrict.filter(function(obj)
            {
              return obj.id == vm.filtre.id_district;
            });

            var comm = vm.allcommune.filter(function(obj)
            {
              return obj.id == vm.filtre.id_commune;
            });
               
            if (!nouvel_col_poiss) 
            {
              if (etat_suppression == 0) //mise à jour
              {
                vm.selected_poissonnerie.nom             = data_masque.nom ;
                vm.selected_poissonnerie.localisation    = data_masque.localisation ;
                vm.selected_poissonnerie.rcs             = data_masque.rcs ;
                vm.selected_poissonnerie.adresse         = data_masque.adresse ;
                vm.selected_poissonnerie.nif             = data_masque.nif ;
                vm.selected_poissonnerie.stat            = data_masque.stat ;
                vm.selected_poissonnerie.tel             = data_masque.tel ;

                vm.selected_poissonnerie.id_region       = vm.filtre.id_region ; 
                vm.selected_poissonnerie.nom_region      = reg[0].nom ;

                vm.selected_poissonnerie.id_commune      = vm.filtre.id_commune ; 
                vm.selected_poissonnerie.communes        =   comm[0].nom ;

                vm.selected_poissonnerie.id_district     = vm.filtre.id_district ; 
                vm.selected_poissonnerie.districts       = dist[0].nom ;

              }
              // Suppression
              else
              {
                vm.all_poissonnerie = vm.all_poissonnerie.filter(function(obj)
                {
                  return obj.id !== vm.selected_poissonnerie.id;
                });
                vm.selected_poissonnerie = {};
              }
            }
            else
            {
              vm.affiche_load = true ;
              vm.text_load = 'Enregistrement terminée!!!';
              var item =
              {
                id:String(data.response) ,
                id_region:     vm.filtre.id_region ,
                nom_region:    reg[0].nom,

                id_district:   vm.filtre.id_district ,
                districts:     dist[0].nom,

                id_commune:    vm.filtre.id_commune ,
                communes:      comm[0].nom,

                localisation:  data_masque.localisation,
                nom:           data_masque.nom,
                adresse:       data_masque.adresse,
                stat:          data_masque.stat,
                rcs:           data_masque.rcs,
                tel:           data_masque.tel,
                nif:           data_masque.nif 
                                  
              } 
              vm.all_poissonnerie.unshift(item);
            }
            
            vm.affichage_masque_poissonnerie = false ; //Fermeture de la masque de saisie
            nouvel_col_poiss = false;
            vm.affiche_load = false ;
          })
          .error(function (data) {alert("Une erreur s'est produit");}); 
        }

      // FIN poissonnerie

      //EXPORT EXCEL Poissonnerie

        vm.masquefiche_poissonnerie = function()
        {
          vm.affichageMasqueExportExcel =true;
          vm.afficherboutonModifSupr    = 0;
          vm.afficherboutonModif        = 0;
          vm.affichageMasque            = 0 ; 
        }

        vm.creefiche_poissonnerie = function(filtre)
        {   
        
          vm.affiche_load = true ;
          vm.text_load = 'Chargement export excel en cours...' ;
          vm.affichageMasqueExportExcel = true;
          var repertoire1 = 'fiche_poissonnerie/';   
            apiFactory.getParamsDynamic("SIP_export_vente_poissonnerie/index?id_region="+vm.filtre.id_region+"&repertoire1="+repertoire1+
              "&nom_region="+vm.nom_region+"&id_commune="+vm.filtre.id_commune+"&id_district="+vm.filtre.id_district+"&district="+
              vm.nom_district+"&commune="+vm.nom_commune).success(function (result)
            {
            
              var nom_file=result.response;
              try
              {
                window.location = apiUrlExportexcel+repertoire1+nom_file ;
                vm.affiche_load = false ;
              }
              catch(error)
              {
              }
              finally
              {
                vm.loadingProgress= false;
              }
                 
            })
            .error(function (data)
            {
              alert('Error');
            });
        }

      // FIN EXPORT EXCEL

      //SAISIE VENTE POISSONNERIE

        vm.affichage_masque_vente_poissonnerie = false ;
        vm.selected_vente_poissonnerie = {};
        vm.vente_poissonnerie = {};
        vm.affichageMasquefiltre2 = 0 ;
        vm.filtre   = {} ; 

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

        vm.get_vente_poissonnerie_by_filter = function(filtre)
        {          
          vm.affiche_load = true ;
          vm.text_load = 'Chargement en cours... Veuillez patienter s\'il vous plait!!! ' ;
          vm.affichageMasqueExportExcel=true ;
          vm.selected_vente_poissonnerie = {} ;
          apiFactory.getParamsDynamic("SIP_saisie_vente_poissonnerie/index?id_poissonnerie="+vm.selected_poissonnerie.id+"&annee="+
            filtre.annee+"&mois="+filtre.mois).then(function(result)
          {
            vm.all_saisie_vente_poissonnerie = result.data.response ;
            vm.affiche_load = false ;
           if (vm.all_saisie_vente_poissonnerie.length==0)
            vm.desactiveExport = true ;
          });

         vm.affichageMasquefiltre2 = 1 ;
          vm.btnaffdata = false ;
        } 

        vm.affiche_filtre =function ()
        {
          vm.affichageMasquefiltre2 = 1;
          vm.selected_vente_poissonnerie = {} ;
          vm.all_saisie_vente_poissonnerie = [] ;
          vm.affichageMasqueExportExcel = true ;
          vm.filtre.annee = null ;
          vm.filtre.mois = null ;
          vm.btnaffdata = true ;
          vm.desactiveExport = true ;
        }    

        vm.entete_liste_vente_poissonnerie = 
        [
          {titre:"Année"},
          {titre:"Mois"},
          {titre:'référence fournisseur'},
          {titre:"Origine produit"},
          {titre:"Famille"},
          {titre:"Type famille"},
          {titre:"Désignation article"},
          {titre:"Présentation"},
          {titre:"Conservation"},
          {titre:"Qté vendue"},
          {titre:"Prix"},
          {titre:"Chiffre d'affaire"},
          {titre:"Observations"}
        ] ;

        vm.selection_vente_poissonnerie = function(vente_poissonnerie)
        {
          vm.selected_vente_poissonnerie = vente_poissonnerie ;
        }


        $scope.$watch('vm.selected_vente_poissonnerie', function()
        {
          if (!vm.all_saisie_vente_poissonnerie) return;
          vm.all_saisie_vente_poissonnerie.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_vente_poissonnerie.$selected = true;

        });

        $scope.$watch('vm.filtre.mois', function()
        {
          $scope.$watch('vm.filtre.annee', function()
          {
            if ((!vm.filtre.mois||vm.filtre.mois=='-')&&!vm.filtre.annee)
            { 
              vm.filtre.mois = null ;
              return vm.filtre_affiche = "Afficer tout les données";
            }
            else{
              if (vm.filtre.mois!='-'&&vm.filtre.mois&&vm.filtre.annee&&vm.filtre.annee!='') 
                return vm.filtre_affiche = "Afficher données année "+vm.filtre.annee+" et mois de "+vm.affichage_mois(vm.filtre.mois);
              else
              {
                if (vm.filtre.annee) 
                  return vm.filtre_affiche = "Afficher données de cette année";
                if (vm.filtre.mois&&vm.filtre.mois!='-') 
                  return vm.filtre_affiche = "Afficher données du mois de "+vm.affichage_mois(vm.filtre.mois);
              }
            }

          });
    
        });

        $scope.$watch('vm.selected_vente_poissonnerie.mois', function()
        {
          if (!nouvel_vente_poissonnerie &&!vm.selected_vente_poissonnerie.mois) 
            return;
          vm.mois = vm.selected_vente_poissonnerie.mois ;

        });

        $scope.$watch('vm.vente_poissonnerie.prix_kg', function()
        {
          if ((!vm.vente_poissonnerie.prix_kg)||(vm.vente_poissonnerie.prix_kg==0))
            return 0 ;
          $scope.$watch('vm.vente_poissonnerie.quantite_vendu', function()
          {
            if ((!vm.vente_poissonnerie.quantite_vendu)||(vm.vente_poissonnerie.quantite_vendu)==0)
              return 0 ;
            vm.vente_poissonnerie.chiffre_affaire = vm.vente_poissonnerie.prix_kg * vm.vente_poissonnerie.quantite_vendu;
          });
        });

        vm.ajout_col = function()
        {
          vm.vente_poissonnerie = {};
          vm.selected_vente_poissonnerie = {};
          vm.affiche_load = false ;
          vm.affichage_masque_vente_poissonnerie = true ;
          nouvel_vente_poissonnerie = true ;
          vm.affichageMasquefiltre2 = 0 ;
        }

        vm.modif_col = function()
        {
          vm.affiche_load = false ; 
          nouvel_vente_poissonnerie = false ;
          vm.affichage_masque_vente_poissonnerie = true ;
          vm.affichageMasquefiltre2 = 0 ;
          console.log(vm.selected_vente_poissonnerie);

          vm.vente_poissonnerie.observations          = vm.selected_vente_poissonnerie.observations ;
          vm.vente_poissonnerie.origine_produits      = vm.selected_vente_poissonnerie.origine_produits ;
          vm.vente_poissonnerie.designation_article   = vm.selected_vente_poissonnerie.designation_article ;
          vm.vente_poissonnerie.reference_fournisseur = vm.selected_vente_poissonnerie.reference_fournisseur ;
          vm.vente_poissonnerie.mois                  = vm.selected_vente_poissonnerie.mois ;
          vm.vente_poissonnerie.annee                 = vm.selected_vente_poissonnerie.annee ;
          vm.vente_poissonnerie.type_famille          = vm.selected_vente_poissonnerie.type_famille ;

          vm.vente_poissonnerie.famille_rh            = vm.selected_vente_poissonnerie.famille_rh ;
          vm.vente_poissonnerie.id_presentation       = vm.selected_vente_poissonnerie.id_presentation ;
          vm.vente_poissonnerie.id_conservation       = vm.selected_vente_poissonnerie.id_conservation ;

          vm.vente_poissonnerie.quantite_vendu        = Number(vm.selected_vente_poissonnerie.quantite_vendu) ;
          vm.vente_poissonnerie.prix_kg               = Number(vm.selected_vente_poissonnerie.prix_kg) ;
          vm.vente_poissonnerie.chiffre_affaire       = Number(vm.selected_vente_poissonnerie.chiffre_affaire) ;
        }

        vm.supprimer_col = function()
        {
          vm.affichage_masque_vente_poissonnerie = false ;
          var confirm = $mdDialog.confirm()
            .title('Etes-vous sûr de supprimer cet enregistrement ?')
            .textContent('')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('ok')
            .cancel('annuler');
          $mdDialog.show(confirm).then(function() {

          vm.save_in_bdd_vente_poissonnerie(vm.selected_vente_poissonnerie,1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_vente_poissonnerie = function()
        {
          nouvel_vente_poissonnerie = false ;
          vm.affichage_masque_vente_poissonnerie = false ;
          vm.affiche_load = false ;
          vm.affichageMasquefiltre2 = 1;
        }

        vm.save_in_bdd_vente_poissonnerie = function(data_masque, etat_suppression)
        {
          var config = {
            headers : {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
          };

          var id = 0 ;
          vm.text_load = "En chargement Veuillez patienter s\'il vous plait!!!" ;

          if (!nouvel_vente_poissonnerie) 
            id = vm.selected_vente_poissonnerie.id ;

          var datas = $.param(
          {
             
            id:id,      
            supprimer:                etat_suppression,
            id_poissonnerie:          vm.selected_poissonnerie.id,      
            famille_rh:               data_masque.famille_rh,
            id_presentation:          data_masque.id_presentation,
            id_conservation:          data_masque.id_conservation,
            
            origine_produits:         data_masque.origine_produits,
            observations:             data_masque.observations,
            designation_article:      data_masque.designation_article,
            reference_fournisseur:    data_masque.reference_fournisseur,
            type_famille:             data_masque.type_famille,
            mois:                     data_masque.mois,
            annee:                    data_masque.annee,
            
            quantite_vendu:           data_masque.quantite_vendu,
            prix_kg:                  data_masque.prix_kg,
            chiffre_affaire:          data_masque.chiffre_affaire

          });

          apiFactory.add("SIP_saisie_vente_poissonnerie/index",datas, config).success(function (data)
          {
          var cons = vm.all_conservation.filter(function(obj)
          {
            return obj.id == data_masque.id_conservation;
          });

          var pres = vm.all_presentation.filter(function(obj)
          {
            return obj.id == data_masque.id_presentation;
          });

          var family = vm.all_famille.filter(function(obj)
          {
            return obj.id == data_masque.famille_rh;
          });

          if (!nouvel_vente_poissonnerie) 
          {
            if (etat_suppression == 0) 
            {
              vm.selected_vente_poissonnerie.reference_fournisseur  = data_masque.reference_fournisseur ;
              vm.selected_vente_poissonnerie.designation_article    = data_masque.designation_article ;
              vm.selected_vente_poissonnerie.origine_produits       = data_masque.origine_produits ;
              vm.selected_vente_poissonnerie.observations           = data_masque.observations ;
              vm.selected_vente_poissonnerie.type_famille           = data_masque.type_famille ;
              vm.selected_vente_poissonnerie.mois                   = data_masque.mois ;
              vm.selected_vente_poissonnerie.annee                  = data_masque.annee ;

              vm.selected_vente_poissonnerie.id_presentation        = data_masque.id_presentation ;
              vm.selected_vente_poissonnerie.libelle_presentation   = pres[0].libelle ;

              vm.selected_vente_poissonnerie.id_conservation        = data_masque.id_conservation ;
              vm.selected_vente_poissonnerie.libelle_conservation   = cons[0].libelle ;

              vm.selected_vente_poissonnerie.id_poissonnerie        = vm.selected_poissonnerie.id ;

              vm.selected_vente_poissonnerie.famille_rh             = data_masque.famille_rh ;
              vm.selected_vente_poissonnerie.libelle_famille        = family[0].libelle ;

              vm.selected_vente_poissonnerie.quantite_vendu         = data_masque.quantite_vendu ;
              vm.selected_vente_poissonnerie.prix_kg                = data_masque.prix_kg ;
              vm.selected_vente_poissonnerie.chiffre_affaire        = data_masque.chiffre_affaire ;
               
            }
            else
            {
              vm.all_saisie_vente_poissonnerie = vm.all_saisie_vente_poissonnerie.filter(function(obj)
              {
                return obj.id !== vm.selected_vente_poissonnerie.id;
              });
             }
          }
          else
          {
            var item =
            {
              id:String(data.response) ,

              id_poissonnerie:vm.selected_poissonnerie.id,
                
              id_conservation:        data_masque.id_conservation,
              libelle_conservation:   cons[0].libelle,

              id_presentation:        data_masque.id_presentation,
              libelle_presentation:   pres[0].libelle,

              famille_rh:             data_masque.famille_rh,
              libelle_famille:        family[0].libelle,

              designation_article:    data_masque.designation_article,
              origine_produits:       data_masque.origine_produits,
              reference_fournisseur:  data_masque.reference_fournisseur,
              observations:           data_masque.observations,
              annee:                  data_masque.annee,
              mois:                   data_masque.mois,
              type_famille:           data_masque.type_famille,

              quantite_vendu:         data_masque.quantite_vendu,
              prix_kg:                data_masque.prix_kg,
              chiffre_affaire:        data_masque.chiffre_affaire
                                
            } 

            vm.all_saisie_vente_poissonnerie.unshift(item);
            nouvel_vente_poissonnerie = false ;
          }

          vm.affichage_masque_vente_poissonnerie = false ;
          vm.btnaffdata = true ;
          vm.affiche_load = false ;
          }).error(function (data) {alert("Une erreur s'est produit");});
        }
         
      // FIN SAISIE VENTE POISSONNERIE


      // EXPORT EXCEL Vente Poissonnerie

        vm.masquefiche_vente_poissonnerie = function()
        {
          vm.afficherboutonModifSupr    = 0 ;
          vm.afficherboutonModif        = 0 ;
          vm.afficherboutonnouveau      = 1 ;
          vm.affichageMasque            = 0 ; 
          vm.affichageMasquefiltre2     = 1 ;
          vm.desactiveSupp              = true ;
          
          vm.affiche_filtre() ;
          
        
        }

        vm.annulerfiche_vente_poissonnerie = function() 
        {
          vm.selectedItem               = {} ;
          vm.filtre.mois                ='';
          vm.filtre.annee               =vm.annee;
          vm.selectedItem.$selected     = false;
          vm.afficherboutonnouveau      = 1 ;
          vm.afficherboutonModifSupr    = 0 ;
          vm.afficherboutonModif        = 0 ;
          vm.afficherboutonrapport      = 0 ;
          vm.affichageMasquefiltre2     = 1 ;         

        };

        vm.creefiche_vente_poissonnerie = function(filtre)
        {   
          
          vm.affiche_load = true ;
          vm.desactiveExport = true ;
          vm.text_load = 'Chargement export excel en cours...' ;
          var nom_poissonnerie = vm.selected_poissonnerie.nom ;
          var nom_region = vm.nom_region ;
          var repertoire2 = 'fiche_vente_poissonnerie/';   

            apiFactory.getParamsDynamic("SIP_export_vente_poissonnerie/index?id_poissonnerie="+vm.selected_poissonnerie.id+"&repertoire2="+
              repertoire2+"&nom_poissonnerie="+nom_poissonnerie+"&mois="+filtre.mois+"&annee="+filtre.annee+"&nom_region="+nom_region+
                "&commune="+vm.selected_poissonnerie.communes+"&district="+vm.selected_poissonnerie.districts).success(function (result)
            {
              var nom_file=result.response;
             

                try
                {
                  window.location = apiUrlExportexcel+repertoire2+nom_file ;
                  

                }catch(error)
                {

                }finally
                {
                  vm.affiche_load = false ;
                  vm.desactiveExport = false ;
                }
                 
            })
            .error(function (data)
            {
                alert('Error');
            });
        }

      // FIN EXPORT EXCEL Vente Poissonnerie


    // DEBUT REPORTING REQUETE

      vm.poissonnerie_reporting = [] ; // données affichent au DOM à la data table
      vm.entete_etat = [] ;
      vm.pivots = [
        {titre:"Req 1 : Quantité vendues par poissonneries",id:"req_1_vente_poissonneries"},
        {titre:"Req 2 : Quantité vendues par poissonneries/mois",id:"req_2_vente_poissonneries"},
        {titre:"Req 3 : Prix moyenne produits par poissonneries",id:"req_3_vente_poissonneries"},
        {titre:"Req 4 : Quantité vendues par famille",id:"req_4_vente_poissonneries"},
        {titre:"Req 5 : Prix moyenne par famille",id:"req_5_vente_poissonneries"},
        {titre:"Req 6 : Chiffre d'affaire par produits poissonneries",id:"req_6_vente_poissonneries"},
        {titre:"Req 7 : Quantité vendues produits par poissonneries",id:"req_7_vente_poissonneries"}
      ];

      vm.filtrerreports = function(filtres)
      {
        vm.affiche_load = true ;
        vm.text_load = 'Chargement en cours... Veuillez patienter s\'il vous plait!!!';
          apiFactory.getParamsDynamic("SIP_reporting_vente_poissonnerie/index?menu="+filtres.pivot).then(function(result)
          {
            
            vm.affiche_load = false ;
            vm.poissonnerie_reporting  = result.data.response ;
            //recupère en tête
              vm.entete_etat = Object.keys(vm.poissonnerie_reporting[0]).map(function(cle) {
              return (cle) ;
            });
          });  
      } 

      vm.exportExcel = function(filtres)
      {
        vm.affiche_load = true ;
        vm.text_load = 'Export Excel en cours... Veuillez patienter s\'il vous plait!!!';
        var repertoire = 'reporting_vente_poissonnerie';
          apiFactory.getParamsDynamic("SIP_reporting_vente_poissonnerie/index?menu_excel="+"excel_requetes"+"&menu="+
            filtres.pivot+"&repertoire="+repertoire).then(function(result)
          {
            
            vm.status    = result.data.status; 
          
            if(vm.status)
            {
                vm.nom_file = result.data.nom_file;            
                window.location = apiUrlExportexcel+"reporting_vente_poissonnerie/"+vm.nom_file ;
                vm.affiche_load =false; 

            }
            else{
                vm.message=result.data.message;
                vm.Alert('Export en excel',vm.message);
                vm.affiche_load =false; 
            }
          }
        );  
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