---
title: "Publishing Android Apps with PWABuilder and GitHub Pages: Tips & Tricks"
description: "Discover how to seamlessly publish Android apps with PWABuilder when hosted on GitHub Pages. Learn tips on ensuring a native-like experience without browser bars and addressing the `.well-known` folder issue with Jekyll."
published: 2023-10-22
layout: ../../../layouts/BlogPostLayout.astro
---

When developing a Progressive Web App (PWA) with an intention to convert it into an Android app, **PWABuilder** is an excellent tool that simplifies this process. But if you're hosting your PWA on **GitHub Pages**, there are a few nuances you need to be aware of. This guide will walk you through the process and provide solutions to common challenges.

## PWABuilder: A Brief Overview

[PWABuilder](https://www.pwabuilder.com/) is a tool that helps developers transform their PWAs into native apps for various platforms, including Android. It wraps your PWA into an APK (Android's application package file) suitable for submission to the Google Play Store.

## Does the Android App Show a Browser Navigation Bar?

One common concern developers have is whether the converted Android app will display a browser navigation bar, making it look more like a web page rather than a native app. The answer is no. When you use PWABuilder, it utilizes **Trusted Web Activities (TWA)** for the Android app, ensuring your PWA runs full screen without any browser navigation bars. This provides a more immersive and native-like experience for your app users.

## Hosting on GitHub Pages: The `.well-known` Folder Issue

If you're hosting your PWA on GitHub Pages, there's a tricky issue you might encounter related to the `.well-known` folder. This folder is essential for several web services, including the PWA manifests and service workers that are crucial for PWABuilder.

By default GitHub Pages uses Jekyll to process repositories. And Jekyll ignores folders that start with a dot (e.g., `.well-known`). This means your `.well-known` folder won't be published, causing potential problems for your PWA.

### The Solution: Adding a `.nojekyll` File

To overcome this limitation, you need to tell Jekyll (and thereby GitHub Pages) to bypass its default behavior. This can be achieved by adding a **.nojekyll** file to the root of your repository. Here's how:

1. Create a new file in the root of your GitHub repository.
2. Name this file `.nojekyll` (with no file extension).
3. Ensure the file is committed and pushed to your GitHub repository.

By adding this file, you're instructing GitHub Pages not to use Jekyll, ensuring your `.well-known` folder gets published as expected.

## Wrapping Up

I recently published the Android game [Dungeon Crawler on Demand](https://play.google.com/store/apps/details?id=com.thomaspeissl.quick_dungeon_crawler_od.twa) with this exact steps.

Publishing an Android app with PWABuilder while hosting on GitHub Pages requires attention to some unique challenges. By understanding these issues and their solutions, you can ensure a smooth deployment of your PWA and its Android app counterpart. Happy coding!
