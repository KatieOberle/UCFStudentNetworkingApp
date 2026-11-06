let db;

exports.setDatabase = function (client)
{
	db = client.db(process.env.DB_NAME);
}

exports.sendRequest = async function(req, res)
{
	try
	{
		const recipientId = Number(req.params.userId);
		const requesterId = req.user.userId;

		if(!Number.isInteger(recipientId) || recipientId < 1)
		{
			return res.status(400).json({error: 'Invalid user ID'});
		}

		if(requesterId === recipientId)
		{
			return res.status(400).json({error: 'Cannot send a connection to self'});
		}

		const recipient = await db.collection('Users').findOne(
			{UserID: recipientId},
			{projection: {_id: 0, UserID: 1}}
		);

		if(!recipient)
		{
			return res.status(404).json({error: 'User not found'});
		}

		const existingConnection = await db.collection('Connections').findOne({
			$or: [
				{RequesterId: requesterId, RecipientId: recipientId},
				{RequesterId: recipientId, RecipientId: requesterId}
			]
		});

		if(existingConnection)
		{
			return res.status(409).json({error: 'Connection already requested'});
		}

		const newConnection = {
			RequesterId: requesterId,
			RecipientId: recipientId,
			Status: 'pending',
			CreatedAt: new Date()
		};

		await db.collection('Connections').insertOne(newConnection);

		return res.status(201).json({message: 'Connection request successfully sent'});
	}
	catch(error)
	{
		if(error.code === 11000)
		{
			return res.status(409).json({error: 'Connection already requested'});
		}

		console.error('Error sending connection request:', error);

		return res.status(500).json({error: 'Server error sending connection request'});
	}
};

exports.acceptRequest = async function(req, res)
{
	try
	{
		const requesterId = Number(req.params.userId);
		const recipientId = req.user.userId;

		if(!Number.isInteger(requesterId) || requesterId < 1)
		{
			return res.status(400).json({error: 'Invalid user ID'});
		}

		const result = await db.collection('Connections').updateOne(
			{
				RequesterId: requesterId,
				RecipientId: recipientId,
				Status: 'pending'
			},
			{
				$set: {Status: 'accepted'}
			}
		);

		if(result.matchedCount === 0)
		{
			return res.status(404).json({error: 'Pending connection request not found'});
		}

		return res.status(200).json({message: 'Connection request successfully accepted'});
	}
	catch(error)
	{
		console.error('Error accepting connection request:', error);

		return res.status(500).json({error: 'Server error accepting connection request'});
	}
};

exports.declineRequest = async function(req, res)
{
	try
	{
		const requesterId = Number(req.params.userId);
		const recipientId = req.user.userId;

		if(!Number.isInteger(requesterId) || requesterId < 1)
		{
			return res.status(400).json({error: 'Invalid user ID'});
		}

		const result = await db.collection('Connections').deleteOne(
			{
				RequesterId: requesterId,
				RecipientId: recipientId,
				Status: 'pending'
			}
		);

		if(result.deletedCount === 0)
		{
			return res.status(404).json({error: 'Pending connection request not found'});
		}

		return res.status(200).json({message: 'Connection request successfully declined'});
	}
	catch(error)
	{
		console.error('Error declining connection request:', error);

		return res.status(500).json({error: 'Server error declining connection request'});
	}
};

exports.getRequests = async function(req, res)
{
	try
	{
		const userId = req.user.userId;

		const requests = await db.collection('Connections')
		.find(
			{
				RecipientId: userId,
				Status: 'pending'
			},
			{
				projection: {
					_id: 0,
					RequesterId: 1,
					RecipientId: 1,
					Status: 1,
					CreatedAt: 1
				}
			}
		)
		.sort({CreatedAt: -1})
		.toArray();

		return res.status(200).json({requests: requests});
	}
	catch(error)
	{
		console.error('Error getting connection requests', error);

		return res.status(500).json({error: 'Server error getting connection requests'});
	}
};

exports.getConnections = async function(req, res)
{
	try
	{
		const userId = Number(req.params.userId);

		if(!Number.isInteger(userId) || userId < 1)
		{
			return res.status(400).json({error: 'Invalid user ID'});
		}
		
		const connections = await db.collection('Connections')
			.find(
				{
					$or: [
						{RequesterId: userId},
						{RecipientId: userId}
					],
					Status: 'accepted'
				},
				{
					projection: {
						_id: 0,
						RequesterId: 1,
						RecipientId: 1
					}
				}
			)
			.toArray();

		const formattedConnections = connections.map(connection => ({
			userId: connection.RequesterId === userId
				? connection.RecipientId
				: connection.RequesterId
		}));

		return res.status(200).json({connections: formattedConnections});
	}
	catch(error)
	{
		console.error('Error getting connections:', error);

		return res.status(500).json({error: 'Server error getting connections'});
	}
};


