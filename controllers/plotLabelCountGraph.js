var express = require('express');
var router = express.Router();
var pool = require('../db/database');


router.get('/', ((req, res, next) => {
	const model_params = req.query['model'] ?req.query['model'].toString().trim():"";
	const model = model_params.replace(/['"]+/g, '');

	const start_time_params = req.query['start_time'] ?req.query['start_time'].toString().trim():"";
	const end_time_params = req.query['end_time'] ?req.query['end_time'].toString().trim():"";

	const st_time = start_time_params.replace(/['"]+/g, '');
	const end_time = end_time_params.replace(/['"]+/g, '');

	// if(!isNaN((model))){
	// 	res.status(400);
	// 	res.send(JSON.stringify({"status": 400, "error": 'Bad Request - Model must contain a valid string', "response": null}));
	// 	next();
	// 	return;	
	// }
    let query;
    if(!model){
        // query = `SELECT true_class AS type, capture_date, COUNT(*) as capture_time FROM main WHERE capture_date >= DATE_ADD(CURDATE(),
		//  INTERVAL -5 DAY) GROUP BY true_class, capture_date  ORDER BY capture_date ASC`;

		query = `SELECT true_class AS type, capture_time, Date(FROM_UNIXTIME(capture_time)) as capture_date FROM main WHERE Date(FROM_UNIXTIME(capture_time)) >= '2022-01-09' and Date(FROM_UNIXTIME(capture_time)) <= '2022-01-15' and model_id = 'yoloV3-v0' group by  capture_time`;

		// query = `SELECT true_class AS type, capture_date, COUNT(*) as capture_time FROM main WHERE capture_date >= DATE_ADD(CURDATE(),
		// INTERVAL -5 DAY) GROUP BY true_class, capture_date  ORDER BY capture_date ASC`;

    }else{
        query = `SELECT DISTINCT * FROM main WHERE model="${model}"`;
		if(st_time && end_time ){
			query = `SELECT DISTINCT * FROM main WHERE model="${model}" && start_time = "${st_time}" and end_time = "${end_time}"`;
		}
		
    }

	console.log(query);

	pool.promise().query(query).then(([rows,fields])=>{
		rows.map( (item) => {
			item.capture_date = new Date(item.capture_date).getDate();
		})

		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
		
	  console.log(err);
	});
}));
module.exports = router;
