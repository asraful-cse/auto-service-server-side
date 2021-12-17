const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v25nn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const port = process.env.PORT || 5000;
const app = express();
// middleware------------------------
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("new last project SUCCESSFULLY  CONNECTED TO DATABASE MONGODB");
});

client.connect((err) => {
	const servicesCollection = client.db("autoServices").collection("services");
	const usersCollection = client.db("autoServices").collection("users");
	const ordersCollection = client.db("autoServices").collection("orders");
	const reviewCollection = client.db("autoServices").collection("review");

	//add servicesCollection----------------------------------------------
	app.post("/addServices", async (req, res) => {
		console.log(req.body);
		const result = await servicesCollection.insertOne(req.body);
		res.send(result);
	});

	// get all services----------------------------------------------------
	app.get("/allServices", async (req, res) => {
		const result = await servicesCollection.find({}).toArray();
		res.send(result);
	});
	// delete all services----------------------------------------------------
	app.delete("/allServices/:id", async (req, res) => {
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const result = await servicesCollection.deleteOne(query);
		console.log("deleting user with id ", result);
		res.json(result);
	});

	// single service------------------------------------------------------
	app.get("/singleService/:id", async (req, res) => {
		console.log(req.params.id);
		const result = await servicesCollection
			.find({ _id: ObjectId(req.params.id) })
			.toArray();
		res.send(result[0]);
		console.log(result);
	});

	// insert order and---------------------------------------------------------

	app.post("/addOrders", async (req, res) => {
		const result = await ordersCollection.insertOne(req.body);
		res.send(result);
	});

	//  my order------------------------------------------------------------------

	app.get("/myOrder/:email", async (req, res) => {
		console.log(req.params.email);
		const result = await ordersCollection
			.find({ email: req.params.email })
			.toArray();
		res.send(result);
	});

	//  delete-------------------------.............................
	app.delete("/myOrder/:id", async (req, res) => {
		const id = req.params.id;
		const query = { _id: ObjectId(id) };
		const result = await ordersCollection.deleteOne(query);
		console.log("deleting user with id ", result);
		res.json(result);
	});

	// review post-----------------------------------------------------------------
	app.post("/addReview", async (req, res) => {
		const result = await reviewCollection.insertOne(req.body);
		res.send(result);
	});
	// review get------------------------------------------------------------------
	app.get("/addReview", async (req, res) => {
		const result = await reviewCollection.find({}).toArray();
		res.send(result);
	});
	// post user info---------------------------------------------------------------
	app.post("/addUserInfo", async (req, res) => {
		console.log("req.body");
		const result = await usersCollection.insertOne(req.body);
		res.send(result);
		console.log(result);
	});
	//  make admin--------------------------------------------------------

	app.put("/makeAdmin", async (req, res) => {
		const filter = { email: req.body.email };
		const result = await usersCollection.find(filter).toArray();
		if (result) {
			const documents = await usersCollection.updateOne(filter, {
				$set: { role: "admin" },
			});
			console.log(documents);
			res.send(documents);
		}
	});

	// check admin or not-------------------------------------------------------------------
	app.get("/checkAdmin/:email", async (req, res) => {
		const result = await usersCollection
			.find({ email: req.params.email })
			.toArray();
		console.log(result);
		res.send(result);
	});

	/// all order---------------------------------------------------------------------------
	app.get("/allOrders", async (req, res) => {
		const result = await ordersCollection.find({}).toArray();
		res.send(result);
	});

	// status update--------------------------------------------------------------------
	app.put("/statusUpdate/:id", async (req, res) => {
		const filter = { _id: ObjectId(req.params.id) };
		console.log(req.params.id);
		const result = await ordersCollection.updateOne(filter, {
			$set: {
				status: req.body.status,
			},
		});
		res.send(result);
		console.log(result);
	});
});

app.listen(process.env.PORT || port);
