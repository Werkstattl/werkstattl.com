--- 
title: "How to Fix the Qwik Framework Sharp Error on Termux"
description: "If you encounter the `sharp` module error when running `npm start` on your Android device, there's a simple solution."
published: 2024-05-24
layout: ../../layouts/BlogPostLayout.astro 
---

This method is tested on armv8l devices.

## Solution

When you see the error message:

```
Error: Could not load the “sharp” module using the android-arm runtime
```

Resolve it by running:

```
npm install --cpu=wasm32 sharp
```

After executing this command, `npm start` should function correctly.
