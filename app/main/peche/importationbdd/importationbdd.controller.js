(function ()
{
    'use strict';

    angular
        .module('app.peche.importationbdd')
        .controller('ImportationbddController', ImportationbddController);

    /** @ngInject */
    function ImportationbddController(apiFactory, $location, $mdDialog, $scope,$timeout, $q, $log,$http,apiUrl,apiUrlbase)
    {
      var vm = this;

		vm.allSite = [];
		vm.cliquable=1;
		vm.selectedItem = {} ;
		vm.selectedItemsite = {} ;
		vm.selectedItemenqueteur = {} ;
		vm.selectedItemtypeengin = {} ;
		vm.selectedItemtypecanoe = {} ;
		vm.selectedItemespece = {} ;
		vm.selectedItemsiteenqueteur = {} ;
		vm.selectedItemunitepeche = {} ;
		vm.selectedItemunitepechesite = {} ;
		vm.infoAssuj = {} ;
		vm.allfokontany=[];
		vm.allenqueteur=[];
		vm.allsiteembarquement=[];
		vm.alltypeengin=[];
		vm.alltypecanoe=[];
		vm.allespece=[];
		vm.allsiteenqueteur=[];
		vm.allunitepeche=[];
		vm.allunitepechesite=[];
        vm.myFile={};
		vm.fichier='';
		vm.fokontany_column = [{titre:"Code"},{titre:"Nom"},{titre:"Commune"}];
		vm.site_column = [{titre:"Id"},{titre:"Code"},{titre:"Code unique"},{titre:"Libellé"},{titre:"Région"}];
		vm.enqueteur_column = [{titre:"Id"},{titre:"Nom"}];
		vm.typeengin_column = [{titre:"Id"},{titre:"Code"},{titre:"Libelle"}];
		vm.typecanoe_column = [{titre:"Id"},{titre:"Code"},{titre:"Nom"}];
		vm.espece_column = [{titre:"Id"},{titre:"Code"},{titre:"Nom local"},{titre:"Nom scientifique"}];
		vm.unite_peche_column = [{titre:"Id"},{titre:"Nom"}];
		vm.unite_peche_site_column = [{titre:"Id"},{titre:"Libelle"},{titre:"Site"},{titre:"Région"}];
		vm.site_enqueteur_column = [{titre:"Id"},{titre:"Nom"},{titre:"Site"},{titre:"Libellé"}];

		vm.dtOptions = {
			dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth : false,
			responsive: true
		};
		apiFactory.getAll("region/index").then(function(result){
			vm.allfokontany=result.data.response;
			vm.listefokontany =vm.allfokontany
		});
 		vm.importexcel = function() {

 				vm.affiche_load =true;
				vm.cliquable=0;
				vm.allenqueteur=[];
				vm.allsiteembarquement=[];
				vm.alltypeengin=[];
				vm.alltypecanoe=[];
				vm.allespece=[];
				vm.allsiteenqueteur=[];
				vm.allunitepeche=[];
				vm.allunitepechesite=[];
				var bla = $.post(apiUrl + "importbddaccess/importerbasededonnees",{
				// var bla = $.post(apiUrl + "importbddaccess/importerbasededonneesespececapture",{
					repertoire:'importbdd/',
					// nomfichier : vm.fichier
				},function(data){		
					vm.affiche_load =false;
					vm.cliquable=1;
					vm.allenqueteur=data[0].enqueteur;
					vm.allsiteembarquement=data[0].site_embarquement;
					vm.alltypeengin=data[0].type_engin;
					vm.alltypecanoe=data[0].type_canoe;
					vm.allespece=data[0].espece;
					vm.allsiteenqueteur=data[0].site_enqueteur;
					vm.allunitepeche=data[0].unite_peche;
					vm.allunitepechesite=data[0].unite_peche_site;
				/*	console.log(vm.allenqueteur);
					console.log(vm.allespece);
					console.log(vm.allsiteembarquement);
					console.log(vm.allsiteenqueteur);*/
					console.log(vm.alltypeengin);
					console.log(vm.alltypecanoe);
					console.log(vm.allunitepeche);
					console.log(vm.allunitepechesite);
					vm.showAlert("INFORMATION","Importation terminé !. Merci")
				});
		} 
		vm.showAlert = function(titre,textcontent) {
			// Appending dialog to document.body to cover sidenav in docs app
			// Modal dialogs should fully cover application
			// to prevent interaction outside of dialog
			$mdDialog.show(
			  $mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(false)
				.parent(angular.element(document.body))
				.title(titre)
				.textContent(textcontent)
				.ariaLabel('Alert Dialog Demo')
				.ok('Fermer')
				.targetEvent()
			);
		}      
		vm.selectionsite = function (item) {        
			vm.selectedItemsite = item;
		};
		$scope.$watch('vm.selectedItemsite', function() {
			if (!vm.allsiteembarquement) return;
			vm.allsiteembarquement.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemsite.$selected = true;
		});    
		vm.selectionenqueteur = function (item) {        
			vm.selectedItemenqueteur = item;
		};
		$scope.$watch('vm.selectedItemenqueteur', function() {
			if (!vm.allenqueteur) return;
			vm.allenqueteur.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemenqueteur.$selected = true;
		});    
		vm.selectiontypeengin = function (item) {        
			vm.selectedItemtypeengin = item;
		};
		$scope.$watch('vm.selectedItemtypeengin', function() {
			if (!vm.alltypeengin) return;
			vm.alltypeengin.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemtypeengin.$selected = true;
		});    
		vm.selectiontypecanoe = function (item) {        
			vm.selectedItemtypecanoe = item;
		};
		$scope.$watch('vm.selectedItemtypecanoe', function() {
			if (!vm.alltypecanoe) return;
			vm.alltypecanoe.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemtypecanoe.$selected = true;
		});    
		vm.selectionespece = function (item) {        
			vm.selectedItemespece = item;
		};
		$scope.$watch('vm.selectedItemespece', function() {
			if (!vm.allespece) return;
			vm.allespece.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemespece.$selected = true;
		});    
		vm.selectionsiteenqueteur = function (item) {        
			vm.selectedItemsiteenqueteur = item;
		};
		$scope.$watch('vm.selectedItemsiteenqueteur', function() {
			if (!vm.allsiteenqueteur) return;
			vm.allsiteenqueteur.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemsiteenqueteur.$selected = true;
		});    
		vm.selectionunitepeche = function (item) {        
			vm.selectedItemunitepeche = item;
		};
		$scope.$watch('vm.selectedItemunitepeche', function() {
			if (!vm.allunitepeche) return;
			vm.allunitepeche.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemunitepeche.$selected = true;
		});    
		vm.selectionunitepechesite = function (item) {        
			vm.selectedItemunitepechesite = item;
		};
		$scope.$watch('vm.selectedItemunitepechesite', function() {
			if (!vm.allunitepechesite) return;
			vm.allunitepechesite.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemunitepechesite.$selected = true;
		});    
    }
})();
