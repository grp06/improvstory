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
            profile: 1,
            username: 1,
            address: 1,
            emails: 1,
            roundsWon: 1,
            roundsPlayed: 1,
            gamesWon: 1,
            voteTotal: 1,
            responses: 1,
            responseLength: 1,
            responseTime: 1,
        }
    })
})





Accounts.onCreateUser(function(options, user) {
    if (!options.profile) {
        options.profile = {}
    }
    options.profile.roundsWon = 0;
    options.profile.gamesPlayed = 0;
    options.profile.gamesWon = 0;
    options.profile.voteTotal = 0;
    options.profile.responseLength = 0;
    options.profile.responseTime = 0;
    options.profile.largePicture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    options.profile.normalPicture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=normal";
    options.profile.smallPicture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=small";

//id: 704586496327203
//secret: 01894c0c52292f86d063e06bf2d0dc46



    if (options.profile)
        user.profile = options.profile;
    return user;
});