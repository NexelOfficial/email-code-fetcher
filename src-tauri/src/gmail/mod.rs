use serde::{Deserialize, Serialize};

pub mod auth;
pub mod message;

#[derive(Serialize, Deserialize, Default, Debug)]
pub struct UserInfo {
    pub(crate) id: String,
    pub(crate) email: String,
}
