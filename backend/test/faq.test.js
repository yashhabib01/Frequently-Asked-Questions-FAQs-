const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Import your Express app
const FAQ = require("../model/Faq");
const redisClient = require("../config/redis");

const { expect } = chai;
chai.use(chaiHttp);

describe("FAQ API Tests", () => {
  before(async () => {
    // Clear Redis before tests
    await redisClient.flushDb();
  });

  after(async () => {
    // Cleanup Redis after tests
    await redisClient.quit();
  });

  describe("GET /faqs", () => {
    it("should fetch FAQs in default (English) language", async () => {
      const res = await chai.request(app).get("/api/faqs");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });

    it("should fetch FAQs in Spanish (translated)", async () => {
      const res = await chai.request(app).get("/api/faqs?lang=es");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0]).to.have.property("question");
      expect(res.body[0]).to.have.property("answer");
    });
  });

  describe("POST /faqs", () => {
    it("should create a new FAQ", async () => {
      const newFaq = {
        question: "What is Node.js?",
        answer: "A JavaScript runtime.",
      };
      const res = await chai.request(app).post("/api/faqs").send(newFaq);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("_id");
      expect(res.body.question).to.equal(newFaq.question);
      expect(res.body.answer).to.equal(newFaq.answer);
    });

    it("should return 400 if question or answer is missing", async () => {
      const res = await chai
        .request(app)
        .post("/api/faqs")
        .send({ question: "Missing answer?" });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });
  });
});
