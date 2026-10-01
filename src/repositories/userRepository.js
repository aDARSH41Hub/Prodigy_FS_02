const User = require("../models/user");

const createUser = async (userData) => {
    return User.create(userData);
};

const findById = async (id) => {
    return User.findById(id).select("-passwordHash");
};

const findByIdWithPassword = async (id) => {
    return User.findById(id).select("+passwordHash");
};

const findByEmail = async (email, includePassword = false) => {
    const query = User.findOne({ email });

    if (includePassword) {
        query.select("+passwordHash");
    } else {
        query.select("-passwordHash");
    }

    return query;
};

const findActiveById = async (id) => {
    return User.findOne({
        _id: id,
        isActive: true,
    }).select("-passwordHash");
};

module.exports = {
    createUser,
    findById,
    findByIdWithPassword,
    findByEmail,
    findActiveById,
};