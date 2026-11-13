// Katie: javascript controller for comment api endpoints
let db;

// connect database
exports.setDatabase = function(client)
{
	db = client.db(process.env.DB_NAME);
}

// create a comment on existing post
exports.createComment = async function(req, res)
{
	try
	{
		const postId = Number(req.params.postId); // unique post ID
		const {body} = req.body;

		if(!Number.isInteger(postId) || postId < 1) // ID error checking
		{
			return res.status(400).json({error: 'Invalid post ID'});
		}

        // prevent users from posting empty comments
		if(typeof body !== 'string' || !body.trim())
		{
			return res.status(400).json({error: 'Comment cannot be empty'});
		}

		// ensure post exists before creating comment
		const post = await db.collection('Posts').findOne(
			{PostID: postId},
			{projection: {_id: 0, PostID: 1}}
		);

		if(!post)
		{
			return res.status(404).json({error: 'Post not found'});
		}

		// generate next ReplyID using existing database records
		const lastReply = await db.collection('Replies')
			.find({})
			.sort({ReplyID: -1})
			.limit(1)
			.next();

		const replyId = lastReply ? lastReply.ReplyID + 1 : 1;

        // organize all relevant comment information (ID for comment/post, author ID, message, date)
		const newComment = {
			ReplyID: replyId,
			PostID: postId,
			AuthorId: req.user.userId,
			Body: body.trim(),
			CreatedAt: new Date()
		};

		await db.collection('Replies').insertOne(newComment);

        // success communication
		return res.status(201).json({
			message: 'Comment created successfully',
			comment: newComment
		});
	}
	catch(error) // catch and communicate error creating comment
	{
		console.error('Error creating comment:', error);

		return res.status(500).json({error: 'Server error creating comment'});
	}
};


// retrieve all comments on a post
exports.getPostComments = async function(req, res)
{
	try
	{
		const postId = Number(req.params.postId);

		if(!Number.isInteger(postId) || postId < 1)
		{
			return res.status(400).json({error: 'Invalid post ID'});
		}

        // find post using ID
		const post = await db.collection('Posts').findOne(
			{PostID: postId},
			{projection: {_id: 0, PostID: 1}}
		);

        // reject non-exisitng posts
		if(!post)
		{
			return res.status(404).json({error: 'Post not found'});
		}

        // find exisitng comments
		const comments = await db.collection('Replies')
			.find(
				{PostID: postId},
				{
					projection: {
						_id: 0,
						ReplyID: 1,
						PostID: 1,
						AuthorId: 1,
						Body: 1,
						CreatedAt: 1
					}
				}
			)
			.sort({CreatedAt: 1, ReplyID: 1})
			.toArray();

		return res.status(200).json({
			comments: comments
		});
	}
	catch(error) // error catching and communication retrieving comments from database
	{
		console.error('Error retrieving comments:', error);

		return res.status(500).json({error: 'Server error retrieving comments'});
	}
};


// update existing comment
exports.updateComment = async function(req, res)
{
	try
	{
		const replyId = Number(req.params.replyId);
		const {body} = req.body;

		if(!Number.isInteger(replyId) || replyId < 1)
		{
			return res.status(400).json({error: 'Invalid comment ID'});
		}

		if(typeof body !== 'string' || !body.trim())
		{
			return res.status(400).json({error: 'Comment cannot be empty'});
		}

		const result = await db.collection('Replies').updateOne(
			{
				ReplyID: replyId,
				AuthorId: req.user.userId
			},
			{
				$set: {
					Body: body.trim()
				}
			}
		);

		if(result.matchedCount === 0)
		{
			const comment = await db.collection('Replies').findOne(
				{ReplyID: replyId},
				{projection: {_id: 0, ReplyID: 1}}
			);

			if(!comment)
			{
				return res.status(404).json({error: 'Comment not found'});
			}

            // make sure only author user can edit comment
			return res.status(403).json({
				error: 'You cannot edit another user\'s comment'
			});
		}

        // retrieve updated comment
		const updatedComment = await db.collection('Replies').findOne(
			{
				ReplyID: replyId,
				AuthorId: req.user.userId
			},
			{
				projection: {
					_id: 0,
					ReplyID: 1,
					PostID: 1,
					AuthorId: 1,
					Body: 1,
					CreatedAt: 1
				}
			}
		);

        // communicate success
		return res.status(200).json({
			message: 'Comment updated successfully',
			comment: updatedComment
		});
	}
	catch(error) // error catch and communication
	{
		console.error('Error updating comment:', error);

		return res.status(500).json({error: 'Server error updating comment'});
	}
};


// delete a comment
exports.deleteComment = async function(req, res)
{
	try
	{
		const replyId = Number(req.params.replyId);

		if(!Number.isInteger(replyId) || replyId < 1)
		{
			return res.status(400).json({error: 'Invalid comment ID'});
		}

        // load replies existing
		const result = await db.collection('Replies').deleteOne(
			{
				ReplyID: replyId,
				AuthorId: req.user.userId
			}
		);

		if(result.deletedCount === 0)
		{
			const comment = await db.collection('Replies').findOne(
				{ReplyID: replyId},
				{projection: {_id: 0, ReplyID: 1}}
			);

            // only able to delete existing comments
			if(!comment)
			{
				return res.status(404).json({error: 'Comment not found'});
			}

            // only author user allowed to delete comment
			return res.status(403).json({
				error: 'You cannot delete another user\'s comment'
			});
		}

		return res.status(200).json({
			message: 'Comment deleted successfully'
		});
	}
	catch(error) // error catching and communication
	{
		console.error('Error deleting comment:', error);

		return res.status(500).json({error: 'Server error deleting comment'});
	}
};