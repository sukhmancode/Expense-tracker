import SafeScreen from "@/components/SafeScreen";
import { Stack } from "expo-router";

export default function RootLayout() {
  //@ts-ignore
  return (
    <SafeScreen>
      <Stack/>;
    </SafeScreen>
  )
}
