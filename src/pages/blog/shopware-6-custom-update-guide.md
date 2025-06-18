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

3. **Check the Target Version's composer.json:**
   - Navigate to the [Shopware production template](https://github.com/shopware/production) and locate the `composer.json` file for the version you want to update to. You can find the appropriate file by switching to the corresponding Git tag.
   - [Shopware production composer.json (v6.6.9.0)](https://github.com/shopware/production/blob/v6.6.9.0/composer.json)

4. **Update Your composer.json:**
   - Open your Shopware `composer.json` file.
   - Update the version of `shopware/core` to match the target version.
   - Adjust other packages listed in the require section to align with the new version's dependencies.

5. **Update Plugin Dependencies:** 
   - If you have installed any plugins via Composer, ensure their versions are updated to be compatible with the target Shopware version.

6. **Execute Composer Update:**
   - Run the following command to update dependencies:
     ```sh
     composer update --no-scripts
     ```
   - Composer will notify you of any conflicts. If conflicts occur, manually resolve them by editing the `composer.json` file and re-running the previous command. For example, when upgrading from Shopware 6.5 to 6.6, change the required package `symfony/runtime` to `>=5`. Or update PHP as required.

7. **Remove Bin Directory:**
   - Remove the `bin` directory and index.php to ensure `recipes:install` can update files like `bin/console`:
     ```sh
     rm -rf bin
     rm public/index.php
     ```

8. **Install Composer Recipes:**
   - Execute the following command to install Composer recipes:
     ```sh
     yes | composer recipes:install --force --reset
     ```

9. **Finish the Update:**
   - Run the following commands to complete the update process:
     ```sh
     bin/console cache:clear
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

### Known errors

- *Attempted to load class "HttpKernel"*  
  Follow steps 3-8 above.
- *Attempted to load class "SensioFrameworkExtraBundle"*  
  Workaround for removing these old packages:
  ```sh
  composer require sensio/framework-extra-bundle enqueue/enqueue-bundle sroze/messenger-enqueue-transport
  composer remove sensio/framework-extra-bundle enqueue/enqueue-bundle sroze/messenger-enqueue-transport
  ```
- *Key provided is shorter than 2048 bits*  
  Try regenerating the key:
  ```sh
  bin/console system:generate-jwt-secret --force
  ```
- *Attempted to load class "HttpKernel" from namespace "Shopware\Core"  
  This can be tricky. Try running these:
  ```sh
  chmod -R 775 var/cache
  rm -rf vendor
  composer install
  composer update
  composer dump-autoload
  bin/console about
  bin/console cache:clear
  ```
