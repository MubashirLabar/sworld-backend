const he = require("he");
const natural = require("natural");
const { Configuration, OpenAIApi } = require("openai");
const connection = require("../config/database");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const searchWithAI = async (prompt, similarity_threshold, match_count) => {
  // const preprocessedContent = removeNoiseFromContent(prompt);

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: prompt,
  });

  if (embeddingResponse.status !== 200) {
    console.log("error", embeddingResponse);
    return {
      error: "Something is wrong!",
    };
  } else {
    try {
      const [{ embedding }] = embeddingResponse.data.data;
      const embeddingString = embedding.join();

      const query = `SELECT *,
        ROUND(
          (1 - COSINE_SIMILARITY(testing_posts.embedding, ?)) * 100,
          2
        ) AS similarity
        FROM testing_posts
        HAVING similarity > ?
        ORDER BY similarity DESC   
        LIMIT ?;
    `;

      const [results, fields] = await connection
        .promise()
        .query(query, [embeddingString, similarity_threshold, match_count]);

      // Return the most similar record
      return {
        results: results,
      };
    } catch (e) {
      console.log("catch error...", e.message);
      return {
        error: "Something is wrong!",
      };
    }
  }
};

const searchWithQuery = async (prompt, similarity_threshold, match_count) => {
  try {
    const query = `SELECT * FROM sw_place WHERE MATCH(name, description) AGAINST('${prompt}' IN NATURAL LANGUAGE MODE) LIMIT 1`;

    const results = await new Promise((resolve, reject) => {
      connection.query(query, function (error, results, fields) {
        if (error) {
          console.log("fetchPlaces error...", error);
          reject({ error: "Something is wrong!" });
        } else {
          resolve({ results });
        }
      });
    });
    // console.log("results...", results);
    return results;
  } catch (e) {
    console.log("catch error...", e.message);
    return {
      error: "Something is wrong!",
    };
  }
};

const removeNoiseFromContent = (content) => {
  // Decode HTML entities
  const decodedContent = he.decode(content);

  // Tokenize and remove stopwords and punctuation
  const tokenizer = new natural.WordTokenizer();
  const stopwords = new Set(natural.stopwords);
  const tokens = tokenizer.tokenize(decodedContent);
  const filteredTokens = tokens.filter(
    (token) => !stopwords.has(token) && /\w+(['-]\w+)*/.test(token)
  );

  // Join the stemmed tokens back into a string
  const preprocessedContent = filteredTokens.join(" ");
  return preprocessedContent;
};

module.exports = {
  searchWithAI,
  searchWithQuery,
  removeNoiseFromContent,
};
