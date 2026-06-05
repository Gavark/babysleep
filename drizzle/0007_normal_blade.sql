CREATE TABLE `app_config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_seen_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `push_subscriptions_endpoint_unique` ON `push_subscriptions` (`endpoint`);--> statement-breakpoint
CREATE INDEX `push_subscriptions_user_id` ON `push_subscriptions` (`user_id`);--> statement-breakpoint
CREATE TABLE `scheduled_pushes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`baby_id` integer NOT NULL,
	`kind` text NOT NULL,
	`fire_at` integer NOT NULL,
	`fired_at` integer,
	`cancelled_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`baby_id`) REFERENCES `babies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `scheduled_pushes_pending_fire_at` ON `scheduled_pushes` (`fire_at`);--> statement-breakpoint
CREATE INDEX `scheduled_pushes_baby_id` ON `scheduled_pushes` (`baby_id`);