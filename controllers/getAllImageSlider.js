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

 query = `SELECT GROUP_CONCAT(image_id) as imageids, GROUP_CONCAT(s3image) as images FROM main where model = 'yolov1'  GROUP BY model`;
    }else{
        query = `SELECT GROUP_CONCAT(image_id) as imageids, GROUP_CONCAT(image) as images FROM main where model ="${model}"  GROUP BY model`;
		
		
    }

	console.log(query);

	pool.promise().query(query).then(([rows,fields])=>{
		// rows.map( (item) => {
		// 	item.capture_date = new Date(item.capture_date).getDate();
		// })
		//'https://www.youtube.com/watch?v='+

		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
		
	  console.log(err);
	});
}));
module.exports = router;
