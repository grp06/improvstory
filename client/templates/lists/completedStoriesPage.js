Template.completedStoriesPage.helpers({
	returnThisStory: function () {
		console.log(this._id)
		return CompletedStories.find({_id: this._id})
	}
});