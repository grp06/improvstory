Template.showVoteResults.helpers({
    returnRankings: function() {

        return UserGameData.find({
            gameId: this._id
        }, {
            sort: {
                roundsWon: -1
            }
        });

    },
    voteResults: function() {
        var gameData = GameStateData.find({
            gameId: this._id
        }).fetch();
        var currentRound = !!gameData[0] && gameData[0].round;
        return UserRoundData.find({
            gameId: this._id,
            round: currentRound
        }, {
            sort: {
                votes: -1
            }
        })
    },

});

Template.all.helpers({
    returnRankings: function() {

        return UserGameData.find({
            gameId: this._id
        }, {
            sort: {
                roundsWon: -1
            }
        });

    }
    })