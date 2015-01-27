Template.completedStoriesList.helpers({
	returnCompletedStories: function () {
		return CompletedStories.find({moral: {$ne: null }})
		
	}
});