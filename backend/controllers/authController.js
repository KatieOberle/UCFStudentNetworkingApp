const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const token = require("../createJWT.js");
const {sendEmail} = require('../utils/mailer');

let db;

// base URL in links sent by email
function getAppUrl()
{
	return (process.env.APP_URL || 
		'http://localhost:5173').replace(/\/+$/, '');
}

exports.setDatabase = function (client)
{
	if (!process.env.DB_NAME) {
   		throw new Error('DB_NAME is not set in the environment');
	}

	db = client.db(process.env.DB_NAME);
};

exports.login = async function (req,res)
{
	// incoming: login, password
	// outgoing: id, firstName, lastName, error
	
	// Placeholder error variable
	var error = '';

	// Request body follows this key/value format
	const {email, password} = req.body;

	if(!email || !password)
	{
		return res.status(400).json({error: 'Email and password are required'});
	}

	const lowerEmail = email.toLowerCase();

	const user = await db.collection('Users').findOne({Email: lowerEmail});

	const passwordMatches = user ? await bcrypt.compare(password, user.Password) : false;
	
	// Placeholder user values
	var id = -1;
	var fn = '';
	var ln = '';
	var verified = false;

	var ret;

	// If the array has content...
	if(user && passwordMatches)
	{
		// Fill the placeholder user variables
		id = user.UserID;
		fn = user.FirstName;
		ln = user.LastName;
		verified = user.EmailVerified;

		if(verified)
		{
			// Create a JWT with the user credentials
			try
			{
				ret = token.createToken(fn, ln, id);
				// DEBUG: Return data as plaintext
				//ret = {firstName:fn, lastName:ln, userId:id};
			}
			// Catch errors
			catch(e)
			{
				ret = {error:e.message};
			}
		}
		else
		{
			ret = {error:"Email has not been verified"};
		}
	}
	else
	{
		ret = {error:"Login/Password incorrect"};
	}

	// Set the status to the return value
	res.status(200).json(ret);
};

// Katie: implement logout endpoint
exports.logout = async function (req, res)
{
    // remove the JWT on frontend to logout
    return res.status(200).json({
        message: "Logout successful" // confirmation that token removed and logout complete
    });
};


exports.register = async function (req, res, next)
{
	const {password, email, firstName, lastName} = req.body;

	if(!email || !password)
	{
		return res.status(400).json({error: 'Email and password are required'});
	}

	const lowerEmail = email.toLowerCase();

	try
	{
		const server = lowerEmail.split('@').pop();

		if(server !== "ucf.edu")
		{
			return res.status(400).json({error: 'Email must be a UCF email'});
		}

		const users = db.collection('Users');
		const existingUser = await users.findOne({Email: lowerEmail});

		if(existingUser && existingUser.EmailVerified)
		{
			return res.status(409).json({error: 'Email already registered'});
		}

		// Generate a new verification token
		const verifyToken = crypto.randomBytes(32).toString('hex');
		const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

		let userId;

		if(existingUser)
		{
			// Update existing unverified account
			userId = existingUser.UserID;

			await users.updateOne(
				{_id: existingUser._id},
				{
					$set: {
						VerifyToken: verifyToken,
						VerifyExpires: verifyExpires
					}
				}
			);
		}
		else
		{
			// Create new account
			const hashedPassword = await bcrypt.hash(password, 10);

			const lastUser = await users.find({}).sort({UserID: -1}).limit(1).next();
			userId = lastUser ? lastUser.UserID + 1 : 1;

			const newUser = {
				UserID: userId,
				Password: hashedPassword,
				Email: lowerEmail,
				FirstName: firstName,
				LastName: lastName,
				EmailVerified: false,
				VerifyToken: verifyToken,
				VerifyExpires: verifyExpires
			};

			await users.insertOne(newUser);
		}

		const verificationLink = `${getAppUrl()}/verify-email?token=${verifyToken}`;

		try
		{
			await sendEmail({
				to: lowerEmail,
				subject: 'Please verify your email',
				text: 'Boo! Gurl click this link to verify your ' +
					'KnightLink account (valid 24 hours):\n\n' + verificationLink,
				html: '<p>Boo! Gurl click this link to verify your ' +
					'KnightLink account (valid 24 hours):</p>' +
					`<p><a href="${verificationLink}">${verificationLink}</a></p>`
			});
		}
		catch(mailError)
		{
			console.error('Verification email failed: ', mailError);

			return res.status(500).json({
				error: 'Could not send verification email'
			});
		}

		return res.status(201).json({
			error: '',
			message: 'Yay registration successful! Check your email for verification :)'
		});
	}
	catch(e)
	{
		console.error('Registration error: ', e);

		return res.status(500).json({
			error: 'Server error during registration'
		});
	}
};


