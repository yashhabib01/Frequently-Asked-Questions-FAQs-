const router = require("express").Router();
const { getFaqs, createFaq } = require("../controllers/faqcontroller");

router.post("/", createFaq);
router.get("/", getFaqs);
module.exports = router;
