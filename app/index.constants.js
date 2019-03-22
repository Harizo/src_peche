(function ()
{
    "use strict";

    angular
        .module("fuse")

    //Localhost
		/*.constant("apiUrl", "http://localhost/2019/peche/api/index.php/api/")
		.constant("apiUrlbase", "http://localhost/2019/peche/api/")
		.constant("apiUrlserver", "http://localhost/assets/ddb/");*/
	//Localhost

	//interne ASTRUM
		/*.constant("apiUrl", "http://192.168.88.200/2019/peche/api/index.php/api/")
		.constant("apiUrlbase", "http://192.168.88.200/2019/peche/api/")
		.constant("apiUrlserver", "http://192.168.88.200/assets/ddb/");*/
	//interne ASTRUM

	//externe ASTRUM
		.constant("apiUrl", "http://196.192.38.40/2019/peche/api/index.php/api/")
		.constant("apiUrlbase", "http://196.192.38.40/2019/peche/api/")
		.constant("apiUrlserver", "http://196.192.38.40/assets/ddb/");

	//externe ASTRUM
})();
