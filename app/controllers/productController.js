// const Product = require("../models/product");
// const StatusCode = require("../utils/StatusCode");
// const fs = require("fs");
// const path = require('path')

// class productController {
//   async viewDashboard(req, res) {
//     try {
//       const products = await Product.find();
//       return res.render("dashboard", {
//         title: "Welcome to Dashboard page",
//         products,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async viewcreateProduct(req, res) {
//     try {
//       return res.render("create_product", {
//         title: "Welcome to Product create page",
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async vieweditProduct(req, res) {
//     try {
//       const id = req.params.id;
//       const product = await Product.findById(id);
//       return res.render("edit_product", {
//         title: "Welcome to Edit product page",
//         product,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   async createProduct(req, res) {
//     try {
//       const { name, category, description } = req.body;

//       //require fields
//       if (!name || !category || !description) {
//         return res.status(StatusCode.BAD_REQUEST).json({
//           success: false,
//           message: "All fields are required",
//         });
//       }

//       //Handle image (from multer)
//       if (!req.file) {
//         return res.status(StatusCode.BAD_REQUEST).json({
//           success: false,
//           message: "Product image is required",
//         });
//       }

//       //Create product object
//       const product = await Product.create({
//         name,
//         category,
//         description,
//         image: req.file.path, // multer file path
//       });

//       return res.redirect("/products/dashboard");
//       // return res.status(StatusCode.CREATED).json({
//       //   success: true,
//       //   message: "Product created successfully",
//       //   product,
//       // });
//     } catch (err) {
//       console.log(err);

//       return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }

//   async getAllProducts(req, res) {
//     try {
//       const products = await Product.find();

//       return res.status(StatusCode.OK).json({
//         success: true,
//         message: "All products fetched successfully",
//         length: products.length,
//         products,
//       });
//     } catch (err) {
//       return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }

//   async updateProduct(req, res) {
//     try {
//       const id = req.params.id;

//       if (!id) {
//         return res.status(400).json({
//           success: false,
//           message: "Product id is required",
//         });
//       }

//       const product = await Product.findById(id);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }

//       //Only update image if new file uploaded
//       if (req.file) {

//           if (fs.existsSync(product.image)) {
//             fs.unlinkSync(product.image);
//           }
//         }

//       }

//       //update product
//       await Product.findByIdAndUpdate(
//         id,
//         {
//           name: req.body.name,
//           category: req.body.category,
//           description: req.body.description,
//           image,
//         },
//         { new: true },
//       );

//       return res.redirect("/products/dashboard");
//     } catch (err) {
//       return res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }

//   async deleteProduct(req, res) {
//     try {
//       const id = req.params.id;

//       if (!id) {
//         return res.status(StatusCode.BAD_REQUEST).json({
//           success: false,
//           message: "Product id is required",
//         });
//       }

//       const product = await Product.findById(id);

//       if (!product) {
//         return res.status(StatusCode.NOT_FOUND).json({
//           success: false,
//           message: "Product not found",
//         });
//       }

//       //Delete image from local storage
//       if (product.image) {
//         if (fs.existsSync(product.image)) {
//           fs.unlinkSync(product.image);
//         }
//       }

//       //Delete product data
//       await Product.findByIdAndDelete(id);

//       return res.redirect("/products/dashboard");
//       // return res.status(StatusCode.OK).json({
//       //   success: true,
//       //   message: "Product deleted successfully",
//       // });
//     } catch (err) {
//       return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }
// }

// module.exports = new productController();

const Product = require("../models/product");
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

  //Create product Page
  async viewcreateProduct(req, res) {
    try {
      return res.render("create_product", {
        title: "Create Product",
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

  //Create Product
  async createProduct(req, res) {
    try {
      const { name, category, description } = req.body;

      if (!name || !category || !description) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
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
        { new: true }
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
  // async deleteProduct(req, res) {
  //   try {
  //     const id = req.params.id;

  //     if (!id) {
  //       return res.status(StatusCode.BAD_REQUEST).json({
  //         success: false,
  //         message: "Product id is required",
  //       });
  //     }

  //     const product = await Product.findById(id);

  //     if (!product) {
  //       return res.status(StatusCode.NOT_FOUND).json({
  //         success: false,
  //         message: "Product not found",
  //       });
  //     }

  //     //delete image
  //     if (product.image) {
  //       const filePath = product.image

  //       if (fs.existsSync(filePath)) {
  //         fs.unlinkSync(filePath);
  //       }
  //     }

  //     await product.isDeleted === true

  //     // await Product.findByIdAndDelete(id);

  //     return res.redirect("/products/dashboard");

  //   } catch (err) {
  //     return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // }

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
