# 使用Iron工具快速搭建Meteor程序

采用Meteor框架搭建现代的web应用很快很方便，不过如果你使用iron脚手架工具和autoforms工具包的话，这个过程会更加快捷，这个例子就展示了如何一步一步地新建一个程序。

## 安装Meteor和Iron工具

使用如下两个指令分别安装meteor和iron

	$ curl http://install.meteor.com/ |sh
	$ npm install -g iron-meteor
	

## 新建程序

我们使用如下指令创建一个叫做issuetracker的程序

	$ iron create issuetracker

这个脚手架工具将创建一个新的issuetracker目录，我们可以进入如图1所示目录看一下目录结构，我们的meteor程序在app子目录里。

![](images/iron-create-app.png)

图1 新建程序的目录结构


## 安装新的package

我们通过下述指令添加一些常规的meteor package，我们将在项目中使用

	$iron add twbs:bootstrap
	$iron add aldeed:collection2
	$iron add aldeed:autoform
	$iron add aldeed:delete-button
	$iron add momentjs:moment
	$iron add accounts-password
	$iron add ian:accounts-ui-bootstrap-3
	$iron add natestrauser:font-awesome

然后我们再通过下属指令删除2个不使用的package

	$iron remove autopublish
	$iron remove insecure

这是我们如果打开app/.meteor/packages文件的话，应该可以看到如下package

	meteor-platform
	iron:router
	twbs:bootstrap
	aldeed:collection2
	aldeed:autoform
	aldeed:delete-button
	momentjs:moment
	accounts-password
	ian:accounts-ui-bootstrap-3
	natestrauser:font-awesome


## 添加数据模型

本项目管理issue的跟踪，只涉及到一个数据模型issue。在meteor中，数据被表述称collections，下述iron指令可以用于添加一个名叫issue的collection

	iron g:collection issues

这条指令实际上生成一个文件
	
	app/lib/collections/issues.js

打开这个文件，修改成如下内容

	Issues = new Mongo.Collection('issues');
	
	Issues.attachSchema(new SimpleSchema({
	  title:{
	    type: String,
	    label: "Title",
	    max: 100
	  },
	  description:{
	    type: String,
	    label: "Description",
	    max: 1024
	  },
	  dueDate:
	  {
	    type: Date,
	    label: "Due Date",
	    optional: true
	  },
	  priority:
	  {
	    type: String,
	    label: "Priority",
	    allowedValues: ['High', 'Medium', 'Low'],
	    optional: true
	  },
	  createdBy: {
	    type: String,
	    autoValue: function() {
	       return this.userId
	    }
	  }
	}));
	
	if (Meteor.isServer) {
	  Issues.allow({
	    insert: function (userId, doc) {
	      return userId;
	    },
	
	    update: function (userId, doc, fieldNames, modifier) {
	      return userId;
	    },
	
	    remove: function (userId, doc) {
	      return userId;
	    }
	  });
	}


在上述代码中，首先我们创建了一个Mongo的collection，并将他的引用保存在Issues里。然后，一个collection的schema被attach到这个对象上，用来描述数据库结构。 在这里我们使用了一个SimpleSchema对象，这个对象包含4个字段title, description, dueDate and priority。 对于每一个字段，都定义了一个type和label，最后title和description都定义了max字段来限制字符串的长度。 而priority字段则设置了几个allowedValues作为其值域。


另外，我们在 publish.js文件里面添加如下代码，以便客户端访问特定的数据集。

	Meteor.publish('issues', function (userId) {
	  return Issues.find({createdBy: userId});
	});

这里的publish函数接受一个参数：userId。 这个参数用以限制被发布的对象仅限于创建它的user。


## 初始化用户界面

 我们使用bootstrap来初始化用户界面，用户界面整体放在MasterLayout这个模板里，他的代码在如下文件里

	app/client/templates/layouts/master_layout/master_layout.html

