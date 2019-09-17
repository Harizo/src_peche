(function ()
{
    'use strict';

    angular
        .module('app.peche.reporting.requetes')
        .controller('requetesController', requetesController);

    /** @ngInject */
    function requetesController($mdDialog, $scope, apiFactory, $state, apiUrlexcel)
    {
      var vm = this;
      
      vm.filtre = {} ;
      vm.now_date = new Date();
      vm.affichage_date_fin = true ;
      vm.annee = vm.now_date.getFullYear();
      vm.filtre.date_debut = vm.now_date ;
      vm.filtre.date_fin = vm.now_date ;
      vm.annees = [] ;
      vm.listes_mois = [] ;
      vm.datas = [] ;
      vm.affiche_load = false ;
      for (var i = 2012; i <= vm.annee; i++) {
        vm.annees.push(i);
      }

      vm.affiche_mois = function(mois_int)
      {
        switch (String(mois_int)) {
            case '1':
                return "Janvier";
                break;
            case '2':
                return "Février";
                break;
            case '3':
                return "Mars";
                break;
            case '4':
                return "Avril";
                break;
            case '5':
                return "Mai";
                break;
            case '6':
                return "Juin";
                break;
            case '7':
                return "Juillet";
                break;
            case '8':
                return "Août";
                break;
            case '9':
                return "Septembre";
                break;
            case '10':
                return "Octobre";
                break;
            case '11':
                return "Novembre";
                break;
            case '12':
                return "Décembre";
                break;
            
            default:
                return "";
                break;
        }
      }
      for (var i = 1; i <= 12; i++) {
        vm.listes_mois.push(i);
      }
      vm.filtre.annee = vm.annee ;

      //style
      vm.dtOptions = {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple_numbers'
      };

      vm.pivots = [
        //{titre:"Req 1 : CPUE journalière / Unité de pêche",id:"req_1"},
        {titre:"Req 1 : CPUE journalière / Unité de pêche",id:"req_1_site_date_unite_capturet_cpues"},
        {titre:"Req 2 : CPUEmoy par strate mineure/mois/année",id:"req_2_moi_unite_cpuemoy_stdevcpue_nbrechantillon_sqr_degre"},
        {titre:"Req 3 : Erreur relative CPUEmoy par strate mineure/mois/année",id:"req_3_moi_unite_cpuemoy_stdevcpue_nbrechantillon_sqr_fractil90_clcpue_erelative_maxcpue"},
        {titre:"Req 4.1 : Nombre unité de pêche par strate majeure/strate mineure /site",id:"req_4_1_annee_site_unite_nbrunite"},
        {titre:"Req 4.2 : Nombre unité de pêche par strate majeure/strate mineure /site",id:"req_4_2_annee_unite_nbrunite"},
        {titre:"Req 5.1 : PAB ou Probabilité d’Activité de Bateau (Echantillonnage horizontal)",id:"req_5_1_codeteteuniq_site_unite_date_phier_pavanthier_nbrjrssemdern_pabs"},
        {titre:"Req 5.2 : PABmoy par l’unité de pêche /strate majeure/strate mineure/Mois/Année",id:"req_5_2_unite_pabmoy_stdevpab_nbrechantilonpab_nbrjrpeche_sqr_degre"},
        {titre:"Req 5.3 : Erreur relative PABmoy par unité de pêche par strate mineure/Mois/Année",id:"req_5_3_unite_pabmoy_maxpab_stdevpab_sqr_fractil90_erelative_clpab"},
        {titre:"Req 5.4 : Nombre de jour de pêche PAB par l’unité de pêche/Strate majeur/Strate mineure /Mois /Année",id:"req_5_4_moi_jrmensuel_unite_pabmoy_jrpechemenspab_moymaxxpab_moynmaxxpabcor_maxjrpechemensupab"},
        {titre:"Req 6.1 : Total jour de pêche  annuelle par l’unité de pêche avec PAB",id:"req_6_1_annee_unite_totalannuel"},
        {titre:"Req 6.2 : Prix PAB par espèces par l’unité de pêche /Strate majeure/Strate mineure/Année/Mois",
        id:"req_6_2_moi_jrmensuel_site_unite_nbrunite_jrpechemenspab_jrtotalmensuel_cpuemoy_capturtotal_erelative_nbrechantillon_moymaxxpab_maxcpue_maxcapttot_clcapt_erelcapttot"},
        {titre:"Req 7.1 : Capture par espèces par l’unité de pêche par strate majeure/strate mineure/Année / Mois",id:"req_7_1_moi_unite_code3Al_caapture_prixunitmoy"},
        {titre:"Req 7.2 : Total capture par espèces par l’unité de pêche /strate majeure/strate mineure/Année/Mois",id:"req_7_2_moi_unite_caapture"},
        {titre:"Req 7.3 : Composition d’espèce par l’unité de pêche",id:"req_7_3_moi_unite_code3Al_captureespece_captureunite_composi_prixmoy"},
        {titre:"Req 8 : Prix PAB par espèces par l’unité de pêche/Strate majeure/Strate mineure/Année/Mois",
        id:"req_8_moi_site_unite_jrpechemenspab_jrtotalmensuel_code3Al_erelative_erelcapttot_nbrechantillon_capturtotal_composi_captureespece_prixmoy_pprix"},
        {titre:"Req 9 : Unité de pêche par site",id:"req_9_annee_site_unite_nbrunite"},
        {titre:"Req 10 : Targeted Unité de pêche par strate mineure par Année / Mois",id:"req_10_annee_region_unite_nbrunite"},
        
      ];

     /* vm.columns = [{titre:"Unié de pêche"},{titre:"Nbr unité de pêche dans l'enquête cadre"},{titre:'01'},{titre:"02"},{titre:"03"},{titre:"04"},
      {titre:"05"},{titre:"06"},{titre:"07"},{titre:"08"},{titre:"09"},{titre:"10"},{titre:"11"},{titre:"12"}];*/

      apiFactory.getAll("region/index").then(function(result)
      {
          vm.allregion= result.data.response;
      });

      apiFactory.getAll("district/index").then(function(result)
      {
          vm.alldistrict = result.data.response;
          vm.districts = vm.alldistrict ;
      });

      apiFactory.getAll("site_embarquement/index").then(function(result)
      {
          vm.allsite= result.data.response;
          vm.sites= result.data.response;
      });

      apiFactory.getAll("unite_peche/index").then(function(result)
      {
          vm.allunite_peche= result.data.response;
          vm.unite_peches= result.data.response;
      });

      apiFactory.getAll("espece/index").then(function(result)
      {
          vm.allespece = result.data.response;
          
      });

      vm.filtre_district = function()
      {
          vm.filtre.id_district ="*";
          vm.filtre.id_site_embarquement ="*";
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
          var date = new Date(dat);
          var mois = date.getMonth()+1;
          var dates = (date.getFullYear()+"-"+mois+"-"+date.getDate());
          return dates;
        }
          

      }

      vm.formatDateListe = function (dat)
      {
        if (dat) 
        {
          var date = new Date(dat);
          var mois = date.getMonth()+1;
          var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
          return dates;
        }
          

      }

      vm.parseFloat = function(int)
      {
        var float = parseFloat(int);
        var x = vm.replace_point(float.toFixed(2)) ;
        return x ;
      }

      vm.parseFloat_0 = function(int)
      {
        var float = parseFloat(int);
        var x = vm.replace_point(float.toFixed(0)) ;
        return x ;
      }

      vm.parseFloat_1 = function(int)
      {
        var float = parseFloat(int);
        var x = vm.replace_point(float.toFixed(1)) ;
        return x ;
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

      vm.controle_date = function()
      {
        if (vm.filtre.pivot == "req_1") 
        {
          vm.filtre.date_fin = vm.filtre.date_debut ;
          vm.affichage_date_fin = false ;
        }
        else
        {
          vm.affichage_date_fin = true ;
        }
      }

      vm.replace_point = function(nbr)
      {
        var str = ""+nbr ;
        var res = str.replace(".",",") ;
        return res ;
      }

      vm.convertion_kg_tonne = function(val)
      {
        if (val > 1000) 
        {
          var res = val/1000 ;
          var res_virg = vm.replace_point(res) ;

          return res_virg+" t" ;
        }
        else
        {
          var res_virg = vm.replace_point(val) ;

          return res_virg+" Kg" ;
        }
      }

      vm.cacher_table = function(mot_a_cherecher,string)
      {
          if (!string) 
          {
            string = "" ;
          }
          var res = string.indexOf(mot_a_cherecher);
          if (res != -1) 
          {
            return true ;
          }
          else
          {
            return false ;
          }
      }

      vm.filtrer = function(filtres)
      {
        vm.affiche_load = true ;

        /*var annee_debut = filtres.date_debut.getFullYear() ;
        var annee_fin = filtres.date_fin.getFullYear() ;
        var mois = filtres.date_debut.getMonth() + 1 ;*/
        var annee = filtres.annee ;
        var mois = filtres.mois ;

        var date = formatDateBDD(filtres.date_debut) ;

      
/*
        if (annee_debut != annee_fin) //raha tsy mitovy ny année anilay date debut sy fin
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
        
          apiFactory.getAPIgeneraliserREST("requetes/index","menu",vm.filtre.pivot,"annee",annee,"mois",mois,"date",date,
            "id_unite_peche",filtres.id_unite_peche,"id_espece",filtres.id_espece,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement).then(function(result)
          {
            console.log(result.data.response);
            vm.datas = result.data.response;
            vm.affiche_load = false ;
            
          });

          /*apiFactory.getAPIgeneraliserREST("requetes_6/index","menu",vm.filtre.pivot,"annee",annee,"mois",mois,"date",date,
            "id_unite_peche",filtres.id_unite_peche,"id_espece",filtres.id_espece,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement).then(function(result)
          {
            console.log(result.data.response);
            vm.datas = result.data.response;
            vm.affiche_load = false ;
            
          });*/    
      }

      vm.export_excel = function(filtres)
      {
        vm.affiche_load = true ;
        var annee = filtres.annee ;
        var mois = filtres.mois ;

        var date = formatDateBDD(filtres.date_debut) ;
        var repertoire = 'requetes';

          apiFactory.getAPIgeneraliserREST("requetes/index","menu",vm.filtre.pivot,"menu_excel","excel_requetes","annee",annee,"mois",mois,"date",date,
            "id_unite_peche",filtres.id_unite_peche,"id_espece",filtres.id_espece,"id_region",filtres.id_region,"id_district",filtres.id_district,
            "id_site_embarquement",filtres.id_site_embarquement,"repertoire",repertoire).then(function(result)
          {
            vm.status    = result.data.status; 
          
            if(vm.status)
            {
                vm.nom_file = result.data.nom_file;            
                window.location = apiUrlexcel+"requetes/"+vm.nom_file ;
                vm.affiche_load =false; 

            }else{
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
    }

})();
