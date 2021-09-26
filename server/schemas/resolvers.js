const { AuthenticationError } = require("apollo-server-express");
const { User, Thought } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password");
console.log(userData);
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({
        $or: [{ email: email }],
      });
      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Wrong password!");
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      const bookSave = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $push: { savedBooks: [args.book] } },
        { new: true }
      );
      return bookSave;    
    
    },
    removeBook: async (parent, args, context) => {
      const bookRemove = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: {bookId: args.bookId} } },
        { new: true }
      );
      return bookRemove;
    },
  }, //mutation
  
};

module.exports = resolvers;
