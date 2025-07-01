// app/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
  return (
    <>

      <Stack screenOptions={{headerShown:false}} />
    </>
  )
}
