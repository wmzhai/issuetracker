Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.route('/', {
  name: 'home',
  controller: 'HomeController',
  action: 'action',
  where: 'client'
});

Router.route('/insert_issue', {
  name: 'insertIssue',
  controller: 'IssuesController',
  action: 'insert',
  where: 'client'
});

