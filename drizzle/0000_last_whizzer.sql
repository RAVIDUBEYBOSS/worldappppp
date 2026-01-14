CREATE TABLE `claims` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_nullifier` text,
	`amount` integer NOT NULL,
	`tx_hash` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_nullifier`) REFERENCES `users`(`nullifier_hash`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nullifier_hash` text NOT NULL,
	`wallet_address` text,
	`total_claimed` integer DEFAULT 0,
	`last_claim_at` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX `users_nullifier_hash_unique` ON `users` (`nullifier_hash`);