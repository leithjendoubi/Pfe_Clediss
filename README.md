# firma
#1
I have used mangodDB localy (Mangodb is Configuered localy)

#2

I have used Cloudinary API to save Documents and Images in Cloudinary
Take a notice that it's not  reccomended to upload different fiels with different extension
Don't upload the same file for different fields

#3
 i have used Nodemail API to send emails

#4

for now all the buttons are accessible for all users of different Statuts 
(it may occurs errors if the right Statut is not available )

#5
for your Backend server , we removed some Middelwares to authorize testing

#6
let your Backend server on Port 4000

#7 .env :

MONGODB_URI=mongodb://localhost:27017/elfirma
PORT=4000
JWT_SECRET='secret#text'
NODE_ENV='development'


# ==== CLOUDINARY ====
CLOUDINARY_NAME=dad5aaqpd
CLOUDINARY_API_KEY=678642529124651
CLOUDINARY_SECRET_KEY=uvy05VeA4lzl_M59zzI8rr0EI78
CLOUDINARY_URL=cloudinary://678642529124651:uvy05VeA4lzl_M59zzI8rr0EI78@dad5aaqpd

SMTP_USER=8b54c7001@smtp-brevo.com
SMTP_PASS=yDnmcFZBChtgaG3H

SENDER_EMAIL=leithjendoubi@gmail.com 


ADMIN_EMAIL=
ADMIN_PASSWORD=

#8 
we are still in testing phases , Please now that sometimes a detail may get shown wrong because of wrong Traduction of french phrases to arabic during developement stages