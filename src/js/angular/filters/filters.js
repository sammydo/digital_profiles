angular
	.module('DigitalProfiles')

	// Takes availability of a spartan and returns a string if false
	.filter('Available', function() {
		return function(input) {
			if(input === false) {
				return "Unavailable - On client site";
			} else {
				return input;
			}
		};
	})

	// Takes dates and formats them into more readable outputs
	.filter('DateFormat', function() {
		return function(input) {
			var date = new Date(input);
			var newDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
			return (newDate && !isNaN(date.getDate())) ? newDate : input;
		};
	});
