(function ()
{
   'use strict';

   angular
   .module('app.peche.sip.vente_poissonnerie')
   .controller('vente_poissonnerieController', vente_poissonnerieController);
   /** @ngInject */
   function vente_poissonnerieController($mdDialog, $scope, apiFactory, $state)  
   {
     

var vm = this;

        

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
            vm.all_region = result.data.response;
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
         var nbr=parseFloat(nombre).toFixed(0);
         if (typeof nbr != 'undefined' && parseInt(nbr) >= 0) 
         {
            nbr += '';
            var sep = ' ';
            var reg = /(\d+)(\d{3})/;
            while (reg.test(nbr)) 
            {
               nbr = nbr.replace(reg, '$1' + sep + '$2');
            }
            return nbr;
         } 
         else 
         {
         return "";
         }
      }


      vm.replace_point = function(nbr)
      {
         var str = ""+nbr ;
         var res = str.replace(".",",") ;
         return res ;
      }


      //poissonnerie

         vm.selected_poissonnerie = {};

         var nouvel_col_poiss = false ;

         vm.affichage_masque_poissonnerie = false ;

         vm.entete_liste_poissonnerie = 
           [
            {titre:"nom"},
            {titre:"localisation"},
            {titre:"adresse"},
            {titre:'région'},
            {titre:"rcs"},
            {titre:"stat"},
            {titre:"nif"},
            {titre:"tèl"}
           ] ;

         apiFactory.getAll("SIP_poissonnerie/index").then(function(result)
         {
           vm.affiche_load = false ;
            vm.all_poissonnerie = result.data.response;
         });


         vm.affichage_col_poiss = function(int)
         {
            if (int == '0') 
               return "Non";
            else
               return "Oui";
         }

         vm.selection_poissonnerie = function(cm)
         {
            vm.selected_poissonnerie = cm ;

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
            vm.col_poiss                     = {};
            vm.selected_poissonnerie         = {};
            vm.affichage_masque_poissonnerie = true ;
            nouvel_col_poiss                 = true ;
         }

         vm.convert_int_to_boll = function(int)
         {
            if (int == '0') 
               return false;
            else
               return true;
         }

         vm.convert_bool_to_int = function(int)
         {
            if (int) 
               return "1";
            else
               return "0";
         }

         vm.modif_col_poiss = function()
         {
            nouvel_col_poiss = false ;
            vm.affichage_masque_poissonnerie = true ;

            vm.col_poiss.nom           = vm.selected_poissonnerie.nom ;
            vm.col_poiss.localisation  = vm.selected_poissonnerie.localisation ;
            vm.col_poiss.adresse       = vm.selected_poissonnerie.adresse ;
            vm.col_poiss.rcs           = vm.selected_poissonnerie.rcs ;
            vm.col_poiss.stat          = vm.selected_poissonnerie.stat;
            vm.col_poiss.nif           = vm.selected_poissonnerie.nif ;
            vm.col_poiss.tel           = vm.selected_poissonnerie.tel ;
            vm.col_poiss.id_region     = vm.selected_poissonnerie.id_region ;
            
         }

         vm.annuler_col_poiss = function()
         {
            nouvel_col_poiss = false ;
            vm.affichage_masque_poissonnerie = false ;
            vm.selected_poissonnerie = {};         }



         vm.supprimer_col_poiss = function() 
         {
            vm.affichage_masque_poissonnerie = false ;
            
            var confirm = $mdDialog.confirm()
              .title('Etes-vous sûr de supprimer cet enregistrement ?')
              .textContent('')
              .ariaLabel('Lucky day')
              .clickOutsideToClose(true)
              .parent(angular.element(document.body))
              .ok('ok')
              .cancel('annuler');
              apiFactory.getParamsDynamic("sip_saisie_vente_poissonnerie/index?id_poissonnerie="+vm.selected_poissonnerie.id+"").then(function(result)
              {
                if(result.data.response.length>0) 
                {
                  vm.dialog();
                  vm.saisie_vente = result.data.response.length;
                }
                else
                { 
            
                  $mdDialog.show(confirm).then(function() {
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

            console.log(data) ; 

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
            
            dg.titre_column = [
                        
                        {titre:" Saisie vente Poissonnerie"}
            ]; 
            dg.cancel = function()
            {
              $mdDialog.hide('ok');
              console.log('cancel');
            };
          }

         vm.save_in_bdd = function(data_masque, etat_suppression)
         {
            var config = {
                   headers : {
                       'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                   }
               };

               var id = 0 ;

               if (!nouvel_col_poiss) 
               {
                  id = vm.selected_poissonnerie.id ;
               }



               var datas = $.param(
               {
                  
                   id:              id,      
                   supprimer:       etat_suppression,
                   id_region:       data_masque.id_region,
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

               var reg = vm.all_region.filter(function(obj)
               {
                  return obj.id == data_masque.id_region;
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

                    vm.selected_poissonnerie.id_region       = data_masque.id_region ; 
                    vm.selected_poissonnerie.nom_region      = reg[0].nom ;

                  }
                  else//Suppression
                  {
                     vm.all_poissonnerie = vm.all_poissonnerie.filter(function(obj)
                     {
                        return obj.id !== vm.selected_poissonnerie.id;
                     });

                  }

               }
               else
               {
                  var item =
                  {
                     id:String(data.response) ,
                     id_region:    data_masque.id_region ,
                     nom_region:   reg[0].nom,

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


            })
            .error(function (data) {alert("Une erreur s'est produit");}); 
         }
      //FIN poissonnerie

      //SAISIE VENTE POISSONNERIE
         vm.selected_vente_poissonnerie = {};
         vm.vente_poissonnerie = {};


         vm.get_vente_poissonnerie = function()
         {

            vm.affiche_load = true ;
            apiFactory.getAPIgeneraliserREST("SIP_saisie_vente_poissonnerie/index","id_poissonnerie",vm.selected_poissonnerie.id).then(function(result)
            {
              vm.affiche_load = false ;
               vm.all_saisie_vente_poissonnerie = result.data.response;

            });

         }


         var nouvel_vente_poissonnerie = false ;

         vm.affichage_masque_vente_poissonnerie = false ;

         vm.entete_liste_vente_poissonnerie = 
           [
            {titre:"Désignation article"},
            {titre:"Origine produit"},
            {titre:'référence fournisseur'},
            {titre:"Qté vendue"},
            {titre:"Chiffre d'affaire"},
            {titre:"Prix"},
            {titre:"Observations"},
            {titre:"Famille"},
            {titre:"Présentation"},
            {titre:"Conservation"}
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

         $scope.$watch('vm.vente_poissonnerie.prix_kg', function()
         {
            if (!vm.vente_poissonnerie.prix_kg) return;

            vm.vente_poissonnerie.chiffre_affaire = vm.vente_poissonnerie.prix_kg * vm.vente_poissonnerie.quantite_vendu;
            

         });

         $scope.$watch('vm.vente_poissonnerie.quantite_vendu', function()
         {
            if (!vm.vente_poissonnerie.quantite_vendu) return;

            vm.vente_poissonnerie.chiffre_affaire = vm.vente_poissonnerie.prix_kg * vm.vente_poissonnerie.quantite_vendu;
            

         });
      
         vm.ajout_col = function()
         {
            vm.vente_poissonnerie = {};
            vm.selected_vente_poissonnerie = {};
            vm.affichage_masque_vente_poissonnerie = true ;
            nouvel_vente_poissonnerie = true ;
         }

         vm.modif_col = function()
         {
            nouvel_vente_poissonnerie = false ;
            vm.affichage_masque_vente_poissonnerie = true ;

            vm.vente_poissonnerie.observations        = vm.selected_vente_poissonnerie.observations ;
            vm.vente_poissonnerie.origine_produits    = vm.selected_vente_poissonnerie.origine_produits ;
            vm.vente_poissonnerie.designation_article = vm.selected_vente_poissonnerie.designation_article ;
            vm.vente_poissonnerie.reference_fournisseur = vm.selected_vente_poissonnerie.reference_fournisseur ;

            vm.vente_poissonnerie.famille_rh          = vm.selected_vente_poissonnerie.famille_rh ;
            vm.vente_poissonnerie.id_presentation     = vm.selected_vente_poissonnerie.id_presentation ;
            vm.vente_poissonnerie.id_conservation     = vm.selected_vente_poissonnerie.id_conservation ;

            vm.vente_poissonnerie.quantite_vendu      = Number(vm.selected_vente_poissonnerie.quantite_vendu) ;
            vm.vente_poissonnerie.prix_kg             = Number(vm.selected_vente_poissonnerie.prix_kg) ;
            vm.vente_poissonnerie.chiffre_affaire     = Number(vm.selected_vente_poissonnerie.chiffre_affaire) ;
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
         }

         vm.save_in_bdd_vente_poissonnerie = function(data_masque, etat_suppression)
         {
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var id = 0 ;

            if (!nouvel_vente_poissonnerie) 
            {
               id = vm.selected_vente_poissonnerie.id ;
            }

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
                
                quantite_vendu:           data_masque.quantite_vendu,
                prix_kg:                  data_masque.prix_kg,
                chiffre_affaire:          data_masque.chiffre_affaire,
               
                
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
            /*
                        var poiss = vm.all_poissonnerie.filter(function(obj)
                        {
                           return obj.id == data_masque.id_poissonnerie;
                        });
            */
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

                  quantite_vendu:         data_masque.quantite_vendu,
                  prix_kg:                data_masque.prix_kg,
                  chiffre_affaire:        data_masque.chiffre_affaire

                                  
               }          
               vm.all_saisie_vente_poissonnerie.unshift(item);
            
            nouvel_vente_poissonnerie = false ;
            }

            vm.affichage_masque_vente_poissonnerie = false ;
            }).error(function (data) {alert("Une erreur s'est produit");});
         }
         
      //FIN SAISIE VENTE POISSONNERIE

   }
})();