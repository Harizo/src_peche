(function ()
{
    'use strict';

    angular
        .module('app.peche.sip.production_commerce_region')
        .controller('production_commerce_regionController', production_commerce_regionController);

    /** @ngInject */
    function production_commerce_regionController(apiFactory, $scope, $mdDialog, apiUrlExportexcel, $rootScope)
    {
        var vm = this;
        vm.filtre={} ;
        vm.affiche_load = true ;

		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			order:[] 
		};

		//CLE ETRANGERE
			
			apiFactory.getAll("region/index").then(function(result)
			{
				vm.affiche_load = false ;
				vm.all_region = result.data.response;
		
			});

			apiFactory.getAll("district/index").then(function(result)
			{
				vm.all_district = result.data.response;
				
			});

			vm.get_ditrict_by_region = function()
			{
				vm.all_district_by_region = vm.all_district.filter(function(obj)
				{
					return obj.region.id == vm.production_commercialisation_region.id_region;
				});
			}

			apiFactory.getAll("SIP_type_espece/index").then(function(result)
			{
				vm.all_type_espece = result.data.response;
			});

			apiFactory.getParamsDynamic("SIP_production_commercialisation_region/index?get_annee="+true).then(function(result)
			{
				
				vm.all_annee = result.data.response;
				
			});



			//id_type_espece = 1 (halieutique)
			/*apiFactory.getAPIgeneraliserREST("SIP_espece/index","id_type_espece",1).then(function(result)
			{
				vm.all_espece = result.data.response;
				
			});*/

		//FIN CLE ETRANGERE

		vm.date_now = new Date();

		vm.affiche_load = true ;

		var nouvel_production_commercialisation_region = false ;

		vm.selected_production_commercialisation_region = true ;

		vm.selected_production_commercialisation_region = {};
		

		vm.entete_liste_production_commercialisation_region = 
	        [
				{titre:"Code activ"},
				{titre:"Code dom"},
				{titre:"Code act_dom"},
				{titre:"Annee"},
				{titre:"Mois"},
				{titre:"Espèce"},
				{titre:"Quantité"},
				{titre:"Quantité en nombre"},
				{titre:"Code comm"},
				{titre:"Quantité comm"},
				{titre:"Région"},
				{titre:"District"}
	        ] ;

		
	    vm.all_production_commercialisation_region = [];
		vm.get_prod_com_by_region = function()
		{
			vm.affiche_load = true ;
			vm.filtre.id_type_espece = null ;
			apiFactory.getParamsDynamic("SIP_production_commercialisation_region/index?id_region="+vm.production_commercialisation_region.id_region+"&annee="+vm.production_commercialisation_region.annee).then(function(result)
			{
				vm.affiche_load = false ;
				vm.all_production_commercialisation_region = result.data.response;
				
			});
		}

		vm.get_espece = function() 
		{
			vm.affiche_load = true ;
			vm.all_espece = [] ;
			apiFactory.getParamsDynamic("SIP_espece/index?id_type_espece="+vm.filtre.id_type_espece).then(function(result)
			{
				vm.affiche_load = false ;
				vm.all_espece = result.data.response;

				$rootScope.all_espece = vm.all_espece ;
				
			});	
		}


		$scope.showTabDialog = function() 
			{
			    $mdDialog.show({
			      controller: DialogController,
			      templateUrl: 'app/main/peche/sip/production_commerce_region/dialog.html',
			      parent: angular.element(document.body),
			      
			      clickOutsideToClose:true
			    })
		        .then(function(answer) {
		          $scope.status = 'You said the information was "' + answer + '".';

      				vm.production_commercialisation_region.id_espece = answer.id;
		          		
		          
		        }, function() {
		          $scope.status = 'You cancelled the dialog.';
		        });
		  	};

		$scope.$watch('vm.filtre.id_type_espece', function()
        {
			
			if (!vm.filtre.id_type_espece) return;

          	if (vm.filtre.id_type_espece) 
            	vm.get_espece() ;
		});

		vm.selection_production_commercialisation_region = function(cm)
		{
			vm.selected_production_commercialisation_region = cm ;

		}

		$scope.$watch('vm.selected_production_commercialisation_region', function()
		{
			if (!vm.all_production_commercialisation_region) return;
			vm.all_production_commercialisation_region.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selected_production_commercialisation_region.$selected = true;

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

		function convert_to_date_sql(date)
		{   
			if(date)
			{
				var d     = new Date(date);
				var jour  = d.getDate();
				var mois  = d.getMonth()+1;
				var annee = d.getFullYear();
				if(mois <10)
				{
					mois = '0' + mois;
				}
				if(jour <10)
				{
					jour = '0' + jour;
				}
				var date_final= annee+"-"+mois+"-"+jour;
				return date_final
			}      
		}

		vm.convert_to_date_html = function(date)
		{   
			if(date)
			{
				var d     = new Date(date);
				var jour  = d.getDate();
				var mois  = d.getMonth()+1;
				var annee = d.getFullYear();
				if(mois <10)
				{
					mois = '0' + mois;
				}
				if(jour <10)
				{
					jour = '0' + jour;
				}
				var date_final= jour+"-"+mois+"-"+annee;
				return date_final
			}      
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


		vm.ajout_production_commercialisation_region = function()
		{
			vm.col_mar = {};
			vm.affiche_load = false ;
			vm.production_commercialisation_region = {};
			vm.affichage_masque_production_commercialisation_region = true ;
			nouvel_production_commercialisation_region = true ;
		}

		vm.modif_production_commercialisation_region = function()
		{
			nouvel_production_commercialisation_region = false ;
			vm.affichage_masque_production_commercialisation_region = true ;
			vm.affiche_load = false ;

			apiFactory.getParamsDynamic("SIP_espece/index?id="+vm.selected_production_commercialisation_region.id_espece).then(function(result)
			{
				
				vm.filtre.id_type_espece = result.data.response.typ_esp_id ;

			});
			
			vm.production_commercialisation_region.code_activ = vm.selected_production_commercialisation_region.code_activ ;
			vm.production_commercialisation_region.code_dom = vm.selected_production_commercialisation_region.code_dom ;
			vm.production_commercialisation_region.code_act_dom = vm.selected_production_commercialisation_region.code_act_dom ;
			vm.production_commercialisation_region.annee = vm.selected_production_commercialisation_region.annee ;
			vm.production_commercialisation_region.mois = vm.selected_production_commercialisation_region.mois ;

			vm.production_commercialisation_region.id_espece = vm.selected_production_commercialisation_region.id_espece ;

			vm.production_commercialisation_region.id_region = vm.selected_production_commercialisation_region.id_region ;
			vm.production_commercialisation_region.id_district = vm.selected_production_commercialisation_region.id_district ;

			vm.production_commercialisation_region.quantite_en_nbre = Number(vm.selected_production_commercialisation_region.quantite_en_nbre) ;
			vm.production_commercialisation_region.quantite = Number(vm.selected_production_commercialisation_region.quantite) ;
			vm.production_commercialisation_region.code_comm = (vm.selected_production_commercialisation_region.code_comm) ;
			vm.production_commercialisation_region.quantite_comm = Number(vm.selected_production_commercialisation_region.quantite_comm) ;
		}


		vm.supprimer_production_commercialisation_region = function()
		{
			vm.affichage_masque_production_commercialisation_region = false ;
			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('ok')
			  .cancel('annuler');
			$mdDialog.show(confirm)
			.then(
				function() 
				{
					vm.save_in_bdd_production_commercialisation_region(vm.selected_production_commercialisation_region,1);
				}, 
				function() 
				{

				}
			);
		}


		vm.annuler_production_commercialisation_region = function()
		{
			nouvel_production_commercialisation_region = false ;
			vm.affichage_masque_production_commercialisation_region = false ;
			vm.affiche_load = false ;
			vm.selected_production_commercialisation_region = {};
			vm.filtre.id_type_espece = null ;
		}


		vm.save_in_bdd_production_commercialisation_region = function(data_masque, etat_suppression)
		{
			var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };

            var id = 0 ;
            vm.affiche_load = true ;

            if (!nouvel_production_commercialisation_region) 
            {
            	id = vm.selected_production_commercialisation_region.id ;
            }

            var datas = $.param(
            {
            	
                id:id,            
                supprimer:etat_suppression,
                code_activ:data_masque.code_activ,
                code_dom:data_masque.code_dom,
                code_act_dom:data_masque.code_act_dom,
                annee:data_masque.annee,
                mois:data_masque.mois,
                id_espece:data_masque.id_espece,
                quantite:data_masque.quantite,
                quantite_en_nbre:data_masque.quantite_en_nbre,
                code_comm:data_masque.code_comm,
                quantite_comm:data_masque.quantite_comm,
                id_region:data_masque.id_region,
                id_district:data_masque.id_district
               
                
            });

            apiFactory.add("SIP_production_commercialisation_region/index",datas, config).success(function (data)
    		{
    			var reg = vm.all_region.filter(function(obj)
				{
					return obj.id == data_masque.id_region;
				});

				var dis = vm.all_district.filter(function(obj)
				{
					return obj.id == data_masque.id_district;
				});
				
				var esp = vm.all_espece.filter(function(obj)
				{
					return obj.id == data_masque.id_espece;
				});

    			if (!nouvel_production_commercialisation_region) 
    			{
    				if (etat_suppression == 0) 
    				{


    					vm.selected_production_commercialisation_region.code_activ = data_masque.code_activ ;
    					vm.selected_production_commercialisation_region.code_dom = data_masque.code_dom ;
    					vm.selected_production_commercialisation_region.code_act_dom = data_masque.code_act_dom ;
    					vm.selected_production_commercialisation_region.annee = data_masque.annee ;
    					vm.selected_production_commercialisation_region.mois = data_masque.mois ;

    					vm.selected_production_commercialisation_region.id_espece = data_masque.id_espece ;
    					vm.selected_production_commercialisation_region.nom = esp[0].nom ;
    					vm.selected_production_commercialisation_region.nom_scientifique = esp[0].nom_scientifique ;
    					vm.selected_production_commercialisation_region.nom_francaise = esp[0].nom_francaise ;
    					vm.selected_production_commercialisation_region.nom_local = esp[0].nom_local ;

    					vm.selected_production_commercialisation_region.id_region = data_masque.id_region ;
    					vm.selected_production_commercialisation_region.nom_region = reg[0].nom ;

    					vm.selected_production_commercialisation_region.id_district = data_masque.id_district ;
    					vm.selected_production_commercialisation_region.nom_district = dis[0].nom ;

    					vm.selected_production_commercialisation_region.quantite = data_masque.quantite ;
						vm.selected_production_commercialisation_region.quantite_en_nbre = data_masque.quantite_en_nbre ;
						vm.selected_production_commercialisation_region.code_comm = data_masque.code_comm ;
						vm.selected_production_commercialisation_region.quantite_comm = data_masque.quantite_comm ;

    				}
    				else
    				{
    					vm.all_production_commercialisation_region = vm.all_production_commercialisation_region.filter(function(obj)
						{
							return obj.id !== vm.selected_production_commercialisation_region.id;
						});
    				}
    			}
    			else
    			{
    				var item =
		            {
						id:String(data.response) ,


						code_activ:data_masque.code_activ,
						code_dom:data_masque.code_dom,
						code_act_dom:data_masque.code_act_dom,
						annee:data_masque.annee,
						mois:data_masque.mois,

						id_espece : data_masque.id_espece ,
    					nom : esp[0].nom ,
    					nom_scientifique : esp[0].nom_scientifique ,
    					nom_francaise : esp[0].nom_francaise ,
    					nom_local : esp[0].nom_local ,

						id_region:data_masque.id_region,
						nom_region:reg[0].nom,

						id_district:data_masque.id_district,
						nom_district:dis[0].nom,

						quantite_en_nbre:data_masque.quantite_en_nbre,
						quantite:data_masque.quantite,
						code_comm:data_masque.code_comm,
						quantite_comm:data_masque.quantite_comm

		                            
					}          
		            vm.all_production_commercialisation_region.unshift(item);
    			}

    			vm.affichage_masque_production_commercialisation_region = false ;
    			nouvel_production_commercialisation_region = false ;
    			vm.affiche_load = false ;
    		})
    		.error(function (data) {alert("Une erreur s'est produit");});
		}

		
		// DEBUT REPORTING REQUETE

	      	vm.reporting_production_commerce_region = [] ; // données affichent au DOM à la data table
	      	vm.entete_etat = [] ;
	      	vm.modules = [
		        {titre:"Productions",id:"production"},
		        {titre:"Commercialisation",id:"commercialisation"},
		        {titre:"Production nationale",id:"product_national"}
	      	];

	      	vm.pivots = 
	      	[
		        {titre: "Quantité production par région",id:"qte_production_par_region",module:"production"},
		        {titre: "Quantité production par mois",id:"qte_production_par_region_mois",module:"production"},
		        {titre: "Production région nombre",id:"production_region_nombre",module:"production"},
		        {titre: "Production par mois nombre",id:"production_par_region_mois_nombre",module:"production"},
		        
		        {titre: "Quantité commercialisée",id:"quantite_commercialise",module:"commercialisation"},
		        {titre: "Quantité commercialisée par mois",id:"quantite_commercialise_par_mois",module:"commercialisation"},
		        {titre: "Quantité commercialisée région mois",id:"quantite_commercialise_region_mois",module:"commercialisation"},
		        
		        {titre: "Quantité production nationale",id:"quantite_production_nationale",module:"product_national"}
	      	];
	      
		    vm.get_requete_etat = function(data_masque, etat_exportExcel)
		    {
		        vm.affiche_load = true ;
		        vm.text_load = "Chargement en cours... Veuillez patienter s'il vous plait!!!";
	            var repertoire = 'reporting_production_commerce_region/';

	            var choix_module = vm.modules.filter(function(obj)
				{
					return obj.id == data_masque.module ;
				});

				var choix_pivot = vm.pivots.filter(function(obj)
				{
					return obj.id == data_masque.pivot ;
				});

	          	apiFactory.getParamsDynamic("SIP_reporting_production_commercialisation_region/index?menu="+data_masque.pivot+
	          		"&module="+data_masque.module+"&titre_etat="+choix_pivot[0].titre+"&titre_module="+choix_module[0].titre+
	          		"&etat_exportExcel="+etat_exportExcel+"&repertoire="+repertoire).then(function(result)
	          	{

		            vm.affiche_load = false ;
		            
		            if (etat_exportExcel==1) 
		            {
		            	vm.status    = result.data.status; 
		          
			            if(vm.status)
			            {
			                vm.nom_file = result.data.nom_file; 
			                vm.sous_repertoire = result.data.sous_repertoire ; 
			                window.location = apiUrlExportexcel+repertoire+vm.sous_repertoire+vm.nom_file ;
			                vm.affiche_load =false; 

			            }
			            else{
			                vm.message=result.data.message;
			                vm.Alert('Export en excel',vm.message);
			                vm.affiche_load =false; 
			            }
		            }
		            else
		            {
		            	vm.reporting_production_commerce_region  = result.data.response ;

		            	// recupère en tête
		              	vm.entete_etat = Object.keys(vm.reporting_production_commerce_region[0]).map(function(cle) {
		              		return (cle) ;
		            	});
			            
			            // recupère total en pied
			            vm.total = result.data.total ;

		           		if (data_masque.pivot=='quantite_production_nationale')
		            		vm.reporting_production_commerce_region.push(vm.total) ;
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

    function DialogController($scope, $mdDialog, $rootScope) 
    {
    	
    	$scope.selected_item = {};
		  $scope.hide = function() {
		    $mdDialog.hide();
		  };

		  $scope.cancel = function() {
		    $mdDialog.cancel();

		  };

		  $scope.answer = function(answer) {

		  	
		    $mdDialog.hide($scope.selected_item);
		  };

		$scope.selection = function (item) 
		{        
			

			$scope.selected_item = item;
			

			$scope.all_espece.forEach(function(item) {
		      item.$selected = false;
		    });
		    $scope.selected_item.$selected = true;

		};

	    $scope.all_espece =  $rootScope.all_espece ;

	  $scope.entete_espece = 
		[ 
			
			{"titre":"Code 3 Alpha"},
			{"titre":"Espèce"},
			{"titre":"Nom scientifique"},
			{"titre":"Nom française"},
			{"titre":"Nom local"}
		];

		$scope.dtOptions = {
	       dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			retrieve:'true',
			order:[] 
	    };
	}
})();
