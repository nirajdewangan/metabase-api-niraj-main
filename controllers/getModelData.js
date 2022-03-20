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
        query = `SELECT
		* , 2*(finalSource.precision*finalSource.recall)/(finalSource.precision+finalSource.recall) AS 'F1_score',
		(finalSource.specificity+finalSource.recall-1) AS 'Youden_Index'
		FROM
		 (
			 SELECT
				 model,
				 source.sumTruePositive / (source.sumTruePositive + source.sumFalsePositive) AS 'precision',
				 source.sumTruePositive /(source.sumTruePositive + source.sumFalseNegative) AS recall,
				 (source.sumTruePositive + source.sumTrueNegative) /(
					 source.sumTruePositive + source.sumFalsePositive + source.sumFalseNegative + source.sumTrueNegative
				 ) AS accuracy,
				 source.sumTrueNegative /(source.sumTrueNegative + source.sumFalsePositive) AS specificity
			 FROM (
					 SELECT model,SUM(isTruePositive) AS sumTruePositive,
						 SUM(isTrueNegative) AS sumTrueNegative,
						 SUM(isFalsePositive) AS sumFalsePositive,
						 SUM(isFalseNegative) AS sumFalseNegative
					 FROM
						 main WHERE model_id="yoloV3-v0") AS SOURCE ) AS finalSource`;
    }else{
        query = `SELECT DISTINCT * FROM main WHERE model="${model}"`;
		if(st_time && end_time ){
			query = `SELECT DISTINCT * FROM main WHERE model="${model}" && start_time = "${st_time}" and end_time = "${end_time}"`;
		}
		
    }

	console.log(query);

	pool.promise().query(query).then(([rows,fields])=>{
		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
		
	  console.log(err);
	});
}));
module.exports = router;
