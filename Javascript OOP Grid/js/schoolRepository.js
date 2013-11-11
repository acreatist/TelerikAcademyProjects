var schoolsRepository = (function(){
	var repoName = "";
	var repoData = [];

	if (!localStorage.getObject()) {
		localStorage.setObject(repoName, repoData);
	};

	return {
		save : function(repoName, repoData){
			localStorage.setObject(repoName, repoData);
		},

		load : function(repoName){
			return localStorage.getObject(repoName);
		}
	}
})();