const tourDB = [
    {id:01, tourName: 't1', price:100}
]


const getAllTour = (req,res)=>{
    res.json(tourDB)
}

const createTour =  (req,res)=>{
    res.send("tools added")
}

const getSingleTour = (req, res)=>{
    res.send('Single Tour')
}

module.exports = {
    getAllTour,
    createTour,
    getSingleTour
}