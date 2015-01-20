Template.userPage.helpers({
    userEmail: function() {
        return this.emails[0].address;
    },
    user: function(){
    	return Users.find({_id: this._id});
    }
});


