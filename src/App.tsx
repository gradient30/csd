import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TempleLayout from "./components/TempleLayout";
import CeremonyPage from "./pages/CeremonyPage";
import WorshipPage from "./pages/WorshipPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SanctuaryPage from "./pages/SanctuaryPage";
import CollectionPage from "./pages/CollectionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/temple" element={<TempleLayout />}>
            <Route index element={<Navigate to="/temple/ceremony" replace />} />
            <Route path="ceremony" element={<CeremonyPage />} />
            <Route path="worship" element={<WorshipPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="sanctuary" element={<SanctuaryPage />} />
            <Route path="collection" element={<CollectionPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
