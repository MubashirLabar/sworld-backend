const connection = require("../config/database");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const csv = require("csv-parser");

const results = [];

const uploadData = async (data) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { post_title, post_url, post_date, content } = item;

    const query = `INSERT INTO testing_posts (post_title, post_url, post_date, content, embedding) 
      VALUES (?, ?, ?, ?, ?)`;
    const values = [post_title, post_url, post_date, content, null];

    connection.query(query, values, function (error, results, fields) {
      if (error) {
        console.log("not saved...", error);
      } else {
        console.log("saved...", post_title);
      }
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
};

const generateEmbeddings = async (data) => {
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { post_title, id, content } = item;

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: content,
    });

    if (embeddingResponse.status !== 200) {
      console.log("error", embeddingResponse);
    } else {
      const [{ embedding }] = embeddingResponse.data.data;

      const serializedEmbeddings = embedding.join();

      const query = "UPDATE testing_posts SET embedding = ? WHERE id = ?";
      const values = [serializedEmbeddings, id];

      connection.query(query, values, function (error, results, fields) {
        if (error) {
          console.log("not saved...", error);
        } else {
          console.log("saved...", post_title);
        }
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

(async () => {
  // fs.createReadStream("wbw.csv")
  //   .pipe(csv())
  //   .on("data", (data) => {
  //     results.push(data);
  //   })
  //   .on("end", async () => {
  //     await uploadData(results);
  //   });
  const query = `SELECT * FROM testing_posts LIMIT 1000`;
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
