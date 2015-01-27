Template.gameCreatorPanel.helpers({
	foo: function () {
		// ...
	}
});


Template.gameCreatorPanel.events({
	'keyup': function (e) {
		if(e.which === 13){
			console.log('hey')
			var firstLine = $('#firstLine').val()
			console.log(firstLine);

			var gameId = this._id;
			
			Meteor.call('firstLine', firstLine, gameId, function(error, response){

			})

			document.getElementById("firstLine").disabled = true;

		}
	}
});


