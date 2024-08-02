# Install and run

This repo can be run by cloning and running

```bash
bun install && bun (ios | android)
```

If you want to run your own build from this template repository, you need
to update your ios and android bundle identifiers and then run

```bash
bun expo prebuild
```

If you want to run this on a real device, you will have to build using xcode.

# Basic template

This repo is a template to showcase what expo-local-authentication is able to do. The main
feature of the template is a hook that can be used to

- determine if touch or face recognition is enabled (weak and strong biometrics)
- determine if a device is enrolled in biometrics
- get a callback for triggering authentication with option on success and on error options

This hook uses local state but can be adapted to reference any state store or state machine
such as xstate, zustand or redux.

# Expo Router and Tailwind CSS

Use [Expo Router](https://docs.expo.dev/router/introduction/) with [Nativewind](https://www.nativewind.dev/v4/overview/) styling.

## 🚀 How to use

```sh
npx create-expo-app -e with-router-tailwind
```
