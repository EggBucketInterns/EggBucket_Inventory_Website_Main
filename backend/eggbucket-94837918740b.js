require('dotenv').config();
module.exports = {
  "type": "service_account",
  "project_id": "eggbucket",
  "private_key_id": "9aa7dd7f69e4e6619e9563709088cc23f0caf874",
  "private_key": `${process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')}`,
  "client_email": `${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`,
  "client_id": "110563795091843237480",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/eggbucket%40eggbucket.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}