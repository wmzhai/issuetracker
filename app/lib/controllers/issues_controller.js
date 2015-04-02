IssuesController = RouteController.extend({
  subscriptions: function () {
    // set up the subscriptions for the route and optionally
    // wait on them like this:
    //
    // this.subscribe('item', this.params._id).wait();
    //
    // "Waiting" on a subscription does not block. Instead,
    // the subscription handle is added to a reactive list
    // and when all items in this list are ready, this.ready()
    // returns true in any of your route functions.
    this.subscribe('issues', Meteor.userId());
  },

  data: function () {
    // return a global data context like this:
    // Items.findOne({_id: this.params._id});
    return Issues.findOne({_id: this.params._id});
  },

  insert: function () {
    this.render('InsertIssue', {});
  },

  list: function() {
    this.render('IssuesList', {});
  },

  edit: function() {
    this.render('EditIssue', {});
  }
});
