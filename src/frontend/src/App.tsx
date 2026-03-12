import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { CardView } from "./components/CardView";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

type View = "cards" | "admin";

function AppContent() {
  const [view, setView] = useState<View>("cards");
  const [selectedDate, setSelectedDate] = useState("13/03/2026");

  if (view === "admin") {
    return (
      <AdminPanel initialDate={selectedDate} onBack={() => setView("cards")} />
    );
  }

  return (
    <CardView
      selectedDate={selectedDate}
      onAdminClick={() => setView("admin")}
      onDateChange={setSelectedDate}
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster />
    </QueryClientProvider>
  );
}
