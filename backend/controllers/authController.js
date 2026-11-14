// AI disclosure: Claude Sonnet 5.5 Medium used for AJAX debug
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const token = require("../createJWT.js");
const {sendEmail} = require('../utils/mailer');

const appUrl = () => (process.env.APP_URL || 'http://localhost:5173').replace(/\/+$/, '');

let db;

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
	// incoming: password, email, firstName, lastName
	// outgoing: message or error
	const {password, email, firstName, lastName} = req.body;

	if(!email || !password)
	{
		return res.status(400).json({error: 'Email and password are required'});
	}

	const lowerEmail = email.toLowerCase();

	if(lowerEmail.split('@').pop() !== 'ucf.edu')
	{
		return res.status(400).json({error: 'Email must be a UCF email'});
	}

	try
	{
		const existing = await db.collection('Users').findOne({Email: lowerEmail});

		if(existing)
		{
			return res.status(409).json({error: 'Email already registered'});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verifyToken = crypto.randomBytes(32).toString('hex');
		const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

		const lastUser = await db.collection('Users').find({}).sort({UserID: -1}).limit(1).next();
		const userId = lastUser ? lastUser.UserID + 1 : 1;

		await db.collection('Users').insertOne({
			UserID: userId,
			Password: hashedPassword,
			Email: lowerEmail,
			FirstName: firstName,
			LastName: lastName,
			EmailVerified: false,
			VerifyToken: verifyToken,
			VerifyExpires: verifyExpires
		});

		const verificationLink = `${appUrl()}/verify-email?token=${verifyToken}`;

		try
		{
			await sendEmail({
				to: lowerEmail,
				subject: 'Verify your KnightLink email',
				text: `Welcome to KnightLink! Verify your email: ${verificationLink}\nThis link expires in 24 hours.`,
				html: `<p>Welcome to KnightLink!</p><p><a href="${verificationLink}">Verify your email</a></p><p>This link expires in 24 hours.</p>`
			});
		}
		catch(mailError)
		{
			console.error('Verification email failed:', mailError);
			return res.status(500).json({error: 'Account created, but the verification email could not be sent. Please try again later.'});
		}

		return res.status(201).json({message: 'Registration successful. Check your email to verify your account.'});
	}
	catch(e)
	{
		console.error('Register error:', e);
		return res.status(500).json({error: 'Server error during registration'});
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

		const resetLink = `${appUrl()}/reset-password?token=${resetToken}`;

		try
		{
			await sendEmail({
				to: user.Email,
				subject: 'Reset your KnightLink password',
				text: `Reset your password: ${resetLink}\nThis link expires in 1 hour.`,
				html: `<p><a href="${resetLink}">Reset your password</a></p><p>This link expires in 1 hour.</p>`
			});
		}
		catch(mailError)
		{
			// Logged only; same generic response so account existence isn't leaked
			console.error('Reset email failed:', mailError);
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