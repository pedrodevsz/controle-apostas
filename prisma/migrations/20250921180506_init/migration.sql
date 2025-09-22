-- CreateTable
CREATE TABLE `Bet` (
    `id` VARCHAR(191) NOT NULL,
    `odd` DOUBLE NOT NULL,
    `entryValue` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `result` VARCHAR(191) NOT NULL,
    `resultValue` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
