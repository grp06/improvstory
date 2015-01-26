Template.gamesList.helpers({

    game: function() {
        return CoreGameData.find({});
    },
    user: function(){
    	return Users.find({});
    },
    userEmail: function() {
        return this.emails[0].address;
    },
});

Template.gamesList.events({
    'click .createGame': function() {

        Meteor.call('createGame', function() {
            


        });

    },
    'click .joinGame': function(){
    	var gameId = this._id;
    	Meteor.call('joinGame', gameId, function(){
    		console.log('hi')
    	});

    }
});