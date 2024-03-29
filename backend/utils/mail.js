const mjml2html = require("mjml");
const nodemailer = require('nodemailer')
const fs = require('fs');
const path = require('path')

const sendMail = async (recipient, subject, vars, template_name) => {
 console.log(recipient);
  

    const transporter = nodemailer.createTransport({
        service: "Outlook", // You can also use 'hotmail', 'live', or 'office365'
        auth: {
          user: "rentechke@outlook.com", // Your email address
          pass: "Sofiavergara41", // Your email password
        },
    
        tls: {
          rejectUnauthorized: false,
        },
      });

      const emailPath = path.join(__dirname,'..','email_templates',template_name)
    
      const template = fs.readFileSync(emailPath, "utf8");
      const filledTemplate = fillTemplate(template, vars);
      const { html } = mjml2html(filledTemplate);
      
      const mailOptions = {
        from: "rentechke@outlook.com",
        to: recipient,
        subject: subject,
        html:html,
      };

      try {
      const info =  await transporter.sendMail(mailOptions)
      console.log(info);
      return info.response
      } catch (error) {

        console.log(error);


        throw error
      }


  
};

function fillTemplate(template, vars) {
  
  let filledTemplate = template;
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = `%{${key}}%`;
    filledTemplate = filledTemplate.replace(
      new RegExp(placeholder, "g"),
      value
    );
  }

  return filledTemplate;
}


module.exports = {sendMail}