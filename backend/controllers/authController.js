// API Endpoint for all Authorization functionality including:
// 	login
// 	logout
// 	register
// 	verify email
// 	me
//
// Stretch endpoints:
// 	forgot password
// 	reset password
// 	resend verification
//
// TODO: Update all database references to match the group database and each
// 	endpoints respective collection
// 	Maybe make the database an environment variable?

require('express');
require('mongodb');

const token = require("../createJWT.js");

exports.setApp = function (app, client)
{
	app.post('/api/login', async (req, res, next) => 
	{
		// incoming: login, password
		// outgoing: id, firstName, lastName, error
		
		// Placeholder error variable
		var error = '';

		// Request body follows this key/value format
		const {login, password} = req.body;

		// The database to be queried
		const db = client.db('COP4331Cards');

		// Query the user collection for a matching login and password, and put it in an array
		const results = await db.collection('Users').find({Login:login,Password:password}).toArray();

		// Placeholder user values
		var id = -1;
		var fn = '';
		var ln = '';

		var ret;

		// If the array has content...
		if( results.length > 0 )
		{
			// Fill the placeholder user variables
			id = results[0].UserID;
			fn = results[0].FirstName;
			ln = results[0].LastName;

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
			ret = {error:"Login/Password incorrect"};
		}

		// Set the status to the return value
		res.status(200).json(ret);
	});

	app.post('/api/logout', async (req, res, next) =>
	{
		// Logout api endpoint
	});

	app.post('/api/register', async (req, res, next) =>
	{
		// incoming: login, password, email, firstName, lastName
		// outgoing: error
		
		// Placeholder error variable
		var error = '';

		// Request body follows this key/value format
		const {login, password, email, firstName, lastName} = req.body;

		// TODO: Add new UserId to this
		const newUser = {Login:login, Password:password, Email:email, FirstName:firstName, LastName:lastName};

		try
		{
			const db = client.db('COP4331Cards');

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
					const result = await db.collection('Users').insertOne(newUser);
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
	});

	app.post('/api/verify', async (req, res, next) =>
	{
		// Verify email api endpoint
	});


	// Me api endpoint
	app.post('/api/me', async (req, res, next) =>
	{
		// incoming: userId, jwtToken
		// outgoing: firstName, lastName, error
		
		// Placeholder error variable
		var error = '';

		// Request body follows this key/value format
		const {userId, jwtToken} = req.body;

		// Verify that the JWT is not expired
		try
		{
			if(token.isExpired(jwtToken))
			{
				var r = {error:'The JWT is no longer valid', jwtToken:''};
				res.status(401).json(r);
				return;
			}
		}
		catch(e)
		{
			console.log(e.message);
		}

		// The database to be queried
		const db = client.db('COP4331Cards');

		// Query the user collection for a matching login and password, and put it in an array
		const results = await db.collection('Users').find({UserID:userId}).toArray();

		// Placeholder user values
		var fn = '';
		var ln = '';

		var ret;

		// If the array has content...
		if( results.length > 0 )
		{
			// Fill the placeholder user variables
			fn = results[0].FirstName;
			ln = results[0].LastName;

			var refreshedToken = null;
			try
			{
				refreshedToken = token.refresh(jwtToken);
			}
			catch(e)
			{
				console.log(e.message);
			}

			ret = {firstName:fn, lastName:ln, jwtToken:refreshedToken.accessToken, error:error};
		}
		else
		{
			ret = {error:"User not found"};
		}

		// Set the status to the return value
		res.status(200).json(ret);
	});
}
