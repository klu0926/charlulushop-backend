var nodemailer = require('nodemailer');
const fs = require('fs').promises
const path = require('path')

// buyer: name, email, ig
// order: (same as order record)

async function sendEmail(order) {

  console.log('order-----', order)
  try {
    if (!order) throw new Error('sendEmail missing order record')

    const serverMail = process.env.SERVER_GMAIL
    const serverMailAppPassword = process.env.SERVER_GMAIL_APP_PASSWORD
    const sellerMail = process.env.SELLER_GMAIL
    const developerMail = process.env.DEVELOPER_GMAIL

    if (!serverMail) throw new Error('serverMail does not exist')
    if (!serverMailAppPassword) throw new Error('serverMailAppPassword does not exist')
    if (!sellerMail) throw new Error('sellerMail does not exist')
    if (!developerMail) throw new Error('developerMail does not exist')

    // email content
    const toBuyerSubject = '夏洛特的「斷。捨。離」感謝您的訂單！'
    const toSellerSubject = `${order.buyerName} 在「斷。捨。離」下單了，總共${order.price}元～！`
    const toDeveloperSubject = toSellerSubject


    // HTML template
    const htmlFilePath = path.join(__dirname, 'toBuyer.html')
    let toBuyerHtmlString = await fs.readFile(htmlFilePath, 'utf8')
    let toSellerHtmlString = null
    let toDeveloperHtmlString = null


    // Buyer HTML content edit
    if (!toBuyerHtmlString) throw new Error('Buyer html fail to read file')
    toBuyerHtmlString = toBuyerHtmlString.replace('{{orderId}}', order.id)
    toBuyerHtmlString = toBuyerHtmlString.replace('{{itemsCount}}', order.items.length)
    toBuyerHtmlString = toBuyerHtmlString.replace('{{price}}', order.price)
    records = order.items.map(item => {
      return `<li><strong>${item.name}</string> <span>${item.price}</span></li>`
    })
    toBuyerHtmlString = toBuyerHtmlString.replace('{{itemsRecord}}', records)
    toBuyerHtmlString = toBuyerHtmlString.replace('{{buyerName}}', order.buyerName)
    toBuyerHtmlString = toBuyerHtmlString.replace('{{buyerEmail}}', order.buyerEmail)
    toBuyerHtmlString = toBuyerHtmlString.replace('{{buyerIG}}', order.buyerIG)

    // transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SERVER_GMAIL,
        pass: process.env.SERVER_GMAIL_APP_PASSWORD
      }
    });

    // mail options
    const toBuyer = {
      from: serverMail,
      to: order.buyerEmail,
      subject: toBuyerSubject,
      html: toBuyerHtmlString
    };

    const toDeveloper = {
      from: serverMail,
      to: developerMail,
      subject: toDeveloperSubject,
      html: toDeveloperHtmlString
    }

    const toSeller = {
      from: serverMail,
      to: sellerMail,
      subject: toSellerSubject,
      html: toSellerHtmlString
    }

    // send mail
    const info = await transporter.sendMail(toBuyer);
    //const developerInfo = await transporter.sendMail(toDeveloper);
    // const sellerInfo = await transporter.sendMail(toSeller);
    console.log('Email response:', info.response)
    console.log('Email info:', info.response)
    console.log('Email done!')
  } catch (err) {
    console.error('Error sending email:', err);
  }
}


module.exports = sendEmail

