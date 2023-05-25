-- CreateTable
CREATE TABLE `ToDo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_number` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `creation_date` DATETIME(3) NOT NULL,
    `last_update_date` DATETIME(3) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `status` ENUM('in_backlog', 'in_progress', 'blocked', 'completed') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
