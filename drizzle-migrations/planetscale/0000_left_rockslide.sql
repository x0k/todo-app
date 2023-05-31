CREATE TABLE `events` (
	`id` varchar(21) PRIMARY KEY NOT NULL,
	`type` varchar(8),
	`createdAt` datetime,
	`data` json);

CREATE TABLE `tasks` (
	`id` varchar(21) PRIMARY KEY NOT NULL,
	`tasksListId` varchar(21) NOT NULL,
	`title` varchar(255),
	`status` char,
	`createdAt` datetime);

CREATE TABLE `tasksLists` (
	`id` varchar(21) PRIMARY KEY NOT NULL,
	`title` varchar(255),
	`isArchived` boolean,
	`createdAt` datetime);

ALTER TABLE `tasks` ADD CONSTRAINT `tasks_tasksListId_tasksLists_id_fk` FOREIGN KEY (`tasksListId`) REFERENCES `tasksLists`(`id`) ON DELETE cascade ON UPDATE no action;