# 如何使用Meteor和Iron Scaffolding快速搭建web程序

采用Meteor框架搭建现代的web应用很快很方便，不过如果你使用iron脚手架工具和autoforms工具包的话，这个过程会更加快捷，这个例子就展示了如何一步一步地新建一个程序。

## 安装Meteor和Iron命令行工具

使用如下两个指令分别安装meteor和iron

	$ curl http://install.meteor.com/ |sh
	$ npm install -g iron-meteor
	

## 新建程序

我们使用如下指令创建一个叫做issuetracker的程序

	$ iron create issuetracker

这个脚手架工具将创建一个新的issuetracker目录，我们可以进入如图1所示目录看一下目录结构，我们的meteor程序在app子目录里。

![](images/iron-create-app.png)

图1 新建程序的目录结构