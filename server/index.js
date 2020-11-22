require('dotenv').config()

const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer')
const cors = require('cors')


const verifyFileType = require('./middleware/verifyFileType')


const app = express()


app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/uploads'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split('.')

    cb(null, fileName[0] + `-${Date.now()}.${fileName[1]}`)
  }
})

const upload = multer({ storage: storage, fileFilter: verifyFileType.imageFilter}).single('image')


app.post('/upload', (req, res, next) => {
  upload(req, res, err => {
    const file = req.file

    if (req.fileValidationError) return res.send({
        success: false,
        msg: 'Invalid file type.',
        data: null
      });

    if (err instanceof multer.MulterError || err)
      return res.send({
        success: false,
        msg: 'Error occured.',
        data: null
      });

    if (!file) return res.send({
      success: false,
      msg: 'No file.',
      data: null
    })

    const imgFileName = req.file.originalname
    const url = `${process.env.URL}${imgFileName}`

    return res.send({
      success: true,
      msg: 'Saved file.',
      data: {
        fileUrl: url
      }
    })
  })
})


app.get('/', function(req, res) {
  res.json({
    success: true,
    server: 'Smart auction server',
    status: 'Server is live'
  })
})


const port = process.env.NODE_ENV === 'development' ? 5000 : 8000


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  }
)
