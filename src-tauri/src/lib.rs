use rustls::crypto::ring;
use tauri::{
    async_runtime::Mutex,
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Manager,
};
use tauri_plugin_cli::CliExt;

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
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--tray"]),
        ))
        .plugin(tauri_plugin_cli::init())
        .setup(|app| {
            // Create a state to store the last email
            app.manage(Mutex::new(LastEmail::default()));

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
            authenticate,
            get_last_email,
            close_notification
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
