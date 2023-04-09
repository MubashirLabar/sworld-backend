const he = require("he");
const natural = require("natural");
const { Configuration, OpenAIApi } = require("openai");
const connection = require("../config/database");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const searchWithAI = async (prompt, similarity_threshold, match_count) => {
  const preprocessedContent = removeNoiseFromContent(prompt);

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: preprocessedContent,
  });

  if (embeddingResponse.status !== 200) {
    console.log("error", embeddingResponse);
    return {
      error: "Something is wrong!",
    };
  } else {
    try {
      const [{ embedding }] = embeddingResponse.data.data;

      // Convert the embedding to a comma-separated string
      const embeddingString = embedding.join();

      const query = `SELECT *,
      ROUND(
        (1 - COSINE_SIMILARITY(sw_place.embed, ?)) * 100,
        2
      ) AS similarity
      FROM sw_place
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

const removeNoiseFromContent = (content) => {
  // Decode HTML entities
  const decodedContent = he.decode(content);

  // Tokenize and remove stopwords and punctuation
  const tokenizer = new natural.WordTokenizer();
  const stopwords = new Set(natural.stopwords);
  const tokens = tokenizer.tokenize(decodedContent);
  const filteredTokens = tokens.filter(
    (token) => !stopwords.has(token) && /\w/.test(token)
  );

  // Stem the tokens
  const stemmer = natural.PorterStemmer;
  const stemmedTokens = filteredTokens.map((token) => stemmer.stem(token));

  // Join the stemmed tokens back into a string
  const preprocessedContent = stemmedTokens.join(" ");

  return preprocessedContent;
};

module.exports = {
  searchWithAI,
  removeNoiseFromContent,
};
