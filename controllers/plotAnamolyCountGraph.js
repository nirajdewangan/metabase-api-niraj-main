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
        query = `select a.*,  (isFalsePositiveOne+isFalseNegativeOne) as anomoly from (SELECT  SUM(IF (isFalsePositive=1,1,0)) AS isFalsePositiveOne,SUM(IF (isFalseNegative=1,1,0)) AS isFalseNegativeOne,
		Date(FROM_UNIXTIME(capture_time)) as capture_date
	   FROM main where model_id = 'yoloV3-v0' GROUP BY Date(FROM_UNIXTIME(capture_time))  ORDER BY Date(FROM_UNIXTIME(capture_time)) ASC) as a`;
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
