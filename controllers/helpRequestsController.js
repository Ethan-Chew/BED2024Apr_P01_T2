const helpRequest = require("../models/helpRequest");

const getPendingRequests = async (req, res) => {
    try {

        const requests = await helpRequest.getPendingRequests();

        if (!requests) {
            res.status(404).json({
                message: `Requests not found.`
            });
            return;
        }

        res.status(200).json({
            message: "Requests Found",
            requests: requests
        });
        
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const approveRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const result = await helpRequest.approveRequest(requestId);

        if (!result) {
            res.status(404).json({ error: 'Error approving request' });
            return;
        } else {
            res.status(200).json(true);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const rejectRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const result = await helpRequest.rejectRequest(requestId);

        if (!result) {
            res.status(404).json({ error: 'Error rejecting request' });
            return;
        } else {
            res.status(200).json(true);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = {
    getPendingRequests,
    approveRequest,
    rejectRequest
}