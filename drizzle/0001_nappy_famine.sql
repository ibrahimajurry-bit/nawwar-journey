CREATE TABLE `generated_quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`grade` varchar(50) NOT NULL,
	`storageUrl` text NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generated_quizzes_id` PRIMARY KEY(`id`)
);
