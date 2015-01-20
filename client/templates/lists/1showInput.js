if(Meteor.isClient){



	Template.showInput.helpers({
        returnRound: function(){
        	var id = this._id;
            return GameStateData.find({gameId: id})
        }
	});


	Template.showInput.events({
        'keyup #response': function(e) {
            if (e.which === 13) {
            	var gameId = this._id;
                var currentUserId = Meteor.userId();
                var response = $('#response').val();
                $('#response').val('');
                document.getElementById("response").disabled = true;
                var gameData = GameStateData.find({gameId: gameId}).fetch();
                var round = !! gameData[0] && gameData[0].round;
                var time = !! gameData[0] && gameData[0].roundTimer;
   


                Meteor.call('response', response, round, gameId, time, function(error, response){
                  
                })
            }
        }
	});



}