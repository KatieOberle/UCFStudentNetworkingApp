const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function ( fn, ln, id)
{
	return _createToken(fn, ln, id);
}

_createToken = function(fn, ln, id)
{
	try
	{
		const user = {userId:id,firstName:fn,lastName:ln};

		const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});

		var ret = {accessToken:accessToken};
	}
	catch(e)
	{
		var ret = {error:e.message};
	}
	return ret;
}

exports.isExpired = function(token)
{
	try
	{
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		return false;
	}
	catch(e)
	{
		return true;
	}
}

exports.refresh = function (token)
{
	try
	{
		const ud = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		return _createToken(ud.firstName, ud.lastName, ud.userId);
	}
	catch(e)
	{
		return {error:e.message};
	}
}
