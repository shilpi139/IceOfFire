myApp.controller('bookCtrl' , [ '$http' ,'mainService', '$location', '$filter', function($http , mainService, $location, $filter){
	var scope = this;

	scope.finalList = [];
	$.blockUI({ message: null });
	//request to get all the books
	this.getAllBooks = function() {
		//blockUi to block until the request is completed
		$('div.all-books').block({ 
			message: null, 
			onBlock: function() { 
            	$(".showLoader").addClass("spinner");
        	}
    	});
    	var  results = $filter('filter')(scope.finalList, {type : 'books'}, true);
		for(var i = 0; i < results.length; i++){
		    for(var j = 0; j < scope.finalList.length; j++){
		        if(results[i].type === scope.finalList[j].type) {
		        	scope.finalList.splice(j,1); //removing the previous object to get the new character's list
		        }
		    }
		}
		mainService.getAllBooks().then(function successCallBack(response){
			angular.forEach(response.data, function(value, key){
			    value.type = "books";
			    var lastslashindex = value.url.lastIndexOf('/');
			    var result = value.url.substring(lastslashindex + 1);
			    value.bookNumber = result;
			    scope.finalList.push(value); // this add all books to the array
			    scope.finalList = $filter('orderBy')(scope.finalList, 'name');
			});
			//once completed the blockUi is removed and so the spinner too
			$('div.all-books').unblock(); 
			$(".showLoader").removeClass("spinner");
		} ,
		function errorCallBack(response){
			console.log(response);
		});	
	}//end here

	//code to get 20 characters - pagination provided to view next sequence
	this.getAllCharacters = function(pageNumber) {
		var finalPageNumber = pageNumber == undefined ? 1 : pageNumber;
		if(finalPageNumber != undefined){
			$('div.all-characters').block({ 
				message: null, 
				onBlock: function() { 
                	$(".showSpinner").addClass("spinner");
            	}
        	}); 
		}
		//clearing the list to clear the prev data in case of pagination to store  new values in list
		var  results = $filter('filter')(scope.finalList, {type : 'characters'}, true);
		for(var i = 0; i < results.length; i++){
		    for(var j = 0; j < scope.finalList.length; j++){
		        if(results[i].type === scope.finalList[j].type) {
		        	scope.finalList.splice(j,1); //removing the previous object to get the new character's list
		        }
		    }
		}

		// according to the index the api is hit and result is fetched.
		mainService.getAllCharacters(finalPageNumber).then(function successCallBack(charResponse){
			angular.forEach(charResponse.data, function(value, key){
				value.type = "characters";
				var index = value.url.lastIndexOf('/');
				var result = value.url.substring(index + 1);
			    value.characterNumber = result;
			    if(value.name === '') {
			    	value.name = "Unknown";
			    }
			   	scope.finalList.push(value);
			   	scope.finalList = $filter('orderBy')(scope.finalList, 'name');
			});
			scope.nextPageNumber =  finalPageNumber + 1; //set next page index
			scope.prevPageNumber =  finalPageNumber - 1; //set previous page index
			if(finalPageNumber != undefined){
				$('div.all-characters').unblock(); 
				$(".showSpinner").removeClass("spinner");
			}
		} ,
		function errorCallBack(response){
			console.log(response);
		});
	}//code ends here

	//code to get 20 houses - pagination provided to view next sequence
	this.getAllHouses = function(pageNumber) {
		var finalPageNumber = pageNumber == undefined ? 1 : pageNumber;
		$('div.all-houses').block({ 
			message: null, onBlock: function() { $(".show-loader").addClass("spinner"); }
    	});
		var results = $filter('filter')(scope.finalList, {type : 'houses'}, true);
		for(var i = 0; i < results.length; i++){
		    for(var j = 0; j < scope.finalList.length; j++){
		        if(results[i].type === scope.finalList[j].type) {
		        	scope.finalList.splice(j,1); //removing the previous object to get the new character's list
		        }
		    }
		}

		mainService.getAllHouses(finalPageNumber).then(function successCallBack(houseResponse){
			angular.forEach(houseResponse.data, function(value, key){
				value.type = "houses";
				var index = value.url.lastIndexOf('/');
				var result = value.url.substring(index + 1);
			    value.houseNumber = result;
				scope.finalList = $filter('orderBy')(scope.finalList, 'name');
			    scope.finalList.push(value);
			});
			scope.nextIndex =  finalPageNumber + 1; //set next page index
			scope.prevIndex =  finalPageNumber - 1; //set previous page index
			$('div.all-houses').unblock(); 
			$(".show-loader").removeClass("spinner");
			
			$.unblockUI(); 
			scope.showLoader = false;
		} ,
		function errorCallBack(response){
			console.log(response);
		});
	}//code ends here

	//a animation code -- when we scroll to a div(books, houses or character) it will animatie according to it
	scope.animation = {};
	scope.animation.current = 'fadeInUp';

	scope.animateElementIn = function() {
		var elements = document.getElementsByClassName('book-block');
		var $el = angular.element(elements);
	    $el.removeClass('not-visible');
		$el.addClass('animated fadeInUp');

		var elements = document.getElementsByClassName('house-block');
		var $el1 = angular.element(elements);
	    $el1.addClass('not-visible');
		$el1.removeClass('animated fadeInLeft');
	};
	 
	scope.animateElementOut = function() {
		var elements = document.getElementsByClassName('book-block');
		var $el = angular.element(elements);
	    $el.addClass('not-visible');
		$el.removeClass('animated fadeInUp');
	};

	scope.charAnimateElementIn = function() {
		var elements = document.getElementsByClassName('char-block');
		var $el = angular.element(elements);
	    $el.removeClass('not-visible');
		$el.addClass('animated fadeInLeft');
	};
	 
	scope.charAnimateElementOut = function() {
		var elements = document.getElementsByClassName('char-block');
		var $el = angular.element(elements);
	    $el.addClass('not-visible');
		$el.removeClass('animated fadeInLeft');
	};

	scope.houseAnimateElementIn = function() {
		var elements = document.getElementsByClassName('house-block');
		var $el = angular.element(elements);
	    $el.removeClass('not-visible');
		$el.addClass('animated fadeInLeft');
	};
	 
	/*scope.houseAnimateElementOut = function() {
		var elements = document.getElementsByClassName('house-block');
		var $el = angular.element(elements);
	    $el.addClass('not-visible');
		$el.removeClass('animated fadeInLeft');
	};*/

	//animation code ends


	//code starts to show filter input text
	scope.showFilterButton = true;
	scope.showInputField = false;
	scope.showTextField = function(value) {
		scope.value = "Please enter "+value;
		scope.inputAttr = value;
		scope.showInputField = true;
		scope.showFilterButton = false;
	};

	scope.hideInputField = function() {
		$(".book-msgs").addClass("displayNone");
		this.getAllBooks();
		scope.showInputField = false;
		scope.showFilterButton = true;
		$(".btitle").addClass("bookTitle");
		$(".btitle").removeClass("filterTitle");
	}

	//character filter code starts
	scope.showCharFilterButton = true;
	scope.showCharField = false;
	scope.showField = function(value) {
		scope.value = "Please enter "+value;
		scope.charAttr = value;
		scope.showCharField = true;
		scope.showCharFilterButton = false;
	};

	scope.hideCharInputField = function() {
		$(".form-msgs").addClass("displayNone");
		this.getAllCharacters();
		scope.hidePagination = false;
		scope.showCharField	 = false;
		scope.showCharFilterButton = true;
		$(".ctitle").addClass("charTitle");
		$(".ctitle").removeClass("filterTitle");
	}

	//house filter code starts
	scope.showHouseFilterButton = true;
	scope.showHouseField = false;
	scope.displayHouseField = function(value) {
		scope.value = "Please enter "+value;
		scope.houseAttr = value;
		scope.showHouseField = true;
		scope.showHouseFilterButton = false;
	};

	scope.hideHouseInputField = function() {
		$(".house-msgs").addClass("displayNone");
		this.getAllHouses();
		scope.hideIndex = false;
		scope.showHouseField	 = false;
		scope.showHouseFilterButton = true;
		$(".htitle").addClass("houseTitle");
		$(".htitle").removeClass("filterTitle");
	}
	//code ends here

	scope.hidePagination = false;
	scope.hideIndex = false;

	//code when value is filtered in input text, it will call a Custom filter to get data
	scope.filterData = function(type, field, value) {
		if(type == "books") {
			$('#bookName').val(value);
			$('div.all-books').block({ 
				message: null, onBlock: function() { $(".showLoader").addClass("spinner");}
	    	});
		}else if(type == "characters") {
			$('#charName').val(value);
			$('#gender').val(value);
			$('#culture').val(value);
			$('#isAlive').val(value);
			$('div.all-characters').block({ 
				message: null, onBlock: function() { $(".showSpinner").addClass("spinner"); }
	    	});
	    	scope.hidePagination = true;
		}else {
			$('#houseName').val(value);
			$('#region').val(value);
			$('#words').val(value);
			$('div.all-houses').block({ 
				message: null, onBlock: function() { $(".show-loader").addClass("spinner"); }
	    	}); 
	    	scope.hideIndex = true;
		}
        scope.myList = $filter('CustomFilter')(scope.finalList, type, field, value);
		scope.finalList = scope.myList;		
	}

	this.getAllBooks();
	this.getAllCharacters();
	this.getAllHouses();
}] );//end controller

