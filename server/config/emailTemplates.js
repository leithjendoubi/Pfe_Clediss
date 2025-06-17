export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0; background: #b4d4ff;">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Account</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: linear-gradient(to bottom right, #b4d4ff, #86b6f6);">
    <div style="max-width: 600px; margin: 40px auto; background-color: #0f172a; border-radius: 12px; padding: 30px; color: #ffffff; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
      <div style="margin-bottom: 20px;">
        <img src="cid:logo" alt="فيرمة" width="60" height="60" style="border-radius: 50%;" />
        <h2 style="font-weight: 600; margin: 10px 0; color: white;">فيرمة</h2>
      </div>

      <h1 style="font-size: 24px; margin-bottom: 10px;">Verify Your Account</h1>
      <p style="font-size: 16px; color: #cbd5e1;">Hello <strong>{{email}}</strong>,</p>
      <p style="font-size: 15px; color: #cbd5e1;">Use the OTP below to verify your account:</p>

      <div style="margin: 25px auto; display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #5a4fcf, #6e52ff); color: #fff; font-size: 22px; font-weight: bold; border-radius: 8px; letter-spacing: 4px;">
        {{otp}}
      </div>

      <p style="font-size: 14px; margin-top: 20px; color: #cbd5e1;">
        This OTP is valid for 24 hours. If you did not sign up for an account, please ignore this message.
      </p>
    </div>

    <div style="text-align: center; font-size: 12px; margin-top: 20px; color: #64748b;">
      &copy; ${new Date().getFullYear()} Firma. All rights reserved.
    </div>
  </body>
</html>
`;


export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0; background: #b4d4ff;">
  <head>
    <meta charset="UTF-8" />
    <title>Reset Password OTP</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: linear-gradient(to bottom right, #b4d4ff, #86b6f6);">
    <div style="max-width: 600px; margin: 40px auto; background-color: #0f172a; border-radius: 12px; padding: 30px; color: #ffffff; text-align: center; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
      <div style="margin-bottom: 20px;">
        <img src="cid:logo" alt="فيرمة" width="60" height="60" style="border-radius: 50%;" />
        <h2 style="font-weight: 600; margin: 10px 0; color: white;">فيرمة</h2>
      </div>

      <h1 style="font-size: 24px; margin-bottom: 10px;">Reset Password</h1>
      <p style="font-size: 16px; color: #cbd5e1;">Hello <strong>{{email}}</strong>,</p>
      <p style="font-size: 15px; color: #cbd5e1;">Use the OTP below to reset your password:</p>

      <div style="margin: 25px auto; display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #5a4fcf, #6e52ff); color: #fff; font-size: 22px; font-weight: bold; border-radius: 8px; letter-spacing: 4px;">
        {{otp}}
      </div>

      <p style="font-size: 14px; margin-top: 20px; color: #cbd5e1;">
        This OTP is valid for 15 minutes. If you didn't request a reset, please ignore this message.
      </p>
    </div>

    <div style="text-align: center; font-size: 12px; margin-top: 20px; color: #64748b;">
      &copy; ${new Date().getFullYear()} Firma. All rights reserved.
    </div>
  </body>
</html>
`;


export const WELCOME_TEMPLATE = `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Firma</title>
    <style>
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; font-family: 'Segoe UI', sans-serif; background: linear-gradient(to bottom right, #b4d4ff, #86b6f6);">
    <div style="max-width:600px; margin:40px auto; background-color:#0f172a; border-radius:12px; padding:30px; color:#ffffff; text-align:center; animation: fadeIn 1s ease-in-out;">
      
      <div style="margin-bottom: 20px;">
        <img src="cid:logo" alt="فيرمة Logo" width="60" height="60" style="border-radius: 50%;" />
        <h2 style="font-weight: 600; margin: 10px 0; color: white;">فيرمة</h2>
      </div>

      <h1 style="font-size:24px; margin-bottom:10px;">Welcome to Firma, {{name}}!</h1>
      
      <p style="font-size:16px; color: #cbd5e1;">We're excited to have you onboard 🎉</p>

      <p style="font-size:15px; color:#cbd5e1; margin-top:20px;">
        Welcome to elyséedev website. Your account has been created with email id:
      </p>
      <p style="font-size:17px; font-weight:bold; color:#ffffff; margin-top:5px;">{{email}}</p>

      <div style="margin-top:30px;">
        <a href="https://www.firma.tn" target="_blank" style="display:inline-block; padding:12px 24px; background:linear-gradient(to right,#5a4fcf,#6e52ff); color:#fff; border-radius:8px; text-decoration:none; font-weight:bold;">
          Get Started
        </a>
      </div>
    </div>

    <div style="text-align:center; font-size:12px; margin-top:20px; color:#64748b;">
      &copy; ${new Date().getFullYear()} Firma. All rights reserved.
    </div>
  </body>
</html>
`;

