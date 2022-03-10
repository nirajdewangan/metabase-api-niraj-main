var express = require('express');
var router = express.Router();
var pool = require('../db/database');


router.get('/', ((req, res, next) => {
	const params = req.query['model'] ?req.query['model'].toString().trim():"";
	const model = params.replace(/['"]+/g, '');

	if(!model || !isNaN((model))){
		res.status(400);
		res.send(JSON.stringify({"status": 400, "error": 'Bad Request - Model must contain a valid string', "response": null}));
		next();
		return;	
	}
	const query = `select true_class as "Actual Class <-> Predicted Class",
            sum(bicycle) as bicycle,
            sum(bus) as bus,
            sum(car) as car,
            sum(motorbike) as motorbike,
            sum(none) as none,
            sum(person) as person,
            sum(truck) as truck
        from confusion_matrix
        where "${model}"
        group by true_class;
        `

	pool.promise().query(query).then(([rows,fields])=>{
		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
	  console.log();
	});
}));
module.exports = router;
