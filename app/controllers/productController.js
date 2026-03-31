const Product = require("../models/product");
const Category = require("../models/category");
const StatusCode = require("../utils/StatusCode");
const fs = require("fs");
const path = require("path");

class productController {
  //Dashboard
  async viewDashboard(req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      return res.render("dashboard", {
        title: "Product Dashboard",
        products,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async viewadminDashboard(req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      return res.render("admin/dashboard", {
        title: "Product admin Dashboard",
        products,
      });
    } catch (err) {
      console.log(err);
    }
  }

  //create category
  async viewcreateCategory(req, res) {
    try {
      return res.render("createCategory", {
        title: "Create Category page",
      });
    } catch (err) {
      console.log(err);
    }
  }

  async viewCategory(req, res) {
    try {
      return res.render("productswith_category", {
        title: "view Category products page",
      });
    } catch (err) {
      console.log(err);
    }
  }

  //Create product Page
  async viewcreateProduct(req, res) {
    try {
      const categories = await Category.find({ isDeleted: false });
      return res.render("create_product", {
        title: "Create Product",
        categories,
      });
    } catch (err) {
      console.log(err);
    }
  }

  //Edit Page
  async vieweditProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);

      if (!product) {
        return res.redirect("/products/dashboard");
      }

      return res.render("edit_product", {
        title: "Edit Product",
        product,
      });
    } catch (err) {
      console.log(err);
    }
  }

  //create category
  async createCategory(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.redirect("/create/category-view");
      }

      //check either category already exists or not
      const existing = await Category.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
      });

      //If exists redirect to product create page
      if (existing) {
        return res.redirect(`/product/create-view`);
      }

      await Category.create({
        name,
      });

      return res.redirect("/product/create-view");
    } catch (err) {
      console.log(err);

      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  //Create Product
  async createProduct(req, res) {
    try {
      const { name, category, description } = req.body;

      if (!name || !description) {
        return res.redirect("/product/create-view");
      }

      if (!req.file) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Product image is required",
        });
      }

      const product = await Product.create({
        name,
        category,
        description,
        image: `uploads/${req.file.filename}`,
      });

      return res.redirect("/products/dashboard");
    } catch (err) {
      console.log(err);

      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getProductsCategoryWise(req, res) {
    try {
      const data = await Product.aggregate([
        {
          $match: { isDeleted: false },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $group: {
            _id: "$category._id",
            categoryName: { $first: "$category.name" },
            products: { $push: "$$ROOT" },
          },
        },
        {
          $sort: { categoryName: 1 },
        },
      ]);

      res.render("productswith_category", { data });
    } catch (err) {
      console.log(err);
    }
  }

  //Get All Products
  async getAllProducts(req, res) {
    try {
      const products = await Product.find();

      return res.status(StatusCode.OK).json({
        success: true,
        message: "All products fetched successfully",
        length: products.length,
        products,
      });
    } catch (err) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  //Update Product
  async updateProduct(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Product id is required",
        });
      }

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      let image = product.image; //keep old image

      //If new image uploaded
      if (req.file) {
        //delete old image
        if (product.image) {
          const oldPath = path.join(__dirname, "..", "public", product.image);

          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        //assign new image
        image = `uploads/${req.file.filename}`;
      }

      await Product.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          category: req.body.category,
          description: req.body.description,
          image,
        },
        { new: true },
      );

      return res.redirect("/products/dashboard");
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // //Delete Product with soft delete
  async deleteProduct(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Product id is required",
        });
      }

      const product = await Product.findById(id);

      if (!product) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
      }

      //Soft delete (mark as deleted)
      product.isDeleted = true;
      await product.save();

      return res.redirect("/products/dashboard");
    } catch (err) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new productController();
