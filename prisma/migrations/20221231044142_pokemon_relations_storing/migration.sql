--AlterTable
 ALTER TABLE `Vote` DROP COLUMN `votedAgainst`,
    DROP COLUMN `votedFor`,
    ADD COLUMN  `votedAgainstId` INTEGER NOT NULL,
    ADD COLUMN  `votedForId` INTEGER NOT NULL;


 --CreateTable
 CREATE TABLE `Pokemon` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `spriteUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
 )   DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

 --AddForeignKey
--  ALTER TABLE `Vote` ADD CONSTRAINT `Vote_votedForId_fkey` FOREIGN KEY (`votedForId`) REFERENCES `Pokemon` (`id`) ON DELETE CASCADE;

--  AddForeignKey
--  ALTER TABLE `Vote` ADD CONSTRAINT `Vote_votedAgainstId_fkey` FOREIGN KEY (`votedAgainstId`) REFERENCES `Pokemon` (`id`) ON DELETE CASCADE;
