import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: '#ffffff',
          },
          headerTintColor: '#ffffff',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Countdowns',
          }}
        />
        <Stack.Screen
          name="add"
          options={{
            title: 'Add Countdown',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
} 