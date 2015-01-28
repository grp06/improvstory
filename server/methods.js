Users = Meteor.users

Meteor.methods({
    createGame: function() {
        var currentUserId = Meteor.userId();
        var createdAt = moment().format('MMMM Do, h:mm a');
        var users = Users.find({
            _id: this.userId
        }).fetch();
        //Here I'm forcing a boolean because when using .fetch();
        //I kept having issues and someone smarter than me suggested it
        //I know there's a better way, still workin' on that
        var createdBy = !! users[0] && users[0].profile.name
        var picture = !! users[0] && users[0].profile.largePicture


        //each game's creator and time is documented
        //haven't implemented game name or starting phrase yet
        CoreGameData.insert({
            createdBy: createdBy,
            creatorUserId: currentUserId,
            createdAt: createdAt,
            startingPhrase: null,
            gameName: null,
            picture: picture,
            active: true

        });

        var coreGameData = CoreGameData.find({}).fetch()
        var gameId = !!coreGameData[coreGameData.length - 1] && coreGameData[coreGameData.length - 1]._id

        //This collection monitors the game's state
        //Helpers are connected to the true/false values
        //When they change, helpers reactively make changes
        GameStateData.insert({
            gameId: gameId,
            round: 0,
            showInput: false,
            roundTimer: null,
            showVoting: false,
            startVote: false,
            votingTimer: 15,
            roundFinished: false,
            roundFinishedTimer: 4,
            gameCompleted: false,
            showSubmitVote: false,
            finalRound: false,
            startingLineSubmitted: false
        });

        //After a game, the completed story is kept
        //Each line of each story is kept in one position of an array
        //The last line of the story is "the moral of the story"

        CompletedStories.insert({
            finishedStory: [],
            gameId: gameId,
            story: null,
            moral: null,
            createdAt: createdAt,
            winner: null
        });
    },

    //When you click start round, this method is called. Lots of stuff happens
    startRound: function(gameId){

      //Timer is set to whatever I set it to in the 'start' event
      GameStateData.update({gameId: gameId}, {$set: {roundTimer: 3}});
      GameStateData.update({gameId: gameId}, {$set: {votingTimer: 3}});
      
      GameStateData.update({gameId: gameId}, {$set: {showInput: true}});
      //voting from previous round disappears
      GameStateData.update({gameId: gameId}, {$set: {showVoting: false}});
      //voting results from previous round disappear
      GameStateData.update({gameId: gameId}, {$set: {showVoteResults: false}});
        //round goes up by one
      GameStateData.update({gameId: gameId}, {$inc: {round: 1}});
        //This is a feature for later. I want the game to be automated
      GameStateData.update({gameId: gameId}, {$set: {roundFinished: false}});
        
      //not using var because I keep getting undefined and can't figure it out  
      var currentUserId = this.userId;

      //main function that runs the countdown timer.
      //same code is used for the voting timer below too
      var countdown = function(currentUserId) {

      var gameData = GameStateData.find({gameId: gameId}).fetch();
      var roundTimer = !! gameData[0] && gameData[0].roundTimer;
      var startVote = !! gameData[0] && gameData[0].startVote;

        if(roundTimer >= 1){
            
          GameStateData.update({gameId: gameId}, {$inc: {roundTimer: -1}});

          } else if (roundTimer === 0){

            responseTimeOver(gameId, currentUserId);


        }
      }

    var responseTimeOver = function(){
        //when timer is 0, update these documents to cause needed UI state changes
        GameStateData.update({gameId: gameId}, {$set: {showInput: false}});
        GameStateData.update({gameId: gameId}, {$set: {showVoting: true}});
        GameStateData.update({gameId: gameId}, {$set: {startVote: true}});
        GameStateData.update({gameId: gameId}, {$set: {showSubmitVote: true}});
        Meteor.clearInterval(timeout1);
        timeout2 = Meteor.setInterval(voteTimerCountdown, 1000)      
    }

      var voteTimerCountdown = function(currentUserId){
      
      var gameData = GameStateData.find({gameId: gameId}).fetch();
      var votingTimer = !! gameData[0] && gameData[0].votingTimer;
      
      if(votingTimer >= 1){
              
        GameStateData.update({gameId: gameId}, {$inc: {votingTimer: -1}});

      } else if (votingTimer === 0){
  
        Meteor.clearTimeout(timeout2);
        var gameData = GameStateData.find({gameId: gameId}).fetch();
        var round = gameData[0] && gameData[0].round; 
        //Get the winner from this round, this gameId, who has the most votes
        //Maybe also sort by the person who submitted first
        var winner = UserRoundData.find({gameId: gameId, round: round}, {sort: {votes: -1}}).fetch()
        var createdBy = !! winner[0] && winner[0].uid
        var winningResponse = !! winner[0] && winner[0].response;
        var votes = !! winner[0] && winner[0].votes
        votingOver(round, winningResponse, createdBy, votes);
        finalRound(round, gameId);
        gameOver(round, gameId, winningResponse);

      }
    }

    var votingOver = function(round, winningResponse, createdBy, votes){

        //Update UI stuff
        GameStateData.update({gameId: gameId}, {$set: {showVoteResults: true}});
        GameStateData.update({gameId: gameId}, {$set: {showSubmitVote: false}});
        GameStateData.update({gameId: gameId}, {$set: {showVoting: false}});
        GameStateData.update({gameId: gameId}, {$set: {roundFinished: true}});

        //Push the winning response into the Game's final story
        //Nothing happens to this array til the final round,
        //At the end of the final round, the array is inserted to the 'story' document for this gameId
        //That document is used on /completedStories. 
        //Moral of the story is also added there
        CompletedStories.update({gameId: gameId}, {$push: {finishedStory: winningResponse}});
        
        UserGameData.update({uid: createdBy, gameId: gameId }, {$inc: {roundsWon: 1}});
        Users.update({_id: createdBy}, {$inc: {"profile.roundsWon": 1}}); 

        GameStory.insert({
            gameId: gameId,
            uid: createdBy,
            votes: votes,
            round: round,
            winningResponse: winningResponse
        })      
    }

    var finalRound = function(round, gameId){
      //The following happens for the final round
      if(round === 2){
        GameStory.insert({
          gameId: gameId,
          winningResponse: "Moral of the Story:"
        });

        CompletedStories.update({gameId: gameId}, {$push: {finishedStory: "Moral of the Story:"}});
        GameStateData.update({gameId: gameId}, {$set: {finalRound: true}});
        
        }      
    }

    var gameOver = function(round, gameId, winningResponse){
      //The following happens when the game is over
      if(round === 3){
         //Mark the game as completed
        GameStateData.update({gameId: gameId}, {$set: {gameCompleted: true}});
        GameStateData.update({gameId: gameId}, {$set: {finalRound: false}});
        CoreGameData.update({_id: gameId}, {$set: {active: false}});
        //Take the person with the most votes **add a limit
        var winner = UserGameData.find({gameId: gameId}, {sort: {votes: -1}}).fetch();
        var userAlias = !! winner[0] && winner[0].userAlias;
        var uid = !! winner[0] && winner[0].uid;

        UserGameData.update({userAlias: userAlias, gameId: gameId}, {$set: {wonGame: true}});
 
        var completedStory = CompletedStories.find({gameId: gameId}).fetch();
        var story = !! completedStory[0] && completedStory[0].finishedStory
        var finalStoryArray = story.join(' ');

        CompletedStories.update({gameId: gameId}, {$set:{story: finalStoryArray}});
        CompletedStories.update({gameId: gameId}, {$set: {moral: winningResponse}}); 
        CompletedStories.update({gameId: gameId}, {$set: {winner: userAlias}}); 

        //update is going through but its not really updating
        Users.update({_id: uid}, {$inc: {"profile.gamesWon": 1}});

      } else {
        GameStateData.update({gameId: gameId}, {$set: {gameCompleted: false}});
      }

    }
    
      timeout1 = Meteor.setInterval(countdown, 1000)

    },

    response: function(response, round, gameId, time) {

        var currentUserId = this.userId;
        var users = Users.find({
            _id: this.userId
        }).fetch()
        var userAlias = !!users[0] && users[0].profile.name
        var createdAt = moment().format('h:mm:ss a')
        var length = response.length;

        //While the clock is ticking, each user submits a response
        //Every response entered into the system has all this data tracked

        UserRoundData.insert({
            gameId: gameId,
            round: round,
            response: response,
            responseLength: length,
            responseTime: time,
            uid: currentUserId,
            userAlias: userAlias,
            votes: 0,
            createdAt: createdAt,
            notCheating: true,

        });

        UserGameData.update({
            gameId: gameId
        }, {
            $inc: {
                responseLength: length
            }
        });
        UserGameData.update({
            gameId: gameId
        }, {
            $inc: {
                responseTime: time
            }
        });
        UserGameData.update({
            gameId: gameId
        }, {
            $push: {
                responses: response
            }
        });

        Users.update({
            _id: currentUserId
        }, {
            $inc: {
                "profile.responseLength": length
            }
        });
        Users.update({
            _id: currentUserId
        }, {
            $inc: {
                "profile.responseTime": time
            }
        });
        Users.update({
            _id: currentUserId
        }, {
            $inc: {
                "profile.roundsPlayed": 1
            }
        });


    },
    submitVote: function(selectedItem, gameId) {

        UserRoundData.update({
            _id: selectedItem
        }, {
            $inc: {
                votes: 1
            }
        });
        var cursor = UserRoundData.find({_id: selectedItem}).fetch();
        var winnerId = !! cursor[0] && cursor[0].uid;

        UserGameData.update({
            gameId: gameId,
            uid: winnerId
        }, {
            $inc: {
                votes: 1
            }
        });
        Users.update({
            _id: this.userId
        }, {
            $inc: {
                "profile.voteTotal": 1
            }
        });


    },
    joinGame: function(gameId) {
        var users = Users.find({
            _id: this.userId
        }).fetch()
        var userAlias = !!users[0] && users[0].profile.name
        var picture = !!users[0] && users[0].profile.normalPicture
        if (UserGameData.find({
            gameId: gameId,
            uid: this.userId
        }).count() === 0)
            UserGameData.insert({
                uid: this.userId,
                userAlias: userAlias,
                gameId: gameId,
                roundsWon: 0,
                responses: [],
                responseLength: 0,
                responseTime: 0,
                votes: 0,
                wonGame: false,
                picture: picture

            });
    },
    deleteGame: function(gameId) {
        CoreGameData.remove({
            _id: gameId
        });
        GameStateData.remove({
            gameId: gameId
        })
    },
    firstLine: function(firstLine, gameId){
        GameStory.insert({
          gameId: gameId,
          winningResponse: firstLine
        });
    },
    cheater: function(currentUserId, gameId){
    UserRoundData.update({uid: currentUserId, gameId: gameId}, {$set:{notCheating: false}}, console.log('cheater'));

    }


});