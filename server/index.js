require('dotenv').config()

const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer')


const app = express()


app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/uploads'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


app.post('/upload', upload.single('image'), (req, res, next) => {
  const file = req.file

  if (!file) return res.send({
    success: false,
    msg: 'No file.',
    data: null
  })

  const imgFileName = req.file.originalname
  const url = `${process.env.URL}/uploads/${imgFileName}`
  console.log(process.env.URL)

  return res.send({
    success: true,
    msg: 'Saved file.',
    data: {
      fileUrl: url
    }
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
