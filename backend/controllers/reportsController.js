
const jwt = require('jsonwebtoken'); // initiate controller

let db; 

exports.setDatabase = function (client) // connect database
{
    if (!process.env.DB_NAME) // verify correct database
    {
        throw new Error('DB_NAME is not set in the environment');
    }

    db = client.db(process.env.DB_NAME); // set database
};

exports.createReport = async function (req, res) // user creates report function
{
    try
    {
        // require valid JWT
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer '))
        {
            return res.status(401).json({
                error: 'Token required'
            });
        }

        let decoded;
        // token decoding (private)
        try
        {
            decoded = jwt.verify(
                authHeader.split(' ')[1],
                process.env.ACCESS_TOKEN_SECRET
            );
        }
        catch (error) // stale token
        {
            return res.status(401).json({
                error: 'Invalid or expired token'
            });
        }

        // read report details
        const {reportedUserId, reason, description} = req.body;

        const targetId = Number(reportedUserId);

        if (
            reportedUserId === undefined ||
            reportedUserId === null ||
            reportedUserId === '' ||
            !Number.isSafeInteger(targetId) ||
            targetId <= 0
        )
        { // missing user information to report
            return res.status(400).json({
                error: 'A valid reportedUserId is required'
            });
        }

        // reportable offenses
        const validReasons = [
            'harassment',
            'inappropriate_content',
            'spam',
            'impersonation',
            'other'
        ];

        if (!validReasons.includes(reason)) // check that reason entered
        {
            return res.status(400).json({
                error: 'A valid report reason is required'
            });
        }

        if ( 
            description !== undefined &&
            (
                typeof description !== 'string' ||
                description.length > 1000
            )
        )
        {
            return res.status(400).json({ // character limiting
                error: 'Description must be a string of at most 1000 characters'
            });
        }

        const reporterId = Number(decoded.userId); // record user that reported

        if (!Number.isSafeInteger(reporterId) || reporterId <= 0)
        {
            return res.status(401).json({ // not a valid report
                error: 'Invalid user identity in token'
            });
        }

        // prevent users from reporting themselves
        if (reporterId === targetId)
        {
            return res.status(400).json({
                error: 'You cannot report yourself'
            });
        }

        const users = db.collection('Users');

        // confirm both users exist in database
        const reporter = await users.findOne({
            UserID: reporterId
        });

        if (!reporter)
        {
            return res.status(401).json({
                error: 'Authenticated user not found'
            });
        }

        const reportedUser = await users.findOne({
            UserID: targetId
        });

        if (!reportedUser)
        {
            return res.status(404).json({
                error: 'Reported user not found'
            });
        }

        // prevent duplicate reports by same user
        // ensures unique report count for account disabling
        const reports = db.collection('Reports');

        const existingReport = await reports.findOne({
            reporterId: reporterId,
            reportedUserId: targetId
        });

        if (existingReport)
        {
            return res.status(409).json({
                error: 'You have already reported this user'
            });
        }

        // save report
        const newReport = {
            reporterId: reporterId,
            reportedUserId: targetId,
            reason: reason,
            description: (description || '').trim(),
            status: 'pending',
            createdAt: new Date()
        };

        const result = await reports.insertOne(newReport);

        // confirmation message
        return res.status(201).json({
            message: 'Report submitted successfully',
            report: {
                reportId: result.insertedId,
                reportedUserId: targetId,
                reason: newReport.reason,
                status: newReport.status,
                createdAt: newReport.createdAt
            }
        });
    }
    catch (error)
    {
        console.error('Create report error:', error);

        return res.status(500).json({
            error: 'Server error while submitting report'
        });
    }
};

// implement reports retrieval endpoint
exports.getMyReports = async function (req, res)
{
    try
    {
        // verify JWT
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer '))
        {
            return res.status(401).json({
                error: 'Token required' // token error message
            });
        }

        let decoded;

        try
        {
            decoded = jwt.verify(
                authHeader.split(' ')[1],
                process.env.ACCESS_TOKEN_SECRET // use .env token
            );
        }
        catch (error)
        {
            return res.status(401).json({
                error: 'Invalid or expired token'
            });
        }

        const reporterId = Number(decoded.userId);

        if (!Number.isSafeInteger(reporterId) || reporterId <= 0) // invalid id check
        {
            return res.status(401).json({
                error: 'Invalid user identity in token'
            });
        }

        // retrieve reports submitted by user
        const reports = await db.collection('Reports')
            .find(
                {reporterId: reporterId},
                {
                    projection: {
                        reporterId: 0
                    }
                }
            )
            .sort({createdAt: -1})
            .toArray();

        return res.status(200).json({
            count: reports.length,
            reports: reports
        });
    }
    catch (error)
    {
        console.error('Get my reports error:', error);

        return res.status(500).json({
            error: 'Server error while retrieving reports'
        });
    }
};

// note: admin role needs to be established for this endpoint to work
// retrieve user reports on admin end
exports.getReportsForUser = async function (req, res)
{
    try
    {
        // verify JWT
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer '))
        {
            return res.status(401).json({
                error: 'Token required' // invalid token
            });
        }

        let decoded;

        try
        {
            decoded = jwt.verify(
                authHeader.split(' ')[1],
                process.env.ACCESS_TOKEN_SECRET // access env for access token
            );
        }
        catch (error)
        {
            return res.status(401).json({
                error: 'Invalid or expired token'
            });
        }

        const adminId = Number(decoded.userId); // needs to be implemented with admin backend
        const targetId = Number(req.params.userId); // user ID for reports

        if (
            !Number.isSafeInteger(adminId) || adminId <= 0 ) // safe-checking admin ID
        {
            return res.status(401).json({
                error: 'Invalid user identity in token'
            });
        }

        if ( !/^[1-9]\d*$/.test(req.params.userId) || !Number.isSafeInteger(targetId)) // safecheck user id
        {
            return res.status(400).json({
                error: 'Invalid user ID'
            });
        }

        // confirm requester is admin
        const users = db.collection('Users');

        const admin = await users.findOne({ UserID: adminId });

        if (!admin) // not admin trying to access private reports info
        {
            return res.status(401).json({error: 'Authenticated user not found'});
        }

        if (admin.Role !== 'admin')
        {
            return res.status(403).json({error: 'Administrator access required'});
        }

        // confirm target user exists
        const reportedUser = await users.findOne({
            UserID: targetId
        });

        if (!reportedUser)
        {
            return res.status(404).json({error: 'User not found'});
        }

        // retrieve reports against target user
        const reports = await db.collection('Reports')
            .find(
                {reportedUserId: targetId},
                {
                    projection: { reporterId: 0 } // find report IDs
                }
            )
            .sort({createdAt: -1}) // report id sorting
            .toArray();

        return res.status(200).json({
            reportedUserId: targetId,
            count: reports.length, // count used to determine account denial
            reports: reports
        });
    }
    catch (error)
    {
        console.error('Get reports for user error:', error);

        return res.status(500).json({
            error: 'Server error while retrieving reports'
        });
    }
};

