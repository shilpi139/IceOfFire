myApp.factory('mainService',function MainFactory($http, $q, $rootScope){
    var bookAPIS  =  {};

	bookAPIS.getAllBooks = function(){
		return $http({
		  method: 'GET',
		  url: 'https://anapioficeandfire.com/api/books?page=1&pageSize=50'
		})	
	}

	bookAPIS.getAllCharacters = function(pageNumber){
		return $http({
		  method: 'GET',
		  url: 'https://anapioficeandfire.com/api/characters?page='+pageNumber+'&pageSize=20'
		})	
	}

	bookAPIS.getAllHouses = function(pageNumber){
		return $http({
		  method: 'GET',
		  url: 'https://anapioficeandfire.com/api/houses?page='+pageNumber+'&pageSize=20'
		})	
	}

	bookAPIS.getSingleDetails = function(type, number){
		return $http({
		  method: 'GET',
		  dataType: 'json',
		  url: 'https://anapioficeandfire.com/api/'+type + '/' + number
		});	
	}

	bookAPIS.getFilteredData = function(type, field, value){
		return $http({
		  method: 'GET',
		  url: 'https://www.anapioficeandfire.com/api/'+type + '?'+field + '=' + value
		})	
	}


	return bookAPIS;
});
