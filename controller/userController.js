const userSubscribeModel = require('../models/userSubscribeModel')


const userSubscribe = async (req, res) => {

    try {
        const { email, phone } = req.body;

        // Check if either email or phone already exists
        const existingUser = await userSubscribeModel.findOne({
            $or: [{ email }, { phone }]
        });


        if (existingUser) {
            const message = existingUser.email === email
                ? 'Email already exists'
                : 'Phone number already exists';
            return res.status(400).json({ message });
        }

        // Create and save new subscription
        const newSubscribe = new userSubscribeModel({ email, phone });
        const savedUser = await newSubscribe.save();

        res.status(200).json({
            savedUser,
            success: true,
            message: "Subscription Successful"
        });

    } catch (error) {
        console.error("Subscription error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    userSubscribe,
}
