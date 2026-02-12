const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const { company, role, status, location, notes } = req.body;

    const job = await Job.create({
      user: req.user._id, 
      company,
      role,
      status,
      location,
      notes,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};
