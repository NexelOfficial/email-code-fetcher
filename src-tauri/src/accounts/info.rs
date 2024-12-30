use reqwest::Client;
use serde_json::{from_str, json, Value};
use std::{error::Error, fs, path::PathBuf};
use tauri::{path::BaseDirectory, AppHandle, Manager};

use crate::gmail::UserInfo;

fn get_token_path(app_handle: &AppHandle, file: String) -> PathBuf {
    let token_path = app_handle
        .path()
        .resolve("tokens", BaseDirectory::Resource)
        .unwrap_or_default();

    // Create directory if it doesn't exist
    if !token_path.exists() {
        fs::create_dir_all(token_path.clone()).expect("Could not create directory!");
    }

    // Create file if it doesn't exist
    let token_file = token_path.join(file);

    if !token_file.exists() {
        fs::File::create(token_file.clone()).expect("Could not create token_file!");
    }

    token_file
}

pub fn get_all_users(app_handle: &AppHandle) -> Result<Value, Box<dyn Error>> {
    // Read existing accounts
    let accounts_file = get_token_path(app_handle, "accounts.json".to_string());
    let content_str = fs::read_to_string(accounts_file).unwrap_or_default();

    Ok(from_str(&content_str).unwrap_or(json!({})))
}

pub fn store_user(app_handle: &AppHandle, info: &UserInfo) -> Result<(), std::io::Error> {
    // Read existing accounts
    let accounts_file = get_token_path(app_handle, "accounts.json".to_string());
    let content_str = fs::read_to_string(accounts_file.clone()).unwrap_or_default();
    let mut accounts_json = from_str(&content_str).unwrap_or(json!({}));

    // Add item to object
    accounts_json[info.id.clone()] = json!(info);
    fs::write(
        accounts_file,
        serde_json::to_string(&accounts_json).unwrap_or_default(),
    )
}

pub async fn get_user_from_token(
    access_token: &String,
    id: &String,
) -> Result<UserInfo, Box<dyn Error>> {
    let reqwest_client = Client::new();
    let info_url = "https://www.googleapis.com/oauth2/v3/userinfo";
    let info_response = reqwest_client
        .get(info_url)
        .bearer_auth(access_token)
        .send()
        .await?;

    let info_text = info_response.text().await?;
    let info_json: Value = serde_json::from_str(&info_text)?;
    let email = info_json["email"].as_str().unwrap_or_default();

    Ok(UserInfo {
        id: id.clone(),
        email: email.to_string(),
    })
}

pub fn remove_user(app_handle: &AppHandle, id: &String) -> Result<(), Box<dyn Error>> {
    // Remove actual file
    let user_path = get_token_path(app_handle, format!("{}.json", id.clone()));
    if fs::exists(&user_path)? {
        fs::remove_file(user_path)?;
    }

    // Remove item from array
    let accounts_file = get_token_path(app_handle, "accounts.json".to_string());
    let content_str = fs::read_to_string(accounts_file.clone()).unwrap_or_default();
    let mut accounts_json = from_str(&content_str).unwrap_or(json!({}));
    let accounts_obj = accounts_json.as_object_mut().unwrap();

    accounts_obj.remove(id);
    fs::write(
        accounts_file,
        serde_json::to_string(&accounts_obj).unwrap_or_default(),
    )?;
    Ok(())
}
