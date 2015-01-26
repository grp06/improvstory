Template.completedStoriesList.helpers({
	returnCompletedStories: function () {
		return CompletedStories.find({})
	}
});