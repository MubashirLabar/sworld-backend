const { Configuration, OpenAIApi } = require("openai");
// const { translate } = require("bing-translate-api");
const connection = require("../config/database");
// const { removeNoiseFromContent } = require("../utils/common");

const generateEmbeddings = async (data) => {
  // const configuration = new Configuration({
  //   apiKey: "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",
  // });

  // const openai = new OpenAIApi(configuration);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { oid, name, description, historical_descr } = item;
    // const content = name;

    // const res = await translate(content, null, "en");

    // console.log("response", res.text, "....", res.translation);

    // const preprocessedContent = removeNoiseFromContent(content);

    // const embeddingResponse = await openai.createEmbedding({
    //   model: "text-embedding-ada-002",
    //   input: content,
    // });

    // console.log("content...", content, "...", preprocessedContent);

    // if (embeddingResponse.status !== 200) {
    //   console.log("error", embeddingResponse);
    // } else {
    //   const [{ embedding }] = embeddingResponse.data.data;

    // const serializedEmbeddings = embedding.join();

    const query = "UPDATE sw_place SET embed = ? WHERE oid = ?";
    const values = [null, oid];

    connection.query(query, values, function (error, results, fields) {
      if (error) {
        console.log("not saved...", error);
      } else {
        console.log("saved...", name);
      }
    });
    // }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

// const translation = async (places) => {
//   for (const place of places) {
//     try {
//       const res = await translate(place.name, null, "en");
//       console.log("response", res.text, "....", res.translation);
//     } catch (err) {
//       console.error("error...", place.oid, err);
//     }
//   }
// };

(async () => {
  const query = `SELECT * FROM sw_place`;
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
  // await translation(places);
  await generateEmbeddings(places);
})();
