use serde::Serialize;

pub mod auth;
pub mod info;
pub mod message;

#[derive(Serialize, Default)]
pub struct UserInfo {
    id: String,
    email: String,
}
