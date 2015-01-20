if (Meteor.isClient) {

    Template.all.helpers({
        returnCreator: function(){
            var currentUserId = Meteor.userId();
            var gCreator = !! CoreGameData.findOne({_id: this._id, creatorUserId: currentUserId})
            if(gCreator){
                return true
            } else {
                false
            }
          
     
        },

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
        returnGameStory: function(){
            return GameStory.find({gameId: this._id})
        },
        returnUsername: function(){
            var currentUserId = Meteor.userId();
            var userRecord = Meteor.users.find({_id: currentUserId}).fetch();
            var userObject = !! userRecord[0] && userRecord[0].emails;
            var userEmail = !! userObject[0] && userObject[0].address
            return userEmail     
        },
        returnAllUsers: function(){

            return Meteor.users.find().fetch();
        },

    })




    Template.all.events({
        'click .start': function () {

            var roundTimer = 30
            var votingTimer = 15

            var gameId = this._id;
            Meteor.call('startRound', gameId, roundTimer, votingTimer, function(error, result){

            });




            Meteor.call('roundTimer', gameId, function(error, result){

            });
            Session.set('voteSubmitted', null)



        },
        'click .startVoting': function(){
   
            var gameId = this._id;
            
            Meteor.call('votingTimer', gameId, function(){

            })


            var votingTimer = 15
            CoreGameData.update({_id: gameId}, {$set: {votingTimer: votingTimer}});
 
    
        },

    });


}



















