const sendgrid = require('@sendgrid/mail');

if(!process.env.SENDGRID_API_KEY)
{
	throw new Error('SENDGRID_API_KEY improperly configured');
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({to, subject, html, text})
{
	if(!to || !subject)
	{
		throw new Error('Recipient and subject required');
	}

	await sendgrid.send({
		to,
		from: process.env.MAIL_FROM,
		subject,
		html,
		text
	});

	return {sent: true};
}

module.exports = {sendEmail};
