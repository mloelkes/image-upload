const router = require("express").Router()
const Movie = require("../models/Movie")
const { uploader, cloudinary } = require("../config/cloudinary")

/* GET home page */
router.get("/", (req, res, next) => {
  Movie.find()
    .then(movies => {
      res.render("index", { movies })
    })
    .catch(err => {
      next(err)
    })
})

router.get("/movie/add", (req, res, next) => {
  res.render("movie-add")
})

router.post("/movies", uploader.single("poster"), (req, res, next) => {
  console.log(req.file)
  
  const { title, description } = req.body
  const imgName = req.file.originalname
  const imgPath = req.file.path
  const publicId = req.file.filename

  Movie.create({ title, description, imgName, imgPath, publicId })
    .then(movie => {
      console.log(movie)
      res.redirect("/")
    })
    .catch(err => {
      next(err)
    })
})

router.get("/movie/delete/:id", (req, res, next) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(deletedMovie => {
      if (deletedMovie.imgPath) {
        // delete the image on cloudinary
        cloudinary.uploader.destroy(deletedMovie.publicId)
      }
      res.redirect("/")
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
