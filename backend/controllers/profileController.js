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
		const {userId} = Number(req.params.userId);

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
				major: user.Major || '',
				graduationYear: user.GraduationYear || null,
				careerInterests: user.CareerInterests || [],
				companies: user.Companies || [],
				bio: user.Bio || ''
			}
		});
	}
	catch(error)
	{
		console.error('Error getting profile:', error);
		return res.status(500).json({error: 'Server error getting profile'});
	}
};
