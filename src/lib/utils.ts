import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
}
