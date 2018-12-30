const jwt = require("jsonwebtoken");

function admin (req, res, next) {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY_ADMIN);
		req.userData = decoded;
		next();
	} catch(error) {
		return res.status(401).json({ message: "Auth failed" });
	}
}

function mod (req, res, next) {
	try {
		const token = req.headers.authorization.split(" ")[1];
		console.log(token);
		const decoded = jwt.verify(token, process.env.JWT_KEY_MOD);
		req.userData = decoded;
		next();
	} catch(error) {
		return res.status(401).json({ message: "Auth failed" });
	}
}

function register (req, res, next) {
	try {
		const token = req.headers.authorization.split(" ")[1];
		console.log(token);
		const decoded = jwt.verify(token, process.env.JWT_KEY_REGISTER);
		req.userData = decoded;
		next();
	} catch(error) {
		return res.status(401).json({ message: "Auth failed" });
	}
}

module.exports = {
	admin: admin,
	mod: mod,
	register: register
};