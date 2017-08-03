module.exports = function(app, db) {
	app.get('/user/:id', (req, res) => {
	const id = req.params.id;
	const details = { 'userid': id };
	console.log("Hi the collections are: " + JSON.parse(db.listCollections()))
	db.collection('user').find(details, (err, item) => {
	res.send("Hi") 
	});
	});
};

