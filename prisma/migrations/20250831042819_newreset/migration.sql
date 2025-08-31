/*
  Warnings:

  - You are about to alter the column `role` on the `admin_users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - The values [ADMIN] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `admin_users` MODIFY `role` ENUM('SUPER_ADMIN', 'MODERATOR', 'SUPPORT') NOT NULL DEFAULT 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('BUSINESS_OWNER', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER';

-- AddForeignKey
ALTER TABLE `businesses` ADD CONSTRAINT `businesses_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
