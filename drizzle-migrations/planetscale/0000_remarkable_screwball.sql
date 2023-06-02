CREATE TABLE `events` (
	`id` varchar(36) PRIMARY KEY NOT NULL,
	`workspaceId` varchar(36) NOT NULL,
	`type` varchar(8) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`data` json NOT NULL);

CREATE TABLE `tasks` (
	`id` varchar(36) PRIMARY KEY NOT NULL,
	`tasksListId` varchar(36) NOT NULL,
	`workspaceId` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` char NOT NULL DEFAULT 'n',
	`createdAt` timestamp NOT NULL DEFAULT (now()));

CREATE TABLE `tasksLists` (
	`id` varchar(36) PRIMARY KEY NOT NULL,
	`workspaceId` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`isArchived` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()));
