require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// OAuth2 client setup
const oauth2Client = new OAuth2(
    process.env.GMAIL_API_CLIENT_ID,
    process.env.GMAIL_API_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_API_REFRESH_TOKEN,
});

let transport;

// Function to create the nodemailer transport
async function createTransport() {
    const accessToken = await oauth2Client.getAccessToken();
    transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "botreturd@gmail.com", // Your Gmail address
            clientId: process.env.GMAIL_API_CLIENT_ID,
            clientSecret: process.env.GMAIL_API_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_API_REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    });
}

// Function to send an email
async function sendMail(to, subject, text) {
    if (!transport) {
        await createTransport();
    }

    const mailOptions = {
        from: "botreturd@gmail.com", // Sender address
        to, // Recipient address
        subject, // Email subject
        text, // Email body
    };

    try {
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error sending mail:", error);
        throw error;
    }
}

// Example: Send a file upload confirmation email
async function sendUploadConfirmationEmail(to, fileName, uploadDate, downloadLink) {
    const subject = "Your File Has Been Successfully Uploaded!";
    const text = `Dear User,

We are pleased to inform you that your file has been successfully uploaded to our secure platform. Here are the details:

- **File Name**: ${fileName}
- **Upload Date**: ${uploadDate}
- **Download Link**: ${downloadLink}

You can access your file at any time using the link above. Please ensure you keep this link secure, as it provides direct access to your file.

If you have any questions or need further assistance, feel free to reach out to our support team at support@yourdomain.com.

Thank you for using our service!

Best regards,
The SecureFile Team
`;

    try {
        const result = await sendMail(to, subject, text);
        console.log("Upload confirmation email sent:", result);
    } catch (error) {
        console.error("Failed to send upload confirmation email:", error);
    }
}

// Example: Send a file unlock notification email
async function sendUnlockNotificationEmail(to, fileName, unlockDate, downloadLink) {
    const subject = "Your File Is Now Unlocked and Ready for Download!";
    const text = `Dear User,

We are pleased to inform you that your time-locked file is now unlocked and ready for download. Here are the details:

- **File Name**: ${fileName}
- **Unlock Date**: ${unlockDate}
- **Download Link**: ${downloadLink}

You can now access your file using the link above. Please ensure you keep this link secure, as it provides direct access to your file.

If you have any questions or need further assistance, feel free to reach out to our support team at support@yourdomain.com.

Thank you for using our service!

Best regards,
The SecureFile Team
`;

    try {
        const result = await sendMail(to, subject, text);
        console.log("Unlock notification email sent:", result);
    } catch (error) {
        console.error("Failed to send unlock notification email:", error);
    }
}

// Example usage
(async () => {
    const to = "user-email@example.com"; // Replace with the recipient's email
    const fileName = "example_file.zip";
    const uploadDate = new Date().toLocaleDateString();
    const downloadLink = "https://yourdomain.com/download/example_file.zip";

    // Send upload confirmation email
    await sendUploadConfirmationEmail(to, fileName, uploadDate, downloadLink);

    // Send unlock notification email (example)
    const unlockDate = new Date().toLocaleDateString();
    await sendUnlockNotificationEmail(to, fileName, unlockDate, downloadLink);
})();