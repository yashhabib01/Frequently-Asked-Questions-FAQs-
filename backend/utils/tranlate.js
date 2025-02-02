const cheerio = require("cheerio");
const googleTranslate = require("@iamtraction/google-translate");

/**
 * Translates the given answer text into the specified language while preserving rich text formatting.
 *
 * @async
 * @function translateAnswer
 * @param {string} text - The answer text in rich text format (HTML).
 * @param {Object} options - Translation options.
 * @param {string} options.to - The target language code (e.g., 'es' for Spanish).
 *
 * @returns {Promise<string|null>} - Returns the translated answer in rich text format, or null if an error occurs.
 *
 */

exports.translateAnswer = async (text, { to }) => {
  const $ = cheerio.load(text);
  try {
    const textNodes = [];

    $("body *")
      .contents()
      .each(function () {
        if (this.type === "text" && this.data.trim() !== "") {
          textNodes.push(this);
        }
      });

    await Promise.all(
      textNodes.map(async (node) => {
        try {
          const result = await googleTranslate(node.data.trim(), { to });
          node.data = result.text;
        } catch (error) {
          console.error("Translation Error:", error);
        }
      })
    );

    return $.html();
  } catch (error) {
    console.error("Translation Error:", error);
    return null;
  }
};

/**
 * Translates the given question text into the specified language.
 *
 * @async
 * @function translateQuestion
 * @param {string} text - The question text.
 * @param {Object} options - Translation options.
 * @param {string} options.to - The target language code (e.g., 'es' for Spanish).
 * @returns {Promise<string|null>} - Returns the translated answer in rich text format, or null if an error occurs.
 */
exports.translateQuestion = async (text, { to }) => {
  try {
    const result = await googleTranslate(text, { to });
    return result.text;
  } catch (error) {
    console.error("Translation Error:", error);
    return null;
  }
};
