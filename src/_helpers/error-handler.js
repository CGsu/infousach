module.exports = {
	e404: e404,
	e500: e500
};

function e404(req, res) {
	res.status(404);
	res.render("404");
}

function e500 (err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render("500");
}