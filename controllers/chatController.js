const { Configuration, OpenAIApi } = require("openai");
const { searchWithAI, searchWithQuery } = require("../utils/common");
const connection = require("../config/database");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class AIChat {
  async answer(req, res) {
    const { prompt, similarity_threshold = 0.5, match_count = 1 } = req.body;
    const searchResponse = await searchWithQuery(
      prompt,
      similarity_threshold,
      match_count
    );

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        n: 1,
        temperature: 0.5,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
      });
      const description = response.data.choices;
      const places = searchResponse?.results ? searchResponse.results : [];

      return res.status(200).json({
        text: description[0]?.text || "",
        places,
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        return res.status(500).json("Server internal error!");
      } else {
        console.log(error.message);
      }
      res.status(400).json({
        error: "The image could not be generated",
      });
    }
  }

  async search(req, res) {
    const { prompt, similarity_threshold = 0.01, match_count = 5 } = req.body;

    const response = await searchWithQuery(
      prompt,
      similarity_threshold,
      match_count
    );

    if (response.error) {
      return res.status(500).json(response);
    } else {
      return res.status(200).json({
        data: response.results,
      });
    }
  }
}

module.exports = new AIChat();
