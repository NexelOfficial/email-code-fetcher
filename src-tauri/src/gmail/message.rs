use reqwest::Client;
use serde_json::Value;
use tauri::{async_runtime::Mutex, AppHandle, Manager};

use crate::LastEmails;

use super::auth::get_access_token;

type Error = Box<dyn std::error::Error>;

async fn list_last_message(access_token: &String) -> Result<String, Error> {
    let reqwest_client = Client::new();
    let list_url = "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=1";
    let list_response = reqwest_client
        .get(list_url)
        .bearer_auth(access_token)
        .send()
        .await?;

    let list_text = list_response.text().await?;
    let list_json: Value = serde_json::from_str(&list_text)?;
    let message_id = list_json["messages"][0]["id"].as_str().unwrap_or_default();

    Ok(message_id.to_string())
}

pub async fn get_last_message(app: &AppHandle, id: &String) -> Result<Value, Error> {
    let access_token = get_access_token(app, id).await?;
    let mess_id = list_last_message(&access_token).await?;
    let last_email_mut = app.state::<Mutex<LastEmails>>();
    let mut last_emails = last_email_mut.lock().await;

    if mess_id.eq(last_emails.get(id).unwrap_or(&"".to_string())) {
        return Ok(Value::default());
    }

    last_emails.insert(id.clone(), mess_id.clone());
    let reqwest_client = Client::new();
    let get_url = format!("https://gmail.googleapis.com/gmail/v1/users/me/messages/{mess_id}",);
    let get_response = reqwest_client
        .get(get_url)
        .bearer_auth(&access_token)
        .send()
        .await?;

    if get_response.status().is_success() {
        let get_text = get_response.text().await?;
        let get_json: Value = serde_json::from_str(&get_text)?;
        return Ok(get_json);
    }

    Ok(Value::default())
}
