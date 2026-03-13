const Contact = require("../models/contact-model");

const contactForm = async (req, res, next) => {
  try {
    await Contact.create(req.body);
    return res.status(200).json({ message: "message send successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = contactForm;
