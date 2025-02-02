const FAQ = require("../model/Faq");
const { translateQuestion, translateAnswer } = require("../utils/tranlate");
const redisClient = require("../config/redis");

/**
 * GET /faqs
 * @summary Get all FAQs in the requested language. If the language is not specified, returns FAQs in English.
 * @description Uses Redis caching to improve performance. If the requested language FAQs are cached, returns from Redis. Otherwise, fetches from the database, translates if needed, stores the result in Redis for 2 minutes and updates the database with the translations (not for englist) .
 * @param {string} lang - The language to return the FAQs in. If not specified, defaults to English. Supports all languages.
 * @return {array} - An array of objects containing the question and answer of each FAQ in the requested language.
 * @throws {InternalServerError} - If there is an error fetching the FAQs.
 */
exports.getFaqs = async (req, res) => {
  const { lang } = req.query;
  // Check if FAQs exist in Redis cache
  const cachedFaqs = await redisClient.get(`faqs:${lang || "en"}`);
  if (cachedFaqs) {
    return res.json(JSON.parse(cachedFaqs));
  }

  try {
    const faqs = await FAQ.find();
    let translatedFaqs;
    if (!lang || lang == "en") {
      translatedFaqs = faqs.map((faq) => {
        return { question: faq.question, answer: faq.answer };
      });
    } else {
      translatedFaqs = await Promise.all(
        faqs.map(async (faq) => {
          if (faq.translations && faq.translations[lang]) {
            return faq.translations[lang];
          } else {
            const translatedQuestion = await translateQuestion(faq.question, {
              to: lang,
            });
            const translatedAnswer = await translateAnswer(faq.answer, {
              to: lang,
            });
            if (translatedAnswer != null && translatedQuestion != null) {
              faq.translations[lang] = {
                question: translatedQuestion,
                answer: translatedAnswer,
              };

              const updatedData = await FAQ.updateOne(
                { _id: faq._id },
                { $set: { [`translations.${lang}`]: faq.translations[lang] } }
              );
            } else {
              return { question: faq.question, answer: faq.answer };
            }

            return faq.translations[lang];
          }
        })
      );
    }
    if (lang && lang !== "en") {
      await redisClient.setEx(
        `faqs:${lang || "en"}`,
        120,
        JSON.stringify(translatedFaqs)
      );
    }

    res.json(translatedFaqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * POST /faqs
 * @summary Create a new FAQ with the provided question and answer.
 * @description Accepts a question and answer in the request body and stores it in the database and updates the englist cache of the Redis. Initializes the English translation of the FAQ.
 * @param {Object} req - The request object containing the question and answer in the body.
 * @param {Object} res - The response object used to send the created FAQ or an error message.
 * @return {Object} - The newly created FAQ object, including its ID and translations.
 * @throws {BadRequest} - If the question or answer is missing.
 * @throws {InternalServerError} - If there is an error saving the FAQ.
 */

exports.createFaq = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required." });
  }

  try {
    const faqData = {
      question,
      answer,
      translations: {
        en: {
          question: question,
          answer: answer,
        },
      },
    };

    const newFAQ = new FAQ(faqData);
    await newFAQ.save();

    // updating the default english faq in redis
    let cachedFaqs = await redisClient.get("faqs:en");
    cachedFaqs = cachedFaqs ? JSON.parse(cachedFaqs) : [];
    cachedFaqs.push({ question, answer });
    await redisClient.setEx("faqs:en", -1, JSON.stringify(cachedFaqs));

    res.json(newFAQ);
  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).json({ error: "Failed to add FAQ" });
  }
};
