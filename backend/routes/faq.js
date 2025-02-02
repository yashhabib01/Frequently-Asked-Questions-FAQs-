const router = require("express").Router();
const {
  getFaqs,
  createFaq,
  deleteFaq,
} = require("../controllers/faqcontroller");

router.post("/", createFaq);
router.get("/", getFaqs);
router.delete("/:id", deleteFaq);
module.exports = router;
