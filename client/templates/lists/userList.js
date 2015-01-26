Template.userList.helpers({
    userEmail: function() {
        return this.emails[0].address;
    },
    userList: function(){
    	return Meteor.users.find({});
    }
});