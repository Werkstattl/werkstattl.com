--- 
title: "Update Shopware 6 with composer update --no-scripts"
description: "Learn how to update Shopware 6 with a alternative composer command. This guide provides step-by-step instructions for a hopefully seamless update process."
published: 2024-04-29
updated: 2026-08-14
repo: Werkstattl/OpenBlogware
layout: ../../layouts/BlogPostLayout.astro 
---
 
Since I encountered several issues during the Shopware 6 update process, and a Shopware developer recommended using `composer update --no-scripts` instead of `composer update`, I decided to write a guide on how to update Shopware 6 using this command.

Please note that this guide is applicable if Shopware was installed using the shopware-installer.phar.php and you have SSH access to the server. While it may also work for other installation methods, I have not tested those.

This guide allows you to specify the exact version of Shopware 6 you want to update to. Always choose the latest available patch release for your target version.

You can find all [Shopware releases on GitHub](https://github.com/shopware/shopware/releases).

### Shopware 6.7 and Twig 3.28

Twig 3.28 exposed an incompatibility in Shopware 6.7 releases up to 6.7.11.1. Depending on the Shopware version and the templates in use, this can cause an HTTP 500 error when rendering `sw_include`, including a completely inaccessible Administration.

The issue is fixed in [Shopware 6.7.12.1](https://github.com/shopware/shopware/releases/tag/v6.7.12.1) and newer releases. If you are updating to Shopware 6.7, use version 6.7.12.1 or newer.

If you must remain on an affected version, add Shopware's conflict repository and conflict package before running Composer:

```sh
composer config repositories.shopware-conflicts composer https://shopware.github.io/conflicts/
composer require shopware/conflicts
```

If Twig 3.28 has already been installed and the Administration returns an HTTP 500 error, run the commands above and then let Composer resolve Twig to a compatible version:

```sh
composer update twig/twig --with-all-dependencies
```

For technical details, see [Shopware issue #18028](https://github.com/shopware/shopware/issues/18028).

## Steps to Update Shopware 6 with Composer

1. **Backup Your System:**
   - Ensure you have a backup of your database and files before proceeding.

2. **Prepare for Update:**
   - Run the following command to prepare the system for the update:
     ```sh
     bin/console system:update:prepare
     ```

3. **Check the Target Version's composer.json:**
   - Open the [composer.json from the Shopware production template](https://github.com/shopware/template/blob/trunk/composer.json).
   - The link initially shows the `trunk` development version. Use the branch/tag selector above the file on GitHub and select the tag that exactly matches your target Shopware version. Only keep `trunk` selected if you intentionally want the current development version.

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

3. **Update All Apps:**
   - If you have installed plugins with the new app system, update them with:
     ```sh
     bin/console app:refresh
     ```

4. **Rebuild the Storefront:**
   - Rebuild the storefront to ensure all changes are applied:
     ```sh
     bin/console assets:install
     bin/console bundle:dump
     bin/console theme:compile
     bin/console cache:clear
     ```

If you encounter any issues, check the logs and resolve them accordingly.

I can also recommend joining the [Shopware Discord Community](https://discord.gg/shopware) and asking for help there.

### Known errors

- *Health check errors after the update.*  
  Close the browser and run the clear cache command again.
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
  # this command got removed in Shopware 6.7
  bin/console system:generate-jwt-secret --force
  ```
- *Lcobucci\JWT\Signer\InvalidKeyProvided: Key provided is shorter than 256 bits / Backend login does not work*  
  Shopware 6.7+ uses APP_SECRET for JWT.
  ```sh
  bin/console system:generate-app-secret
  ```
  Copy the generated key to your `.env.local` file as `APP_SECRET=your_generated_key`.
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
