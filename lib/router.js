Router.configure({
  layoutTemplate: 'layout',
   notFoundTemplate: 'notFound'

});

Router.route('/user', {name: 'users'});
Router.route('/', {name: 'gamesList'});
Router.route('/completedStories', {name: 'completedStories'});



Router.onBeforeAction(function () {


  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.render('callToAction');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.next();
  }
});

Router.route('/users/:_id', {
  name: 'userPage',
  data: function() { 
    return Meteor.users.findOne(this.params._id);
  }

});

Router.route('/games/:_id', {
  name: 'gamePage',
  data: function() { 
    return CoreGameData.findOne(this.params._id);
  }

});

Router.route('/completedStories/:_id', {
  name: 'completedStoriesPage',
  data: function() { 
    return CompletedStories.findOne(this.params._id);
  }

});