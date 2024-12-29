use std::{error::Error, fs};

use reqwest::Client;
use serde_json::Value;
use tauri::{path::BaseDirectory, AppHandle, Manager};

use super::{auth, UserInfo};

pub async fn get_all_users(app_handle: &AppHandle) -> Result<Vec<UserInfo>, Box<dyn Error>> {
    let token_path = app_handle
        .path()
        .resolve("tokens", BaseDirectory::Resource)?;

    let mut tokens = Vec::new();
    for entry in token_path.read_dir()? {
        let path = entry?.path();
        if !path.is_file() {
            continue;
        }

        let stem = path.file_stem().unwrap_or_default();
        if let Some(name) = stem.to_str() {
            let id = name.to_string();
            let token = auth::get_access_token(app_handle, &id).await?;
            let info = get_user(&token, &id).await?;

            tokens.push(info);
        }
    }

    Ok(tokens)
}

pub async fn get_user(access_token: &String, id: &String) -> Result<UserInfo, Box<dyn Error>> {
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

pub async fn remove_user(app_handle: &AppHandle, id: &String) -> Result<(), Box<dyn Error>> {
    let token_path = app_handle
        .path()
        .resolve(format!("tokens/{id}.json"), BaseDirectory::Resource)?;

    if token_path.exists() {
        fs::remove_file(token_path.as_path())?;
    }

    Ok(())
}
