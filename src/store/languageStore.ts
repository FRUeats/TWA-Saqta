import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../utils/i18n';

interface LanguageState {
    language: Language;
    isOnboarded: boolean;
    setLanguage: (lang: Language) => void;
    completeOnboarding: () => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'en',
            isOnboarded: false,
            setLanguage: (language) => set({ language }),
            completeOnboarding: () => set({ isOnboarded: true }),
        }),
        {
            name: 'saqta-language',
        }
    )
);
