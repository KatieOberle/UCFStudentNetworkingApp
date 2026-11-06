let db;

exports.setDatabase = function(client)
{
	db = client.db(process.env.DB_NAME);
}

exports.createPost = async function(req, res)
{
	try
	{
		const {title, body, tags} = req.body;

		if(!title || !body)
		{
			return res.status(400).json({error: 'Cannot make an empty post'});
		}

		const lastPost = await db.collection('Posts')
		.find({})
		.sort({PostID: -1})
		.limit(1)
		.next();

		const postId = lastPost ? lastPost.PostID + 1 : 1;

		const newPost = {
			PostID: postId,
			AuthorId: req.user.userId,
			Title: title,
			Body: body,
			Tags: tags || []
		};

		await db.collection('Posts').insertOne(newPost);

		return res.status(201).json({message: 'Successfully posted', post: newPost});
	}
	catch(error)
	{
		console.error('Error creating post:', error);

		return res.status(500).json({error: 'Server error creating post'});
	}
};

exports.getUserPosts = async function (req, res)
{
	try
	{
		const userId = Number(req.params.userId);

		if(!Number.isInteger(userId) || userId < 1)
		{
			return res.status(400).json({error: 'Invalid user ID'});
		}

		const posts = await db.collection('Posts')
			.find(
				{AuthorId: userId},
				{
					projection: {
						_id: 0,
						PostID: 1,
						AuthorId: 1,
						Title: 1,
						Body: 1,
						Tags: 1
					}
				}
			)
			.sort({PostID: -1})
			.toArray();

		return res.status(200).json({posts: posts});
	}
	catch(error)
	{
		console.error('Error retrieving posts:', error);

		return res.status(500).json({error: 'Server error retrieving posts'
		});
	}
};

exports.updatePost = async function (req, res)
{
	try
	{
		const postId = Number(req.params.postId);

		if(!Number.isInteger(postId) || postId < 1)
		{
			return res.status(400).json({error: 'Invalid post ID'});
		}

		const {title, body, tags} = req.body;

		const updates = {};

		if(title !== undefined)
		{
			if(typeof title !== 'string' || !title.trim())
			{
				return res.status(400).json({error: 'Title cannot be empty'});
			}

			updates.Title = title.trim();
		}
		if(body !== undefined)
		{
			if(typeof body !== 'string' || !body.trim())
			{
				return res.status(400).json({error: 'Body cannot be empty'});
			}

			updates.Body = body.trim()
		}
		if(tags !== undefined)
		{
			if(!Array.isArray(tags))
			{
				return res.status(400).json({error: 'Tags must be an array'});
			}

			if(!tags.every(tag =>
				typeof tag === 'string' && tag.trim().length > 0))
			{
				return res.status(400).json({error: 'Tags must be non-empty strings'});
			}

			updates.Tags = tags.map(tag => tag.trim());
		}

		if(Object.keys(updates).length === 0)
		{
			return res.status(400).json({error: 'No updates made'});
		}
		
		const result = await db.collection('Posts').updateOne(
			{
				PostID: postId,
				AuthorId: req.user.userId
			},
			{
				$set: updates
			}
		);

		if(result.matchedCount === 0)
		{
			const post = await db.collection('Posts').findOne(
				{PostID: postId},
				{projection: {_id: 0, PostID: 1}}
			);

			if(!post)
			{
				return res.status(404).json({error: 'Post not found'});
			}

			return res.status(403).json({error: 'You cannot edit another user\'s post'});
		}

		const updatePost = await db.collection('Posts').findOne(
			{
				PostID: postId,
				AuthorId: req.user.userId
			},
			{
				projection: {
					_id: 0,
					PostID: 1,
					AuthorId: 1,
					Title: 1,
					Body: 1,
					Tags: 1
				}
			}
		);

		return res.status(200).json({message: 'Post edited successfully', post: updatePost});
	}
	catch(error)
	{
		console.error('Error updating post:', error);

		return res.status(500).json({error: ' Server error editing post'});
	}
};

exports.deletePost = async function (req, res)
{
	try
	{
		const postId = Number(req.params.postId);

		if(!Number.isInteger(postId) || postId < 1)
		{
			return res.status(400).json({error: 'Invalid post ID'});
		}

		const result = await db.collection('Posts').deleteOne(
			{
				PostID: postId,
				AuthorId: req.user.userId
			}
		);

		if(result.deletedCount === 0)
		{
			const post = await db.collection('Posts').findOne(
				{PostID: postId},
				{projection: {_id: 0, PostID: 1}}
			);

			if(!post)
			{
				return res.status(404).json({error: 'Post not found'});
			}

			return res.status(403).json({error: 'You cannot delete another user\'s post'});
		}

		return res.status(200).json({message: 'Post deleted successfully'});
	}
	catch(error)
	{
		console.error('Error deleting post:', error);

		return res.status(500).json({error: 'Server error deleting post'});
	}
};
