Users = Meteor.users

Meteor.methods({
    createGame: function(){
        var currentUserId = Meteor.userId();
        var createdAt = moment().format('h:mm:ss a');
        var users = Users.find({_id: this.userId}).fetch()
       	var createdBy = !! users[0] && users[0].emails[0].address;    

    CoreGameData.insert({
      createdBy: createdBy,
      creatorUserId: currentUserId,
      createdAt: createdAt,
      startingPhrase: null,
      gameName: null

    });

     var coreGameData = CoreGameData.find({}).fetch()
     var gameId = !! coreGameData[coreGameData.length - 1] && coreGameData[coreGameData.length - 1]._id

    
    GameStateData.insert({
      gameId: gameId,
      round: 0,
      roundStart: false,
      showInput: false,
      roundTimer: null,
      showVoting: false,
      startVote: false,
      votingTimer: 15,
      showResults: false,
      roundFinished: false,
      roundFinishedTimer: 4,
      gameOver: false,
      showSubmitVote: false,
      finalRound: false,


    });

    },

    startRound: function(gameId, roundTimer){

		GameStateData.update({gameId: gameId}, {$set: {roundStart: true}});
	    GameStateData.update({gameId: gameId}, {$set: {roundTimer: roundTimer}});
        GameStateData.update({gameId: gameId}, {$set: {showInput: true}});
        GameStateData.update({gameId: gameId}, {$set: {showVoting: false}});
        GameStateData.update({gameId: gameId}, {$set: {showVoteResults: false}});
    	GameStateData.update({gameId: gameId}, {$inc: {round: 1}});
    	GameStateData.update({gameId: gameId}, {$set: {roundFinished: false}});


	  var countdown = function(){

      var gameData = GameStateData.find({gameId: gameId}).fetch();
      var roundTimer = !! gameData[0] && gameData[0].roundTimer;
      var startVote = !! gameData[0] && gameData[0].startVote;



       		if(roundTimer >= 1){
          
			GameStateData.update({gameId: gameId}, {$inc: {roundTimer: -1}});

       		} else if (roundTimer === 0){
       			GameStateData.update({gameId: gameId}, {$set: {showInput: false}});
       			GameStateData.update({gameId: gameId}, {$set: {showVoting: true}});
       			GameStateData.update({gameId: gameId}, {$set: {roundStart: false}});
       			GameStateData.update({gameId: gameId}, {$set: {startVote: true}});
	          	GameStateData.update({gameId: gameId}, {$set: {votingTimer: 15}});
	          	GameStateData.update({gameId: gameId}, {$set: {showSubmitVote: true}});

            	Meteor.clearInterval(intervalId);

      var voteTimerCountdown = function(){
      	  var gameData = GameStateData.find({gameId: gameId}).fetch();
      	  var votingTimer = !! gameData[0] && gameData[0].votingTimer;

	      var currentUserId = this.userId;     

	     		if(votingTimer >= 1){
			      
	          GameStateData.update({gameId: gameId}, {$inc: {votingTimer: -1}});


	     		} else if (votingTimer === 0){
	     			Meteor.clearInterval(intervalId1);
	     			GameStateData.update({gameId: gameId}, {$set: {showVoteResults: true}});
	     			GameStateData.update({gameId: gameId}, {$set: {showSubmitVote: false}});
       				GameStateData.update({gameId: gameId}, {$set: {showVoting: false}});
       				GameStateData.update({gameId: gameId}, {$set: {roundFinished: true}});



	     			var round = gameData[0] && gameData[0].round; 
	     			var winner = UserRoundData.findOne({gameId: gameId, round: round}, {sort: {votes: -1, createdAt: 1}})

	          if(round >= 9){
	            GameStateData.update({gameId: gameId}, {$set: {finalRound: true}});
	          } else {
	            GameStateData.update({gameId: gameId}, {$set: {finalRound: false}});

	          }

	          if(round === 10){
	            GameStateData.update({gameId: gameId}, {$set: {gameCompleted: true}});
	            var winner = UserRoundData.find({gameId: gameId}, {sort: {votes: -1}}).fetch();
	            console.log(winner)
	  	     	var userAlias = !! winner[0] && winner[0].userAlias
	            UserGameData.update({userAlias: userAlias, gameId: gameId}, {$set: {wonGame: true}});

	          } else {
	            GameStateData.update({gameId: gameId}, {$set: {gameCompleted: false}});

	          }

	     			
	     			var createdBy = winner.createdBy
	     			var winningResponse = winner.response;
	     			var votes = winner.votes;
	                var userRoundData = UserRoundData.find({gameId: gameId, createdBy: currentUserId}).fetch();
	                //var votes = !! userRoundData[0] && userRoundData[0].votes
	                //console.log(votes)

      


	     			
			GameStory.insert({
	      		gameId: gameId,
				round: round,
				createdBy: createdBy,
				winningResponse: winningResponse,
				votes: votes
			});

	          Users.update({_id: createdBy }, {$inc: {roundsWon: 1}});


	    				
	     		}
			}		
		
		intervalId1 = Meteor.setInterval(voteTimerCountdown, 1000)

       		}
		}
		
		intervalId = Meteor.setInterval(countdown, 1000)

    },

    response: function(response, round, gameId, time){

    	var currentUserId = this.userId;
        var users = Users.find({_id: this.userId}).fetch()
       	var userAlias = !! users[0] && users[0].emails[0].address;  
    	var createdAt = moment().format('h:mm:ss a')
        var length = response.length;

		UserRoundData.insert({
      		gameId: gameId,
			round: round,
			response: response,
			responseLength: length, 
			responseTime: time,
			createdBy: currentUserId,
			userAlias: userAlias,
			votes: 0,
			createdAt: createdAt,

		});

		UserGameData.update({gameId: gameId}, {$inc: {responseLength: length}});
		UserGameData.update({gameId: gameId}, {$inc: {responseTime: time}});
		UserGameData.update({gameId: gameId}, {$push: {responses: response}});



    },
    submitVote: function(selectedItem, gameId){

    	UserRoundData.update({_id: selectedItem}, {$inc: {votes: 1}});
    	UserGameData.update({gameId: gameId, userId: this.userId}, {$inc: {votes: 1}});
    },
    joinGame: function(gameId){
        var users = Users.find({_id: this.userId}).fetch()
       	var userAlias = !! users[0] && users[0].emails[0].address; 
       	if(UserGameData.find({gameId: gameId, userId: this.userId}).count() === 0)
    	UserGameData.insert({
    		userId: this.userId,
    		userAlias: userAlias,
    		gameId: gameId,
    		roundsWon: 0,
    		responses: [],
    		responseLength: 0,
    		responseTime: 0,
    		votes: 0,
    		wonGame: false

    	});
    }


});
















