import { Link } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Local from "expo-local-authentication";
import { cn } from "@/util/cn";

type UseBiometricsOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

const DefaultBiometricsOptions: UseBiometricsOptions = {};

const useBiometrics = (
  options: UseBiometricsOptions = DefaultBiometricsOptions
) => {
  const { onSuccess, onError } = options;
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [securityLevel, setSecurityLevel] =
    useState<Local.SecurityLevel | null>(null);
  const [authTypes, setAuthTypes] = useState<Local.AuthenticationType[]>([]);

  //this will tie in to state machine
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const onMount = useCallback(async () => {
    setLoading(true);
    //check hardware support
    const isSupported = await Local.hasHardwareAsync();
    const isEnabled = await Local.isEnrolledAsync();
    const secLevel = await Local.getEnrolledLevelAsync();
    const types = await Local.supportedAuthenticationTypesAsync();

    setSupported(isSupported);
    setEnabled(isEnabled);
    setSecurityLevel(secLevel);
    setAuthTypes(types);
    setLoading(false);

    //todo: find highest supported security level

    //if security level is code, set enabled to false
  }, [setSupported, setEnabled, setLoading]);

  useEffect(() => {
    onMount();
  }, []);

  const onAuthenticate = useCallback(async () => {
    const { success } = await Local.authenticateAsync({});

    if (!success) {
      //todo: handle failure by breaking into app's pin flow
      if (onError) onError();
      return;
    }

    //todo: handle success state here
    setAuthenticated(success);
    if (onSuccess) onSuccess();
  }, [setAuthenticated, onSuccess, onError]);

  return {
    authenticated,
    isEnabled: enabled,
    isSupported: supported,
    onAuthenticate,
    onMount,
    loading,
    authTypes,
    securityLevel,
  };
};

export default function Page() {
  const {
    authenticated,
    onAuthenticate,
    isEnabled,
    isSupported,
    authTypes,
    securityLevel,
  } = useBiometrics({
    onSuccess: () => alert("Success"),
  });
  return (
    <SafeAreaView className="items-center justify-center flex-1 gap-10">
      <Text
        className={cn(
          "text-2xl",
          isSupported ? "text-green-600" : "text-red-500"
        )}
      >
        Supported
      </Text>
      <Text
        className={cn(
          "text-2xl",
          isEnabled ? "text-green-600" : "text-red-500"
        )}
      >
        Enabled
      </Text>
      <Pressable
        onPress={onAuthenticate}
        className="items-center justify-center p-2 rounded-md shadow-sm bg-slate-900 active:bg-slate-700"
      >
        <Text className="text-white">Log in</Text>
      </Pressable>
      <Text
        className={cn(
          "text-2xl",
          authenticated ? "text-green-600" : "text-red-500"
        )}
      >
        {authenticated ? "Logged in" : "Logged out"}
      </Text>
      <Text className={cn("text-2xl dark:text-white")}>
        {authTypes
          .map((type) =>
            Object.keys(Local.AuthenticationType).find(
              (key) => Local.AuthenticationType[key] === type
            )
          )
          .join(", ")}
      </Text>
      <Text className={cn("text-2xl dark:text-white")}>
        {Object.keys(Local.SecurityLevel).find(
          (level) => securityLevel === Local.SecurityLevel[level]
        )}
      </Text>
    </SafeAreaView>
  );
}

function Content() {
  return (
    <View className="flex-1">
      <View className="py-12 md:py-24 lg:py-32 xl:py-48">
        <View className="px-4 md:px-6">
          <View className="flex flex-col items-center gap-4 text-center">
            <Text
              role="heading"
              className="text-3xl font-bold tracking-tighter text-center native:text-5xl sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Welcome to Project ACME
            </Text>
            <Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400">
              Discover and collaborate on amce. Explore our services now.
            </Text>

            <View className="gap-4">
              <Link
                suppressHighlighting
                className="flex items-center justify-center px-4 py-2 overflow-hidden text-sm font-medium transition-colors bg-gray-900 rounded-md h-9 text-gray-50 web:shadow ios:shadow hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="/"
              >
                Explore
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function Header() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: top }}>
      <View className="flex flex-row items-center justify-between px-4 lg:px-6 h-14 ">
        <Link className="items-center justify-center flex-1 font-bold" href="/">
          ACME
        </Link>
        <View className="flex flex-row gap-4 sm:gap-6">
          <Link
            className="font-medium text-md hover:underline web:underline-offset-4"
            href="/"
          >
            About
          </Link>
          <Link
            className="font-medium text-md hover:underline web:underline-offset-4"
            href="/"
          >
            Product
          </Link>
          <Link
            className="font-medium text-md hover:underline web:underline-offset-4"
            href="/"
          >
            Pricing
          </Link>
        </View>
      </View>
    </View>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      className="flex bg-gray-100 shrink-0 native:hidden"
      style={{ paddingBottom: bottom }}
    >
      <View className="items-start flex-1 px-4 py-6 md:px-6 ">
        <Text className={"text-center text-gray-700"}>
          © {new Date().getFullYear()} Me
        </Text>
      </View>
    </View>
  );
}
