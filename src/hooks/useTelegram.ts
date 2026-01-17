/**
 * useTelegram Hook
 * 
 * Provides a clean interface to Telegram WebApp SDK functionality
 * Handles initialization, theme, user data, and native UI components
 */

import { useEffect, useState, useCallback } from 'react';

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: ThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: BackButton;
  MainButton: MainButton;
  HapticFeedback: HapticFeedback;

  // Methods
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  showPopup: (params: PopupParams, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: ScanQrParams, callback?: (data: string) => void) => void;
  closeScanQrPopup: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface ThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

interface BackButton {
  isVisible: boolean;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
}

interface MainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
  setParams: (params: MainButtonParams) => void;
}

interface MainButtonParams {
  text?: string;
  color?: string;
  text_color?: string;
  is_active?: boolean;
  is_visible?: boolean;
}

interface HapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

interface PopupParams {
  title?: string;
  message: string;
  buttons?: Array<{ id: string; type?: string; text: string }>;
}

interface ScanQrParams {
  text?: string;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  const tg = window.Telegram?.WebApp;

  // Initialize Telegram WebApp
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      setIsReady(true);
    } else {
      console.warn('Telegram WebApp SDK not available. Running in development mode?');
      setIsReady(true); // Allow development without Telegram
    }
  }, [tg]);

  // Mock data for development
  const isDev = import.meta.env.DEV;
  const mockUser = isDev ? {
    id: 123456789,
    first_name: "Dev",
    last_name: "User",
    username: "dev_user",
    language_code: "en"
  } : null;

  // User data
  const user = tg?.initDataUnsafe?.user || mockUser;
  const userId = user?.id?.toString() || null;
  const initData = tg?.initData || (isDev && mockUser ? "query_id=mock_query_id&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Dev%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22dev_user%22%7D&auth_date=1620000000&hash=mock_hash" : "");

  // Theme
  const colorScheme = tg?.colorScheme || 'light';
  const themeParams = tg?.themeParams || {};

  // Platform info
  const platform = tg?.platform || 'unknown';
  const version = tg?.version || '6.0';

  // ============================================
  // MAIN BUTTON CONTROLS
  // ============================================
  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (!tg) return;

    tg.MainButton.setText(text);
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
  }, [tg]);

  const hideMainButton = useCallback(() => {
    if (!tg) return;
    tg.MainButton.hide();
  }, [tg]);

  const setMainButtonLoading = useCallback((loading: boolean) => {
    if (!tg) return;

    if (loading) {
      tg.MainButton.showProgress();
    } else {
      tg.MainButton.hideProgress();
    }
  }, [tg]);

  // ============================================
  // BACK BUTTON CONTROLS
  // ============================================
  const showBackButton = useCallback((onClick: () => void) => {
    if (!tg) return;

    tg.BackButton.onClick(onClick);
    tg.BackButton.show();
  }, [tg]);

  const hideBackButton = useCallback(() => {
    if (!tg) return;
    tg.BackButton.hide();
  }, [tg]);

  // ============================================
  // HAPTIC FEEDBACK
  // ============================================
  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
    if (!tg) return;

    if (type === 'success' || type === 'error' || type === 'warning') {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  }, [tg]);

  // ============================================
  // ALERTS & POPUPS
  // ============================================
  const showAlert = useCallback((message: string, callback?: () => void) => {
    if (!tg) {
      alert(message);
      callback?.();
      return;
    }

    tg.showAlert(message, callback);
  }, [tg]);

  const showConfirm = useCallback((message: string, callback?: (confirmed: boolean) => void) => {
    if (!tg) {
      const confirmed = confirm(message);
      callback?.(confirmed);
      return;
    }

    tg.showConfirm(message, callback);
  }, [tg]);

  // ============================================
  // QR CODE SCANNER (for merchants)
  // ============================================
  const scanQrCode = useCallback((callback: (data: string) => void) => {
    if (!tg) {
      console.warn('QR Scanner not available outside Telegram');
      return;
    }

    tg.showScanQrPopup(
      { text: 'Scan customer QR code to validate order' },
      callback
    );
  }, [tg]);

  const closeScanQrPopup = useCallback(() => {
    if (!tg) return;
    tg.closeScanQrPopup();
  }, [tg]);

  // ============================================
  // APP CONTROLS
  // ============================================
  const close = useCallback(() => {
    if (!tg) {
      window.close();
      return;
    }
    tg.close();
  }, [tg]);

  const enableClosingConfirmation = useCallback(() => {
    if (!tg) return;
    tg.enableClosingConfirmation();
  }, [tg]);

  const disableClosingConfirmation = useCallback(() => {
    if (!tg) return;
    tg.disableClosingConfirmation();
  }, [tg]);

  // ============================================
  // RETURN INTERFACE
  // ============================================
  return {
    // State
    isReady,
    tg,

    // User Data
    user,
    userId,
    initData,

    // Theme
    colorScheme,
    themeParams,

    // Platform
    platform,
    version,

    // Main Button
    showMainButton,
    hideMainButton,
    setMainButtonLoading,

    // Back Button
    showBackButton,
    hideBackButton,

    // Feedback
    hapticFeedback,

    // Alerts
    showAlert,
    showConfirm,

    // QR Scanner
    scanQrCode,
    showScanQrPopup: scanQrCode, // Alias for convenience
    closeScanQrPopup,

    // App Controls
    close,
    enableClosingConfirmation,
    disableClosingConfirmation,
  };
};

export default useTelegram;