// AI assisted code
exports.verifyEmail = async function (req, res)
{
	// Verify email api endpoint
	try
	{
		const {token: verifyToken} = req.query;

		if(!verifyToken)
		{
			return res.status(400).json({error: 'Verification token required'});
		}

		const users = db.collection('Users');

		const user = await users.findOne({VerifyToken: verifyToken});

		if(!user)
		{
			return res.status(400).json({error: 'Invalid or already used verification link'});
		}

		if(!user.VerifyExpires || user.VerifyExpires < new Date())
		{
			return res.status(400).json({error: 'Verification link has expired'});
		}

		await users.updateOne(
			{_id: user._id},
			{
				$set: {EmailVerified: true},
				$unset: {
					VerifyToken: '',
					VerifyExpires: ''
				}
			}
		);

		return res.status(200).json({
			message: 'Email verified successfully. You can now log in.'
		});
	}
	catch(error)
	{
		console.error('Email verification failed:', error);

		return res.status(500).json({
			error: 'Server error during email verification'
		});
	}
};

// AI assisted code
exports.me = async function (req, res) 
{
	const authHeader = req.headers.authorization;

	if(!authHeader || !authHeader.startsWith('Bearer '))
	{
		return res.status(401).json({error:'Token required'});
	}

	try
	{
		const decoded = jwt.verify(authHeader.split(' ')[1], process.env.ACCESS_TOKEN_SECRET);

		const user = await db.collection('Users').findOne({UserID:decoded.userId}, {projection: {Password: 0, VerifyToken: 0, ResetToken: 0}});

		if(!user)
		{
			return res.status(404).json({error:'User not found'});
		}

		res.json({
			user: {
				userId: user.UserID,
				firstName: user.FirstName,
				lastName: user.LastName,
				email: user.Email,
				emailVerified: user.EmailVerified,
				major: user.Major || '',
				graduationYear: user.GraduationYear || null,
				careerInterests: user.CareerInterests || [],
				companies: user.Companies || []
			}
		});
	}
	catch(error)
	{
		res.status(401).json({error:'Invalid or expired token'});
	}
};

exports.forgotPassword = async function (req, res)
{
	try
	{
		const {email} = req.body;

		if(!email)
		{
			return res.status(400).json({error: 'Email is required'});
		}

		const lowerEmail = email.toLowerCase();

		const users = db.collection('Users');

		const user = await users.findOne({Email: lowerEmail});

		const message = 'If the user exists, a password reset link has been sent to their email.';

		if(!user)
		{
			return res.status(200).json({message});
		}

		const resetToken = crypto.randomBytes(32).toString('hex');
		const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

		await users.updateOne(
			{_id: user._id},
			{
				$set: {
					ResetToken: resetToken,
					ResetExpires: resetExpires
				}
			}
		);

		const resetLink = `${getAppUrl()}/reset-password?token=${resetToken}`;

		try
		{
			await sendEmail({
				to: lowerEmail,
				subject: 'Reset your password',
				text: `We received a request to reset your password. Open this link (valid for 1 hour):\n\n${resetLink}\n\nIf you did not request this, you can ignore this email.`,
				html: `<p>We received a request to reset your password. Click the link below (valid for 1 hour):</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request this, you can ignore this email.</p>`
			});
		}
		catch(mailError)
		{
			console.error('Password reset email failed:', mailError);

			return res.status(500).json({
				error: 'Could not send password reset email. Please try again later.'
			});
		}

		return res.status(200).json({message});
	}
	catch(error)
	{
		console.error('Forgot password error:', error);

		return res.status(500).json({
			error: 'Server error during password reset request'
		});
	}
};

exports.resetPassword = async function (req, res)
{
	try
	{
		const {token: resetToken, newPassword} = req.body;

		if(!resetToken || !newPassword)
		{
			return res.status(400).json({error: 'Reset token and new password required'});
		}

		if(newPassword.length < 8)
		{
			return res.status(400).json({error: 'Password must be at least 8 characters long'});
		}

		const users = db.collection('Users');

		const user = await users.findOne({
			ResetToken: resetToken,
			ResetExpires: {$gt: new Date()}
		});

		if(!user)
		{
			return res.status(400).json({error: 'Invalid or expired reset link'});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await users.updateOne(
			{_id: user._id},
			{
				$set: {Password: hashedPassword},
				$unset: {
					ResetToken: '',
					ResetExpires: ''
				}
			}
		);

		return res.status(200).json({message: 'Successfully reset password. You can now log in'});
	}
	catch(error)
	{
		console.error('Password reset error:', error);

		return res.status(500).json({
			error: 'Server error while resetting password'
		});
	}
};
