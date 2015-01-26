Meteor.publish('coreGameData', function() {
    return CoreGameData.find({});
});

Meteor.publish('gameStateData', function() {
    return GameStateData.find({});
});

Meteor.publish('gameStory', function() {
    return GameStory.find({});
});

Meteor.publish('userRoundData', function() {
    return UserRoundData.find({});
});

Meteor.publish('userGameData', function() {
    return UserGameData.find({});
});

Meteor.publish('allTimeData', function() {
    return AllTimeData.find({});
});

Meteor.publish('completedStories', function() {
    return CompletedStories.find({});
});


Meteor.publish('allUsers', function() {
    return Meteor.users.find({}, {
        fields: {
            _id: 1,
            username: 1,
            address: 1,
            emails: 1,
            roundsWon: 1,
            roundsPlayed: 1,
            gamesPlayed: 1,
            gamesWon: 1,
            voteTotal: 1,
            responses: 1,
            responseLength: 1,
            responseTime: 1,
            gameIds: 1
        }
    })
})




Accounts.onCreateUser(function(options, user) {
    if(!options.profile){
       options.profile = {}
    }
    options.profile.gameIds = [];
    options.profile.roundsPlayed = 0
    options.profile.roundsWon = 0;
    options.profile.gamesPlayed = 0;
    options.profile.gamesWon = 0;
    options.profile.voteTotal = 0;
    options.profile.responses = [];
    options.profile.responseLength = 0;
    options.profile.responseTime = 0;





    if (options.profile)
        user.profile = options.profile;
    return user;
});