其代码如下

	<template name="MasterLayout">
	  <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
	    <div class="container">
	      <div class="navbar-header">
	          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navigationbar">
	            <span class="sr-only">Toggle navigation</span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	          </button>
	          <a class="navbar-brand" href="/"><i class="fa fa-bug"></i> IssueTracker</a>
	      </div>
	      <div class="collapse navbar-collapse" id="navigationbar">
	        <ul class="nav navbar-nav navbar-right">
	            <li>{{#linkTo route="home"}}<i class="fa fa-home"></i> Home{{/linkTo}}</li>
	            {{#if currentUser}}
	              <li>{{#linkTo route="issuesList"}}<i class="fa fa-align-justify"></i> Issues{{/linkTo}}</li>
	              <li>{{#linkTo route="insertIssue"}}<i class="fa fa-plus"></i> New Issue{{/linkTo}}</li>
	            {{/if}}
	            <li><div class="nav navbar-nav navbar-right"> {{> loginButtons}}</div></li>
	        </ul>
	      </div>
	    </div>
	  </nav>
	  <div class="container">
	    {{> yield}}
	  </div>
	  <nav class="navbar navbar-default navbar-fixed-bottom">
	    <div class="container">
	      <ul class="nav navbar-nav navbar-right">
	          <li>Built with Meteor</li>
	      </ul>
	    </div>
	  </nav>
	</template>

注意，我们也需要修改一下如下css文件

	app/client/stylesheets/main.css

其代码可以修改为

	.main {
	}
	
	body { padding-top: 70px; padding-bottom: 70px;}


然后运行程序，可以看到如图2所示效果

![](images/layout.png)

图2 初始化程序界面


## 创建Controller和Route

执行如下指令，创建一个controller

	iron g:controller Issues

生成文件

	app/lib/controllers/issues_controller.js

再执行

	$iron g:route 'insert_issue'
	$iron g:route 'issues_list'
	$iron g:route 'edit_issue'
效果如下

![](images/g-route.png)

图3 通过iron指令生成route


然后删掉在app/lib/controllers下面多生成的3个文件

	edit_issue_controller.js
	insert_issue_controller.js
	issues_list_controller.js

最后修改app/lib/controllers/issues_controller.js如下

	IssuesController = RouteController.extend({
	  subscriptions: function () {
	    this.subscribe('issues', Meteor.userId());
	  },
	
	  data: function () {
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

最后我们修改routes.js如下

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
	
	
	Router.route('issues_list', {
	  name: 'issuesList',
	  controller: 'IssuesController',
	  action: 'list',
	  where: 'client'
	});
	
	Router.route('/issue/:_id', {
	  name: 'editIssue',
	  controller: 'IssuesController',
	  action: 'edit',
	  where: 'client'
	});


这时访问http://localhost:3000/issues_list会有如下显示

![](images/issues-list.png)

图4 访问issues list网页



## 对routes进行安全控制

在routes.js加入以下代码以防止非授权的针对InsertIssue和IssuesList的访问

	Router.onBeforeAction(function() {
	  if (!Meteor.user()) {
	    this.render('AccessDenied');
	  } else
	  {
	     this.next();
	  }
	}, {only: ['issuesList', 'insertIssue']});

然后，我们用如下template指令AccessDenied生成页面

	$iron g:template AccessDenied

其中，access_denied.html的内容修改如下

	<template name="AccessDenied">
	  <div class="alert alert-danger" role="alert">
	    <h2>Access Denied</h2>
	    <hr>
	    <h4>Please log in to access this page!</h4>
	  </div>
	</template>

这时候在未登录时访问http://localhost:3000/issues_list会有如下显示

![](images/access-denied.png)

图5 访问issues list网页显示Access Denided


## 实现IssuesController

IssuesController在issues_controller.js里实现。首先，我们在subscriptions函数里通过subscribe使用2个参数来从服务器端订阅issues，第一个参数是我们需要订阅的collection的名字'issues',第二个参数是用户的id，这样限制只能获取该用户的issue。 然后，data属性用来获取特定id的数据项，在这里我们使用了findOne函数。 最后3个函数insert, list and edit则分别用来渲染不同的模板。该类代码如下

	IssuesController = RouteController.extend({
	  subscriptions: function () {
	    this.subscribe('issues', Meteor.userId());
	  },
	
	  data: function () {
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


## 插入新Issue

插入新Issue的页面代码在insert_issue.html文件里，其内容修改如下

	<template name="InsertIssue">
	  <h1>Create New Issue</h1>
	  {{> quickForm collection="Issues" id="insertIssueForm" type="insert" omitFields="createdBy" buttonContent="Create"}}
	</template>

这里我们使用autoform里面的quickForm生成页面，最终页面显示如下

![](images/insert-issue.png)

图6 Insert Issue页面显示


## 显示Issue列表

我们将issues_list.html的代码修改如下，以实现显示issue列表的功能。

	<template name="IssuesList">
	  <h1>Issues List</h1>
	  <table class="table table-hover">
	        <thead>
	          <tr>
	            <th>Title</th>
	            <th>Description</th>
	            <th>Due Date</th>
	            <th>Priority</th>
	            <th></th>
	          </tr>
	        </thead>
	        <tbody>
	          {{#each issues}}
	            <tr>
	              <td>{{title}}</td>
	              <td>{{description}}</td>
	              <td>{{dueDateFormatted}}</td>
	              <td>
	                {{#if priorityHigh}}
	                  <span class="label label-danger">{{priority}}</span>
	                {{/if}}
	
	                {{#if priorityMedium}}
	                  <span class="label label-warning">{{priority}}</span>
	                {{/if}}
	
	                {{#if priorityLow}}
	                  <span class="label label-success">{{priority}}</span>
	                {{/if}}
	              </td>
	              <td>
	                {{#linkTo route='editIssue'}}
	                  <i class="fa fa-pencil-square-o"></i>
	                {{/linkTo}}
	              </td>
	            </tr>
	          {{/each}}
	
	        </tbody>
	      </table>
	</template>

在输出中，issue的优先级可以控制bootstrap的显示样式，具体有3种类型：label-danger, label-warning and label-success。为了决定每种类型显示成什么样子，可以通过修改 issues_list.js代码控制。

	Template.IssuesList.events({
	});
	
	Template.IssuesList.helpers({
	  issues: function () {
	    return Issues.find();
	  },
	  dueDateFormatted: function () {
	    return moment(this.dueDate).format("MMM Do YY");
	  },
	  priorityHigh: function() {
	    if (this.priority === 'High')
	      return true;
	    else
	      return false;
	  },
	  priorityMedium: function() {
	    if (this.priority === 'Medium')
	      return true;
	    else
	      return false;
	  },
	  priorityLow: function() {
	    if (this.priority === 'Low')
	      return true;
	    else
	      return false;
	  }
	});


最终显示效果如下

![](images/issues-list-done.png)

图6 最终Issue List页面显示
