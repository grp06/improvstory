if(Meteor.isClient){



	Template.showVoteOptions.helpers({
		returnResponses: function () {
            var gameData = GameStateData.find({gameId: this._id}).fetch();
            var round = !! gameData[0] && gameData[0].round;
			return UserRoundData.find({gameId: this._id, round: round})
		},
		returnVotingTimer: function(){
			return GameStateData.find({gameId: this._id})
		},
        returnHighlight: function() {
            var itemId = this._id;
            var selectedItem = Session.get('selectedItem');

            if (itemId === selectedItem) {
                return "selected"
            }
        },
        returnSubmitVote: function(){
            var gameData = GameStateData.find({gameId: this._id}).fetch();
            var voteTemplateStatus = !! gameData[0] && gameData[0].showSubmitVote;
            return voteTemplateStatus

        },
        returnVoteWarning: function(){
        	return Session.get('voteWarning');
        },
        returnVoteSubmitted: function(){
        	return Session.get('voteSubmitted');
        }
	});


	Template.showVoteOptions.events({

        'click .possibleChoice': function() {
            var itemId = this._id
            Session.set('selectedItem', itemId);
            console.log(itemId)
        },
        'click .submitVote': function() {
        	var currentUserId = Meteor.userId();
            var selectedItem = Session.get('selectedItem');
            console.log(selectedItem)
            var cursor = UserRoundData.find({createdBy: currentUserId}).fetch()
            var myOwnSubmission = !! cursor[cursor.length - 1] && cursor[cursor.length - 1]._id;
            var gameId = this._id;
            console.log(myOwnSubmission)

            if(selectedItem != myOwnSubmission){
            	Meteor.call('submitVote', selectedItem, gameId, function(error, response){
            
            })
                                Session.set('voteWarning', null);

} else {
                Session.set('voteWarning', 'You cant vote for yourself!');

}


            
            document.getElementById("submitVote").disabled = true;
            Session.set('voteSubmitted', "Vote Submitted")



        }
	});

}