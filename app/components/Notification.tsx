"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg ${styles[notification.type]}`}
          >
            {(() => {
              const Icon = icons[notification.type];
              return <Icon className={`w-5 h-5 ${iconColors[notification.type]}`} />;
            })()}
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className={`ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors ${iconColors[notification.type]}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
}