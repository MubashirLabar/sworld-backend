const { Configuration, OpenAIApi } = require("openai");
const { searchWithQuery } = require("../utils/common");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const chatRules = [
  { input: "hi", output: "Hello! How can I assist you today?" },
  { input: "hello!", output: "Hi there! How can I help you today?" },
  { input: "hello", output: "Hi there! How can I help you today?" },
  { input: "how are you?", output: "I'm doing well, thank you for asking." },
  { input: "how are you", output: "I'm doing well, thank you for asking." },
];

class AIChat {
  async answer(req, res) {
    const { prompt, similarity_threshold = 0.5, match_count = 1 } = req.body;
    const rule = chatRules.find((r) => r.input === prompt.toLowerCase());
    try {
      // if (rule) {
      //   return res.status(200).json({
      //     text: rule.output,
      //     places: [],
      //   });
      // }

      const [searchResponse, openaiResponse] = await Promise.all([
        searchWithQuery(prompt, similarity_threshold, match_count),
        openai.createCompletion({
          model: "text-davinci-003",
          prompt: `You: ${prompt}\nAI:`,
          // n: 1,
          temperature: 0,
          max_tokens: 1000,
          top_p: 1.0,
          frequency_penalty: 0.5,
          presence_penalty: 0.0,
          stop: ["You:"],
        }),
      ]);
      const description = openaiResponse.data.choices;
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
