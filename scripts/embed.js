const { Configuration, OpenAIApi } = require("openai");
const connection = require("../config/database");

const generateEmbeddings = async (data) => {
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { oid, name, description, historical_descr } = item;
    const content = name + " " + description + " " + historical_descr;

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: content,
    });

    if (embeddingResponse.status !== 200) {
      console.log("error", embeddingResponse);
    } else {
      const [{ embedding = Buffer.alloc(1536 * 4) }] =
        embeddingResponse.data.data;

      console.log("embedding...", embedding);

      const query = `UPDATE sw_place SET embed="${embedding}" WHERE oid=${oid}`;

      connection.query(query, [oid], function (error, results, fields) {
        if (error) {
          console.log("not saved...", error);
        } else {
          console.log("saved...", name);
        }
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

(async () => {
  const query = `SELECT * FROM sw_place LIMIT 1`;

  const places = await new Promise((resolve, reject) => {
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log("fetchPlaces error...", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  await generateEmbeddings(places);
})();
