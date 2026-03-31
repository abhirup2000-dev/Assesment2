const multer = require('multer')

const FILE_TYPE_MAP = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/png': 'png',
  'image/avif': 'avif',
  'image/svg': 'svg',
}

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('Invalid image type')
    if(isValid){
      uploadError = null
    }
    cb(uploadError, 'uploads')
  },
  filename: function(req, file, cb){
    const filename = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${filename}-${Date.now()}.${extension}`)
  }
})

const Upload = multer({ storage: storage})

module.exports = Upload