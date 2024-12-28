use rustls::crypto::ring;
use tauri::{async_runtime::Mutex, AppHandle, Manager};

mod gmail;

#[derive(Default)]
pub struct LastEmail {
    id: String,
}

#[tauri::command]
async fn authenticate() {
    gmail::auth::get_access_token().await.unwrap();
}

#[tauri::command]
async fn get_last_email(app: AppHandle) -> String {
    gmail::message::get_last_message(&app)
        .await
        .unwrap_or("ERR_NO_MAIL".to_string())
}

#[tauri::command]
async fn close_notification(app: AppHandle) {
    let webview = app.get_webview_window("notification");
    if webview.is_some() {
        webview
            .unwrap()
            .close()
            .expect("Could not close notification window.");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    ring::default_provider()
        .install_default()
        .expect("Failed to instarll rustls crypto provider.");

    tauri::Builder::default()
        .setup(|app| {
            app.manage(Mutex::new(LastEmail::default()));
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            authenticate,
            get_last_email,
            close_notification
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
