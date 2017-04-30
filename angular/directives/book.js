myApp.directive("bookCard", function() {
	return {
		restrict : "E",
		templateUrl : "./views/book-card.html",
		controller : function($scope) {
			//console.log("Directive book called");
		}
	}
});//end 


myApp.directive('backButton', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', goBack);
        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
});