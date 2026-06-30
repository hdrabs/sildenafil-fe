import { create } from "zustand";

interface ConfiguratorStoreState {
  // The drug currently active in the on-page product configurator, published so the
  // marketing navbar's banner + theme can follow the in-page drug selector (a separate
  // component in the layout). null → the navbar falls back to the URL slug.
  activeDrug: string | null;
  setActiveDrug: (drug: string | null) => void;
}

export const useConfiguratorStore = create<ConfiguratorStoreState>((set) => ({
  activeDrug: null,
  setActiveDrug: (activeDrug) => set({ activeDrug }),
}));
