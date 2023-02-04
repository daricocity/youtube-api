const List = require('../models/List');
const router = require('express').Router();
const {verifyTokenAndAdmin, verifyToken}= require('./verifyToken');

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedList = await List.findByIdAndUpdate(
            req.params.id, 
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(updatedList);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newList = new List(req.body)
    try {
        const savedList = await newList.save();
        res.status(201).json(savedList);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await List.findByIdAndDelete(req.params.id);
        res.status(200).json('Movie has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET LIST
router.get('/', verifyToken, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    {$sample: {size:100}},
                    {$match: {type: typeQuery, genre: genreQuery}}
                ]);
            } else {
                list = await List.aggregate([
                    {$sample: {size:100}},
                    {$match: {type: typeQuery}}
                ]);
            }
        } else {
            list = await List.aggregate([
                {$sample: {size:100}}
            ]);
        }
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
