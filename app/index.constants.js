(function ()
{
    "use strict";

    angular
        .module("fuse")

    //Localhost
		.constant("apiUrl", "http://localhost/2019/peche/api/index.php/api/")
		.constant("apiUrlbase", "http://localhost/2019/peche/api/")
		.constant("apiUrlserver", "http://localhost/assets/ddb/")
		.constant("apiUrlexcel", "http://localhost/assets/excel/")
		.constant("apiUrlExportexcel", "http://localhost/2019/peche/export_excel/")
		.constant("api_down", "http://154.126.93.188/");
	//Localhost

	//interne ASTRUM
		/*.constant("apiUrl", "http://192.168.88.200/2019/peche/api/index.php/api/")
		.constant("apiUrlbase", "http://192.168.88.200/2019/peche/api/")
		.constant("apiUrlserver", "http://192.168.88.200/assets/ddb/")
		.constant("apiUrlexcel", "http://192.168.88.200/assets/excel/");*/
	//interne ASTRUM

	//externe ASTRUM
		/*.constant("apiUrl", "http://196.192.38.40/2019/peche/api/index.php/api/")
		.constant("apiUrlbase", "http://196.192.38.40/2019/peche/api/")
		.constant("apiUrlserver", "http://196.192.38.40/assets/ddb/")
		.constant("apiUrlexcel", "http://196.192.38.40/assets/excel/");*/
	//externe ASTRUM

	//interne PECHE
		/*.constant("apiUrl", "http://192.168.3.10/2019/peche/api/index.php/api/")
		.constant("apiUrlbase", "http://192.168.3.10/2019/peche/api/")
		.constant("apiUrlserver", "http://192.168.3.10/assets/ddb/")
		.constant("apiUrlexcel", "http://192.168.3.10/assets/excel/");*/
	//interne PECHE

	//externe PECHE
		/*.constant("apiUrl", "http://154.126.93.188/2019/peche/api/index.php/api/")
		.constant("apiUrlbase", "http://154.126.93.188/2019/peche/api/")
		.constant("apiUrlserver", "http://154.126.93.188/assets/ddb/")
		.constant("apiUrlexcel", "http://154.126.93.188/assets/excel/")
		.constant("apiUrlExportexcel", "http://154.126.93.188/2019/peche/export_excel/")
		.constant("api_down", "http://154.126.93.188/");*/

	//externe PECHE
})();
