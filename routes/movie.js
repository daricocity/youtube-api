const Movie = require('../models/Movie');
const router = require('express').Router();
const {verifyTokenAndAdmin, verifyToken}= require('./verifyToken');

// CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newMovie = new Movie(req.body)
    try {
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(updatedMovie)
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json('Movie has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET
router.get('/find/:id', verifyToken, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET RANDOM
router.get('/random', verifyToken, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if(type === 'series'){
            movie = await Movie.aggregate([
                {$match: {isSeries: true}},
                {$sample: {size: 1}}
            ]);
        } else {
            movie = await Movie.aggregate([
                {$match: {isSeries: false}},
                {$sample: {size: 1}}
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;