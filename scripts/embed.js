const { Configuration, OpenAIApi } = require("openai");
const connection = require("../config/database");
const { removeNoiseFromContent } = require("../utils/common");

const generateEmbeddings = async (data) => {
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { oid, name, description, historical_descr } = item;
    const content = name + " " + description + " " + historical_descr;

    const preprocessedContent = removeNoiseFromContent(content);

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: preprocessedContent,
    });

    if (embeddingResponse.status !== 200) {
      console.log("error", embeddingResponse);
    } else {
      const [{ embedding }] = embeddingResponse.data.data;

      const serializedEmbeddings = embedding.join();

      const query = "UPDATE sw_place SET embed = ? WHERE oid = ?";
      const values = [serializedEmbeddings, oid];

      connection.query(query, values, function (error, results, fields) {
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
  // const query = `SELECT * FROM sw_place`;
  const query = `SELECT * FROM sw_place WHERE embed IS NULL OR JSON_LENGTH(embed) <= 0`;

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
