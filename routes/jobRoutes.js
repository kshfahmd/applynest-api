const express = require("express");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createJobSchema,
  updateJobSchema,
} = require("../validators/jobValidator");
const router = express.Router();

router.post("/", protect, validate(createJobSchema), createJob);
router.put("/:id", protect, validate(updateJobSchema), updateJob);
router.get("/", protect, getJobs);
router.delete("/:id", protect, deleteJob);

module.exports = router;
