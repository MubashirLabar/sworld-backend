const { Configuration, OpenAIApi } = require("openai");
// const env = require("../config/envConfig");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

class AIChat {
  async createMessage(req, res) {
    const { prompt } = req.body;
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        n: 1,
        temperature: 0.9,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
      });
      const description = response.data.choices;
      return res.status(201).json({
        text: description[0]?.text || "",
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
}

module.exports = new AIChat();