myApp.controller('singleDetailController',['$http','$routeParams', 'mainService', '$filter','$q', '$timeout', function($http,$routeParams, mainService, $filter, $q, $timeout) {
	var scope = this;
	scope.type = $routeParams.type;
	scope.number = $routeParams.number;
	mainService.getSingleDetails(scope.type, scope.number).then(function successCallBack(response){
		$('div.single-details').block({ 
			message: null, 
			onBlock: function() { 
            	$(".showSpinner").addClass("spinner");
        	}
    	});
    	scope.details = response.data;
		if(scope.type == 'books') {
			if(response.data.characters.length > 0) {
				var counter = 0;
				var keepGoing = true;	
				var deferred = $q.defer();
				if(keepGoing) {
					angular.forEach(response.data.characters, function(value, key){	
						var index = value.lastIndexOf('/');
						var number = value.substring(index + 1);
						scope.hasCharacters = "true";
					    scope.singleCharDetails = [];
					    
				    	mainService.getSingleDetails('characters', number, { timeout: deferred.promise }).then(function successCallBack(charResponse){
							counter++;
							if(charResponse.data.name != '') {
								charResponse.data.type = "characters";
								charResponse.data.characterNumber = number;
								scope.singleCharDetails.push(charResponse.data);
								scope.singleCharDetails = $filter('orderBy')(scope.singleCharDetails, 'name');
							}
							if(counter === response.data.characters.length) {
								$('div.single-details').unblock(); 
								$(".showSpinner").removeClass("spinner");
							}
						} ,
						function errorCallBack(response){
							$('div.single-details').unblock(); 
							$(".showSpinner").removeClass("spinner");
						});
						$timeout(function() {
						    deferred.resolve(); // this aborts the request!
						}, 1000);
					});
				}
			}else {
				$('div.single-details').unblock(); 
				$(".showSpinner").removeClass("spinner");
			}
		}
		
		angular.forEach(response.data.povCharacters, function(value1, key){
			var index = value1.lastIndexOf('/');
			var number = value1.substring(index + 1);
			scope.hasPovCharacters = "true";
			scope.singlePovCharDetails = [];
		    
			mainService.getSingleDetails('characters', number).then(function successCallBack(povCharResponse){
				if(povCharResponse.data.name != '') {
					povCharResponse.data.type = "characters";
					povCharResponse.data.characterNumber = number;
					scope.singlePovCharDetails.push(povCharResponse.data);
					scope.singlePovCharDetails = $filter('orderBy')(scope.singlePovCharDetails, 'name');
				}
			} ,
			function errorCallBack(response){
				$('div.single-details').unblock(); 
				$(".showSpinner").removeClass("spinner");
			});
		});
		angular.forEach(response.data.allegiances, function(value1, key){
			var index = value1.lastIndexOf('/');
			var number = value1.substring(index + 1);
			scope.hasAllegiances = "true";
		    scope.allegiancesList = [];

			mainService.getSingleDetails('houses', number).then(function successCallBack(allegiancesResponse){
				allegiancesResponse.data.type = "houses";
				allegiancesResponse.data.houseNumber = number;
				scope.allegiancesList.push(allegiancesResponse.data);
				scope.allegiancesList = $filter('orderBy')(scope.allegiancesList, 'name');
			} ,
			function errorCallBack(response){
				$('div.single-details').unblock(); 
				$(".showSpinner").removeClass("spinner");
			});
		});
		angular.forEach(response.data.books, function(value1, key){
			var index = value1.lastIndexOf('/');
			var number = value1.substring(index + 1);
			scope.hasBooks = "true";
		    scope.booksList = [];

			mainService.getSingleDetails('books', number).then(function successCallBack(booksResponse){
				booksResponse.data.type = "books";
				booksResponse.data.bookNumber = number;
				scope.booksList.push(booksResponse.data);
				scope.booksList = $filter('orderBy')(scope.booksList, 'name');
			} ,
			function errorCallBack(response){
				$('div.single-details').unblock(); 
				$(".showSpinner").removeClass("spinner");
			});
		});
		angular.forEach(response.data.povBooks, function(value1, key){
			var index = value1.lastIndexOf('/');
			var number = value1.substring(index + 1);
			scope.hasPovBooks = "true";
		    scope.povBooksList = [];

			mainService.getSingleDetails('books', number).then(function successCallBack(booksResponse){
				booksResponse.data.type = "books";
				booksResponse.data.bookNumber = number;
				scope.povBooksList.push(booksResponse.data);
				scope.povBooksList = $filter('orderBy')(scope.povBooksList, 'name');
			} ,
			function errorCallBack(response){
				$('div.single-details').unblock(); 
				$(".showSpinner").removeClass("spinner");
			});
		});
		angular.forEach(response.data.cadetBranches, function(value1, key){
			var index = value1.lastIndexOf('/');
			var number = value1.substring(index + 1);
			scope.hasCadetBranches = "true";
		    scope.cadetBranchesList = [];

			mainService.getSingleDetails('houses', number).then(function successCallBack(housesResponse){
				housesResponse.data.type = "houses";
				housesResponse.data.houseNumber = number;
				scope.cadetBranchesList.push(housesResponse.data);
				scope.cadetBranchesList = $filter('orderBy')(scope.cadetBranchesList, 'name');
			} ,
			function errorCallBack(response){
				$('div.single-details').unblock(); 
				$(".showSpinner").removeClass("spinner");
			});
		});

		if(scope.type == 'houses') {
			if(response.data.swornMembers.length > 0) {
				var count = 0;
				angular.forEach(response.data.swornMembers, function(value1, key){
					var index = value1.lastIndexOf('/');
					var number = value1.substring(index + 1);
					scope.hasSwornMembers = "true";
				    scope.swornMembersList = [];

					mainService.getSingleDetails('characters', number).then(function successCallBack(charResponse){
						count++;
						if(charResponse.data.name != '') {
							charResponse.data.type = "characters";
							charResponse.data.characterNumber = number;
							scope.swornMembersList.push(charResponse.data);
							scope.swornMembersList = $filter('orderBy')(scope.swornMembersList, 'name');
						}
						if(count === response.data.swornMembers.length) {
							$('div.single-details').unblock(); 
							$(".showSpinner").removeClass("spinner");
						}
					} ,
					function errorCallBack(response){
						$('div.single-details').unblock(); 
						$(".showSpinner").removeClass("spinner");
					});
				});
			}else {
				$('div.single-details').unblock(); 
				$(".showSpinner").removeClass("spinner");
			}
		}

		if(scope.type == 'characters') {
			$('div.single-details').unblock(); 
			$(".showSpinner").removeClass("spinner");
		}
	} ,
	function errorCallBack(response){
		$('div.single-details').unblock(); 
		$(".showSpinner").removeClass("spinner");
	});
}]);


