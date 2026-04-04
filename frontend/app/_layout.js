import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="student-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="lessons/index" options={{ headerShown: false }} />
      <Stack.Screen name="lessons/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="quiz/index" options={{ headerShown: false }} />
      <Stack.Screen name="flashcards/index" options={{ headerShown: false }} />
      <Stack.Screen name="tutor/index" options={{ headerShown: false }} />
      <Stack.Screen name="progress/index" options={{ headerShown: false }} />
      <Stack.Screen name="module/[id]" options={{ title: 'Learning Module' }} />
    </Stack>
  );
}
