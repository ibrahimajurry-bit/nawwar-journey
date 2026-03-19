CREATE TABLE `teacher_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schoolName` varchar(255) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`isPremium` int NOT NULL DEFAULT 0,
	`premiumExpiry` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teacher_accounts_id` PRIMARY KEY(`id`)
);
