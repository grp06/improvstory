Template.userPage.helpers({

    user: function(){
    	return Meteor.users.find({_id: this._id});
    },

    averageResponseLength: function(){
    	var cursor = Users.find({_id: this._id}).fetch();
    	var length = !! cursor[0] && cursor[0].profile.responseLength
    	var roundsPlayed = !! cursor[0] && cursor[0].profile.roundsPlayed
    	var avgResponseLength = Math.round(length/roundsPlayed)

    	if(isNaN(avgResponseLength)){
    		return "0"
    	} else {
    		return avgResponseLength
    	}
    },
    averageResponseTime: function(){
    	var cursor = Users.find({_id: this._id}).fetch();
        var time = !! cursor[0] && cursor[0].profile.responseTime
    	var roundsPlayed = !! cursor[0] && cursor[0].profile.roundsPlayed
    	
    	var avgResponseTime = Math.round(time/roundsPlayed);
    	if(isNaN(avgResponseTime)){
    		return "0"
    	} else {
    		return avgResponseTime
    	}
    }
});


