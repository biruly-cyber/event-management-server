const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  category: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  feedback: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: String,
      rating: Number,
    },
  ],
  images: [
    {
      url: String,
      path: String,
      type: String,
      verified: Boolean,
    },
  ],
  videos: [
    {
      url: String,
      path: String,
      type: String,
      verified: Boolean,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BlogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Blog = mongoose.model("Blog", BlogSchema);