// custom filter
myApp.filter("CustomFilter", ['$filter' ,'mainService',function($filter, mainService) {
    return function (list, type, key, value) {
    	mainService.getFilteredData(type, key,value).then(function successCallBack(filterResponse){
    		if(filterResponse.data.length == 0) {
    			$('div.all-characters').unblock();
    			$('div.all-books').unblock();
    			$('div.all-houses').unblock(); 
    			$(".showSpinner").removeClass("spinner");
    			$(".showLoader").removeClass("spinner");
    			$(".show-loader").removeClass("spinner");
    			if(type == "books") {
    				$(".book-msgs").addClass("displayBlock");
    				$(".book-msgs").removeClass("displayNone");
    			}else if(type == "characters") {
    				$(".form-msgs").addClass("displayBlock");
    				$(".form-msgs").removeClass("displayNone");
    			}else {
    				$(".house-msgs").addClass("displayBlock");
    				$(".house-msgs").removeClass("displayNone");
    			}
    			return list;
    		}
    		var  results = $filter('filter')(list, {type : type}, true);
			for(var i = 0; i < results.length; i++) {
			    for(var j = 0; j < list.length; j++) {
			        if(results[i].type === list[j].type) {
			        	list.splice(j,1); //removing the previous object to get the new character's list
			        }
			    }
			}
			for(var i=0; i<filterResponse.data.length; i++) {
				filterResponse.data[i].type = type;
				var index = filterResponse.data[i].url.lastIndexOf('/');
				var result = filterResponse.data[i].url.substring(index + 1);
			    
				if(type == "books") {
					filterResponse.data[i].bookNumber = result;
					$(".book-msgs").addClass("displayNone");
					$('div.all-books').unblock(); 
					$(".showLoader").removeClass("spinner");
					$(".btitle").removeClass("bookTitle");
					$(".btitle").addClass("filterTitle");
				}else if(type == "characters") {
					filterResponse.data[i].characterNumber = result;
					$(".form-msgs").addClass("displayNone");
					$('div.all-characters').unblock(); 
					$(".showSpinner").removeClass("spinner");
					$(".ctitle").removeClass("charTitle");
					$(".ctitle").addClass("filterTitle");	
				}else {
					filterResponse.data[i].houseNumber = result;
					$(".house-msgs").addClass("displayNone");
					$('div.all-houses').unblock(); 
					$(".show-loader").removeClass("spinner");
					$(".htitle").removeClass("houseTitle");
					$(".htitle").addClass("filterTitle");	
				}

				list.push(filterResponse.data[i]);
			}
		} ,
		function errorCallBack(response){
			console.log(response);
		});
   	return list;

    }
}]);
