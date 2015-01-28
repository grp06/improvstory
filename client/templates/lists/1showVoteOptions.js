if (Meteor.isClient) {



    Template.showVoteOptions.helpers({
        returnResponses: function() {
            var gameData = GameStateData.find({
                gameId: this._id
            }).fetch();
            var round = !!gameData[0] && gameData[0].round;
            return UserRoundData.find({
                gameId: this._id,
                round: round
            })
        },
        returnVotingTimer: function() {
            return GameStateData.find({
                gameId: this._id
            })
        },
        returnHighlight: function() {
            var itemId = this._id;
            var selectedItem = Session.get('selectedItem');

            if (itemId === selectedItem) {
                return "selected"
            }
        },
        returnSubmitVote: function() {
            var gameData = GameStateData.find({
                gameId: this._id
            }).fetch();
            var voteTemplateStatus = !!gameData[0] && gameData[0].showSubmitVote;
            return voteTemplateStatus

        },
        returnVoteWarning: function() {
            return Session.get('voteWarning');
        },
        returnVoteSubmitted: function() {
            return Session.get('voteSubmitted');
        }
    });


    Template.showVoteOptions.events({

        'click .possibleChoice': function() {
            var itemId = this._id
            Session.set('selectedItem', itemId);
            var selectedItem = Session.get('selectedItem');
            console.log(selectedItem)

        },
        'click .submitVote': function() {
            var currentUserId = Meteor.userId();
            var selectedItem = Session.get('selectedItem');
            var gameId = this._id;

            var cursor = GameStateData.find({gameId: gameId}).fetch()
            var round = !! cursor[0] && cursor[0].round

            var myOwnSubmission = UserRoundData.find({uid: currentUserId, round: round}).fetch();
  
            document.getElementById("response").disabled = false;
           
            console.log("round " + round)
            console.log("my own submission " + myOwnSubmission) 
            console.log("Selected Item = " + Session.get('selectedItem'))

            if(selectedItem === myOwnSubmission) {
               
            Session.set('voteWarning', "You can't vote for yourself, cheater!")

            } else {

            Meteor.call('submitVote', selectedItem, gameId, function(error, response) {

            })
            document.getElementById("submitVote").disabled = true;

            Session.set('voteSubmitted', "Vote Submitted")
            }







        }
    });

}