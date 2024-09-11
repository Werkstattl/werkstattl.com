--- 
title: "Update Shopware 6 with composer update --no-scripts"
description: "Learn how to update Shopware 6 with a alternative composer command. This guide provides step-by-step instructions for a hopefully seamless update process."
published: 2024-04-29
layout: ../../layouts/BlogPostLayout.astro 
---
 
Since I encountered several issues during the Shopware 6 update process, and a Shopware developer recommended using `composer update --no-scripts` instead of `composer update`, I decided to write a guide on how to update Shopware 6 using this command.

Please note that this guide is applicable if Shopware was installed using the shopware-installer.phar.php and you have SSH access to the server. While it may also work for other installation methods, I have not tested those.

This guide allows you to specify the exact version of Shopware 6 you want to update to.

You can find all [Shopware releases on GitHub](https://github.com/shopware/shopware/releases).

## Steps to Update Shopware 6 with Composer

1. **Backup Your System:**
   - Ensure you have a backup of your database and files before proceeding.

2. **Prepare for Update:**
   - Run the following command to prepare the system for the update:
     ```sh
     bin/console system:update:prepare
     ```

3. **Update Composer Dependencies:**
   - Open `composer.json` and update the versions for the following packages:
     - `shopware/core`
     - `shopware/administration`
     - `shopware/elasticsearch`
     - `shopware/storefront`
   - If you have installed any plugins using Composer, update their versions as well.

4. **Execute Composer Update:**
   - Run the following command to update dependencies:
     ```sh
     composer update --no-scripts
     ```
   - Composer will notify you of any conflicts. If conflicts occur, manually resolve them by editing the `composer.json` file and re-running the previous command. For example, when upgrading from Shopware 6.5 to 6.6, change the required package `symfony/runtime` to `>=5`. Or update PHP as required.

5. **Remove Bin Directory:**
   - Remove the `bin` directory and index.php to ensure `recipes:install` can update files like `bin/console`:
     ```sh
     rm -rf bin
     rm public/index.php
     ```

6. **Install Composer Recipes:**
   - Execute the following command to install Composer recipes:
     ```sh
     yes | composer recipes:install --force --reset
     ```

7. **Finish the Update:**
   - Run the following command to complete the update process:
     ```sh
     bin/console system:update:finish
     ```

## Update Plugins

1. **Update All Plugins:**
   - Run the following command to update all plugins:
     ```sh
     bin/console plugin:update:all
     ```

2. **Clear Cache:**
   - Clear the cache by running:
     ```sh
     bin/console cache:clear
     ```

Health check errors may occur after the update. 
To resolve them, close the browser and run the clear cache command again.

If you encounter any issues, check the logs and resolve them accordingly.

I can also recommend joining the [Shopware Slack Community](https://slack.shopware.com/) and asking for help in the `#shopware6` channel.
