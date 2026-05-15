ALTER TABLE `babies` ADD `timezone` text;--> statement-breakpoint
ALTER TABLE `sleep_entries` ADD `timezone` text;--> statement-breakpoint
ALTER TABLE `users` ADD `timezone` text DEFAULT 'Europe/Paris' NOT NULL;