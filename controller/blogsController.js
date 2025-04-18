import { blogsModel } from "../model/blogPostModel.js";
import {
  blogValidator,
  updateBlogValidator,
} from "../validators/blogsValidator.js";
import { blogsCoverPhotoUpload, cloudinary } from "../middleware/upload.js";

//FUNCTION TO CREATE A BLOG

export const createBlog = async (req, res, next) => {
    try {
      console.log("Upload result:", {
        file: req.file,
        body: req.body
      });
  
      // Check for successful upload (both Cloudinary and local variants)
      if (!req.file || (!req.file.secure_url && !req.file.path)) {
        return res.status(400).json({
          success: false,
          message: "Image upload failed. Please check:",
          details: [
            "1. File is an image (jpg, png, webp)",
            "2. Size < 5MB",
            "3. Field name is exactly 'image'"
          ]
        });
      }
  
      // Use whichever URL property exists
      const imageUrl = req.file.secure_url || req.file.path;
  
      const { error, value } = blogValidator.validate({
        ...req.body,
        image: imageUrl
      });
  
      if (error) {
        // Clean up failed upload if it reached Cloudinary
        if (req.file.public_id) {
          await cloudinary.uploader.destroy(req.file.public_id)
            .catch(cleanupErr => console.error("Cleanup failed:", cleanupErr));
        }
        
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map(err => ({
            field: err.path[0],
            message: err.message
          }))
        });
      }
  
      const post = await blogsModel.create({
        ...value,
        author: req.auth.id,
        imagePublicId: req.file.public_id // Store for future management
      });
  
      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: {
          id: post._id,
          title: post.title,
          image: post.image,
          createdAt: post.createdAt
        }
      });
  
    } catch (error) {
      console.error("Server error:", error);
      
      // Clean up any uploaded file if error occurs
      if (req.file?.public_id) {
        await cloudinary.uploader.destroy(req.file.public_id)
          .catch(cleanupErr => console.error("Cleanup failed:", cleanupErr));
      }
  
      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(409).json({
          success: false,
          message: `${field} already exists`,
          field: field
        });
      }
  
      // Handle validation errors from Mongoose
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
  
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors
        });
      }
      
      next(error);
    }
  };



//FUNCTION TO GET ALL BLOGS

export const getBlogs = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}" } = req.query;
    const result = await blogsModel
      .find(JSON.parse(filter))
      .sort(JSON.parse(sort));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// FUNCTION TO GET AUTHOR'S BLOGS
export const getAuthorBlogs = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}" } = req.query;

    // Create query object
    const query = {
      author: req.auth.id,
    };

    // Find blogs with optional filtering and sorting
    const blogs = await blogsModel
      .find({ ...query, ...JSON.parse(filter) })
      .sort(JSON.parse(sort));

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching author blogs:", error);
    next(error);
  }
};

//GET ONE BLOG
export const getBlog = async (req, res, next) => {
  try {
    const blog = await blogsModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json("Blog not found");
    }

    return res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

//UPDATE BLOG
export const updateBlog = async (req, res, next) => {
  try {
    // 1. Find the blog
    const blog = await blogsModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // 2. Verify authorization
    const isAuthor = blog.author.equals(req.auth.id);
    const isAdmin = req.auth.role === "admin";
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the author or admin can update this post",
      });
    }

    // 3. Prepare update data
    const updateData = { ...req.body };
    let oldImagePublicId = null;

    // 4. Handle image if uploaded
    if (req.file) {
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.image = result.secure_url;

      // Store old image public ID for cleanup
      if (blog.image) {
        const urlParts = blog.image.split("/");
        oldImagePublicId = urlParts.slice(-2).join("/").split(".")[0];
      }
    }

    // 5. Validate input
    const { error, value } = updateBlogValidator.validate(updateData);
    if (error) {
      // Clean up newly uploaded image if validation fails
      if (req.file) {
        await cloudinary.uploader.destroy(
          updateData.image.split("/").slice(-2).join("/").split(".")[0]
        );
      }
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    // 6. Update the blog
    const updatedBlog = await blogsModel.findByIdAndUpdate(
      req.params.id,
      {
        ...value,
        updatedAt: new Date(),
      },
      { new: true }
    );

    // 7. Clean up old image after successful update
    if (oldImagePublicId) {
      try {
        await cloudinary.uploader.destroy(oldImagePublicId);
      } catch (err) {
        console.error("Failed to delete old image:", err);
      }
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Update error:", error);

    // Clean up any uploaded files if error occurred
    if (req.file) {
      try {
        const publicId = req.file.filename.split(".")[0];
        await cloudinary.uploader.destroy(`pVault/blogs/pictures/${publicId}`);
      } catch (cleanupError) {
        console.error("Image cleanup failed:", cleanupError);
      }
    }

    next(error);
  }
};

//DELETE BLOG

export const deleteBlog = async (req, res, next) => {
  try {
    // 1. Find the specific blog
    const blog = await blogsModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // 2. Strict authorization check
    const isOriginalAuthor = blog.author.equals(req.auth.id); // Exact match check
    const isAdmin = req.auth.role === "admin"; // Role verification

    if (!isOriginalAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: Only the original author or admin can delete this post",
      });
    }

    // 3. Delete with additional verification
    const deletedBlog = await blogsModel.findOneAndDelete({
      _id: req.params.id,
      $or: [
        { author: req.auth.id }, // Original author condition
        {
          /* Admin condition handled by middleware */
        },
      ],
    });

    if (!deletedBlog) {
      return res.status(403).json({
        success: false,
        message: "Delete failed: Authorization revoked during operation",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog permanently deleted",
      data: {
        id: req.params.id,
        title: blog.title,
      },
    });
  } catch (error) {
    console.error("Delete Operation Failed:", error);
    next(error);
  }
};
