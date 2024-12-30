import {
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { EmailCode } from "./fetcher";

const notificationStack: string[] = [];
let handle: number = 0;

const workNotifications = () => {
  // If there already is a handler, don't create another one.
  if (handle) {
    return;
  }

  handle = setInterval(async () => {
    // Stop if there are no more notifications on the stack
    if (notificationStack.length === 0) {
      clearInterval(handle);
      handle = 0;
      return;
    }

    // Check if there is still another notification
    const windows = await getAllWebviewWindows();
    const notification = windows.filter((w) => w.label === "notification");
    if (notification.length > 0) {
      return;
    }

    // Show the next notification
    new WebviewWindow("notification", {
      width: 300,
      height: 100,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      decorations: false,
      dragDropEnabled: false,
      shadow: false,
      y: 8,
      x: 8,
      url: `notification/${notificationStack.pop()}`,
    });

    console.log(`Created from stack. (${notificationStack.length} left)`);
  }, 1000);
};

const createNotification = (query: string) => {
  notificationStack.push(query);
  workNotifications();
};

export const createCodeNotification = (code: EmailCode) => {
  const matches = code.address.match(/<[^]+>/g) || [];
  const sender = matches[0];
  const email = sender?.slice(1, sender.length - 1);

  createNotification(`?code=${code.value}&sender=${email || code.address}`);
};

export const createMessageNotification = (message: string) => {
  createNotification(`?message=${message}`);
};
