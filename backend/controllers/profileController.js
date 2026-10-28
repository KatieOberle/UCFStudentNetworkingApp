const jwt = require('jsonwebtoken');

let db;

exports.setDatabase = function (client)
{
	db = client.db(process.env.DB_NAME);
}

exports.getProfile = async function (req, res)
{
	try
	{
		const userId = Number(req.params.userId);

		if (!userId || userId < 1)
		{
			return res.status(400).json({error: 'Invalid user ID'});
		}

		const user = await db.collection('Users').findOne(
			{UserID: userId},
			{
				projection: {
					_id: 0,
					Password: 0,
					VerifyToken: 0,
					VerifyExpires: 0,
					ResetToken: 0,
					ResetExpires: 0
				}
			}
		);
		
		if(!user)
		{
			return res.status(404).json({error: 'User not found'});
		}

		return res.status(200).json({
			user: {
				userId: user.UserID,
				firstName: user.FirstName,
				lastName: user.LastName,
				email: user.Email,
				major: user.Major || '',
				graduationYear: user.GraduationYear || null,
				careerInterests: user.CareerInterests || [],
				companies: user.Companies || [],
				bio: user.Bio || '',
				contact: user.Contact || {}
			}
		});
	}
	catch(error)
	{
		console.error('Error getting profile:', error);
		return res.status(500).json({error: 'Server error getting profile'});
	}
};

exports.updateProfile = async function (req, res)
{
	try
	{
		const userId = Number(req.params.userId);

		if (!userId || userId < 1)
		{
			return res.status(400).json({error: 'Invalid user ID'});
		}
			


		if(req.user.userId !== userId)
		{
			return res.status(403).json({error: 'You cannot update profiles that are not yours'});
		}

		const updateableFields = ['Major', 'GraduationYear', 'CareerInterests', 'Companies', 'Bio', 'Contact']
		const updates = {};

		for(const field of updateableFields)
		{
			if(req.body[field] !== undefined)
			{
				updates[field] = req.body[field];
			}
		}

		if(Object.keys(updates).length === 0)
		{
			return res.status(400).json({error: 'No changes made'});
		}

		const result = await db.collection('Users').updateOne(
			{UserID: userId},
			{$set: updates}
		);

		const user = await db.collection('Users').findOne(
			{UserID: userId},
			{
				projection: {
					_id: 0,
					Password: 0,
					VerifyToken: 0,
					VerifyExpires: 0,
					ResetToken: 0,
					ResetExpires: 0
				}
			}
		);

		if(!user)
		{
			return res.status(404).json({error: 'User not found'});
		}

		return res.status(200).json({
			message: 'Profile updated successfully',
			user: {
				userId: user.UserID,
				firstName: user.FirstName,
				lastName: user.LastName,
				email: user.Email,
				emailVerified: user.EmailVerified,
				major: user.Major || '',
				graduationYear: user.GraduationYear || null,
				careerInterests: user.CareerInterests || [],
				companies: user.Companies || [],
				bio: user.Bio || '',
				contact: user.Contact || {}
			    }
		});
	}
	catch(error)
	{
		console.error('Error updating profile:', error);
        	return res.status(500).json({error: 'Server error updating profile'});
	}
};

exports.searchProfile = async function (req, res)
{
	try
	{
		// Verify JWT via middleware (do this in routes
		// Validate search term
		const searchTerm = req.query.q?.trim();

		if(!searchTerm || searchTerm.length > 100)
		{
			return res.status(400).json({error: 'Search term is required (maximum 100 characters)'});
		}

		const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

		const regex = new RegExp(escapedTerm, 'i');

		const users = await db.collection('Users').find(
			{
				UserID: {$ne: req.user.userId},
				$or: [
					{FirstName:regex},
					{LastName:regex},
					{Major:regex},
					{Companies:regex},
					{CareerInterests:regex}
				]
			},
			{
				projection:
				{
					_id: 0,
					UserID: 1,
					FirstName: 1,
					LastName: 1,
					Major: 1,
					GraduationYear:1,
					CareerInterests: 1,
					Companies: 1,
					Bio: 1
				}
			}
		).sort({LastName: 1, FirstName: 1}).limit(20).toArray();

		return res.status(200).json({
			users: users.map(user => ({
				userId: user.UserID,
				firstName: user.FirstName,
				lastName: user.LastName,
				major: user.Major || '',
				graduationYear: user.GraduationYear || null,
				careerInterests: user.CareerInterests || [],
				companies: user.Companies || [],
				bio: user.Bio || ''
			    }))
		});
	}
	catch(error)
	{
		console.error('Error searching users:', error);
		return res.status(500).json({error: 'Server error searching users'});
	}
};
