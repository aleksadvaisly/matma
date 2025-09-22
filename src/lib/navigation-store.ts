import { create } from 'zustand';

interface NavigationState {
  shouldRefresh: boolean;
  refreshNavigation: () => void;
  setRefreshed: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  shouldRefresh: false,
  refreshNavigation: () => set({ shouldRefresh: true }),
  setRefreshed: () => set({ shouldRefresh: false }),
}));