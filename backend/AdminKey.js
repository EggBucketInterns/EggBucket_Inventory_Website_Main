require('dotenv').config();
module.exports = {
    type: 'service_account',
    project_id: 'eb-workplace',
    private_key_id: '28ffcabf1bb8d562502521164276b1bb7109faae',
    private_key: `${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')}`,
    client_email: 'firebase-adminsdk-933vp@eb-workplace.iam.gserviceaccount.com',
    client_id: '111367954006498227530',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-933vp%40eb-workplace.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
  };