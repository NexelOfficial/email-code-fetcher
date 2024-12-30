use std::collections::HashMap;

use gmail::UserInfo;
use regex::Regex;
use rustls::crypto::ring;
use serde::Serialize;
use serde_json::Value;
use tauri::{
    async_runtime::Mutex,
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Manager,
};
use tauri_plugin_cli::CliExt;

mod accounts;
mod gmail;

type LastEmails = HashMap<String, String>;

#[derive(Serialize, Default)]
pub struct EmailCode {
    value: String,
    address: String,
}

#[tauri::command]
async fn remove_user(app: AppHandle, id: String) {
    accounts::info::remove_user(&app, &id).unwrap();
}

#[tauri::command]
async fn get_user(app: AppHandle, id: String) -> UserInfo {
    let token = gmail::auth::get_access_token(&app, &id).await.unwrap();
    let user = accounts::info::get_user_from_token(&token, &id)
        .await
        .unwrap_or_default();

    accounts::info::store_user(&app, &user).unwrap_or_default();
    return user;
}

#[tauri::command]
fn get_users(app: AppHandle) -> Value {
    accounts::info::get_all_users(&app).unwrap_or_default()
}

#[tauri::command]
async fn get_last_email(app: AppHandle, id: String) -> EmailCode {
    let message = gmail::message::get_last_message(&app, &id)
        .await
        .unwrap_or_default();

    let mut result = EmailCode::default();

    // Extract code from message
    let snippet = message["snippet"].as_str().unwrap_or_default();
    let re = Regex::new(r"\b[0-9A-Z]{5,8}\b").unwrap();
    if let Some(mat) = re.find(snippet) {
        let mat_str = mat.as_str();
        let has_number = mat_str.chars().any(|c| c.is_numeric());

        if has_number {
            result.value = mat_str.to_string();
        }
    }

    // Extract sender
    let headers = message["payload"]["headers"].clone();
    if headers.is_array() {
        for header in headers.as_array().unwrap() {
            if !header["name"].eq("From") {
                continue;
            }

            let from_value = header["value"].clone();
            result.address = from_value.as_str().unwrap().to_string();
        }
    }

    result
}

#[tauri::command]
async fn close_notification(app: AppHandle) {
    let webview = app.get_webview_window("notification");
    if webview.is_some() {
        webview
            .unwrap()
            .destroy()
            .expect("Could not close notification window.");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    ring::default_provider()
        .install_default()
        .expect("Failed to install rustls crypto provider.");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--tray"]),
        ))
        .plugin(tauri_plugin_cli::init())
        .setup(|app| {
            // Create a state to store the last email
            app.manage(Mutex::new(LastEmails::default()));

            // Hide app if started from tray
            let matches = app.cli().matches()?;
            let hide_arg = matches.args.get("tray").unwrap();
            let should_hide = hide_arg.value.as_bool().unwrap_or(false);

            if should_hide {
                app.get_webview_window("main").unwrap().hide()?;
            }

            // Create tray
            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let show_item = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            TrayIconBuilder::new()
                .menu(&menu)
                .icon(app.default_window_icon().unwrap().clone())
                .on_menu_event(move |tray_app, event| match event.id().as_ref() {
                    "quit" => {
                        tray_app.exit(0);
                    }
                    "show" => {
                        tray_app.get_webview_window("main").unwrap().show().unwrap();
                    }
                    _ => return,
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                window.hide().unwrap();
            }
        })
        .invoke_handler(tauri::generate_handler![
            get_last_email,
            close_notification,
            get_user,
            get_users,
            remove_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
