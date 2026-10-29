const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const token = require("../createJWT.js");

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
	const {login, password} = req.body;

	// Query the user collection for a matching login and password, and put it in an array
	//const results = await db.collection('Users').find({Login:login,Password:password}).toArray();

	const user = await db.collection('Users').findOne({Login: login});

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
	// incoming: login, password, email, firstName, lastName
	// outgoing: error
	
	// Placeholder error variable
	var error = '';

	// Request body follows this key/value format
	const {login, password, email, firstName, lastName} = req.body;

	// AI assisted code
	const hashedPassword = await bcrypt.hash(password, 10);

	// AI assisted code
	const verifyToken = crypto.randomBytes(32).toString('hex');
	const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

	// TODO: Add new UserId to this

	try
	{
		const dup = await db.collection('Users').find({Email:email}).toArray();

		if(dup.length > 0)
		{
			error = 'Email already registered';
		}
		else
		{
			const server = email.split('@').pop();

			if(server === "ucf.edu")
			{
				const lastUser = await db.collection('Users').find({}).sort({UserID: -1}).limit(1).next();
				const userId = lastUser ? lastUser.UserID + 1 : 1;

				const newUser = {
					UserID: userId,
					Login: login,
					Password: hashedPassword,
					Email: email,
					FirstName: firstName,
					LastName: lastName,
					EmailVerified: false,
					VerifyToken: verifyToken,
					VerifyExpires: verifyExpires
				};
				const result = await db.collection('Users').insertOne(newUser);

				// AI assisted code
				const verificationLink =`http://localhost:5000/api/auth/verify?token=${verifyToken}`;
				console.log('Verification link:', verificationLink);
			}
			else
			{
				error = 'Email must be a UCF email';
			}
		}
	}
	catch(e)
	{
		error = e.toString();
	}

	var ret = {error:error};
	res.status(200).json(ret);
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

		const users = db.collection('Users');

		const user = await users.findOne({Email: email});

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

		const resetLink =`http://localhost:5000/api/reset-password?token=${resetToken}`;
		console.log('Password reset link:', resetLink);

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
