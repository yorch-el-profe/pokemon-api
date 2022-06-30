const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

const API = "https://pokeapi.co/api/v2";

app.get("/pokemon", async function (request, response) {
	try {
		const { data } = await axios.get(`${API}/pokemon?limit=151`);

		const responses = await Promise.all(
			data.results.map((x) => axios.get(x.url))
		);

		const pokemon = responses
			.map(({ data }) => data)
			.map((p) => ({
				number: p.id,
				name: p.name,
			}));

		response.json({ data: pokemon });
	} catch (e) {
		response.status(400).json({ error: e.message });
	}
});

app.get("/pokemon/:id", async function (request, response) {
	try {
		const { id } = request.params;
		const { data } = await axios.get(`${API}/pokemon/${id}`);
		response.json({
			data: {
				number: data.id,
				name: data.name,
				types: data.types.map((t) => t.type.name),
				artwork: data.sprites.other["official-artwork"].front_default,
				sprite: data.sprites.front_default,
			},
		});
	} catch (e) {
		response.status(400).json({ error: e.message });
	}
});

app.listen(process.env.PORT || 3000);
