CREATE TABLE `registered_teachers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`whatsapp` varchar(30) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`approved` enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `registered_teachers_id` PRIMARY KEY(`id`),
	CONSTRAINT `registered_teachers_email_unique` UNIQUE(`email`)
);
