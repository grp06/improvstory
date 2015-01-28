
    Template.all.helpers({

        //welcomes the current user
        returnCreator: function(){
            var currentUserId = Meteor.userId();
            var gCreator = !! CoreGameData.findOne({_id: this._id, creatorUserId: currentUserId})
            if(gCreator){
                return true
            } else {
                false
            }
          
     
        },
        //shows current round
        returnRound: function(){
            return GameStateData.find({gameId: this._id})
        },

        displayInput: function(){

            var gameData = GameStateData.find({gameId: this._id}).fetch();
            var inputStatus = !! gameData[0] && gameData[0].showInput
            return inputStatus
        },
        displayVoting: function(){
            var id = this._id;

            var gameData = GameStateData.find({gameId: this._id}).fetch();
            var showVotingStatus = !! gameData[0] && gameData[0].showVoting;

            return showVotingStatus
        },
        displayResultsTemplate: function(){
            var gameData = GameStateData.find({gameId: this._id}).fetch();
            var showVoteResultsStatus = !! gameData[0] && gameData[0].showVoteResults;
            return showVoteResultsStatus
        },
        //shows the story as it's built
        returnGameStory: function(){
            return GameStory.find({gameId: this._id})
        },

        returnAllUsers: function(){

            return Meteor.users.find().fetch();
        },
        displayFinalRound: function(){
            var gameData = GameStateData.find({gameId: this._id}).fetch();
            var showFinalRound = !! gameData[0] && gameData[0].finalRound;
            return showFinalRound

        },        
        displayGameOver: function(){
            var gameData = GameStateData.find({gameId: this._id}).fetch();
            var showGameOver = !! gameData[0] && gameData[0].gameCompleted;
            return showGameOver

        },
      

    })




    Template.all.events({
        'click .start': function () {
            //calls a method to execute when start is presses
            var gameId = this._id;
            Session.set('voteWarning', null);
            Session.set('voteSubmitted', null)
            Session.set('selectedItem', null);

            Meteor.call('startRound', gameId, function(error, result){

            });

            Meteor.call('roundTimer', gameId, function(error, result){

            });
            document.getElementById("response").disabled = false;


        },
        'click .deleteGame': function(){
            var gameId = this._id;
            Meteor.call('deleteGame', gameId, function(){

            })

        },

    });


Template.gameOver.helpers({
    returnWinner: function(){
        var cursor = UserGameData.find({gameId: this._id, wonGame: true}).fetch();
        var winner = !! cursor[0] && cursor[0].userAlias
        return winner
    }
})



















