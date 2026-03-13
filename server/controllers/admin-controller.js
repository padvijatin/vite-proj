const User = require("../models/user-models");
const Contact = require("../models/contact-model");
const Service = require("../models/service-model");

const getAllusers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");

    return res.status(200).json({
      message: users.length ? "Users fetched successfully" : "No users found",
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({});

    return res.status(200).json({
      message: contacts.length ? "Contacts fetched successfully" : "No contacts found",
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({});

    return res.status(200).json({
      message: services.length ? "Services fetched successfully" : "No services found",
      services,
    });
  } catch (error) {
    next(error);
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, message } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.username = username?.trim() || contact.username;
    contact.email = email?.trim().toLowerCase() || contact.email;
    contact.message = message?.trim() || contact.message;

    await contact.save();

    return res.status(200).json({
      message: "Contact updated successfully",
      contact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { service, provider, price, description } = req.body;

    const serviceRecord = await Service.findById(id);
    if (!serviceRecord) {
      return res.status(404).json({ message: "Service not found" });
    }

    serviceRecord.service = service?.trim() || serviceRecord.service;
    serviceRecord.provider = provider?.trim() || serviceRecord.provider;
    serviceRecord.price = price?.trim() || serviceRecord.price;
    serviceRecord.description = description?.trim() || serviceRecord.description;

    await serviceRecord.save();

    return res.status(200).json({
      message: "Service updated successfully",
      service: serviceRecord,
    });
  } catch (error) {
    next(error);
  }
};

const deleteServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const serviceRecord = await Service.findByIdAndDelete(id);
    if (!serviceRecord) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, phone, isAdmin } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      user.email = email.trim().toLowerCase();
    }

    user.username = username ?? user.username;
    user.phone = phone ?? user.phone;
    if (typeof isAdmin === "boolean") {
      user.isAdmin = isAdmin;
    }

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllusers,
  getAllContacts,
  getAllServices,
  updateUserById,
  deleteUserById,
  updateContactById,
  deleteContactById,
  updateServiceById,
  deleteServiceById,
};
