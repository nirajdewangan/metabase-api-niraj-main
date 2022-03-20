var express = require('express');
var router = express.Router();
var pool = require('../db/database');


router.get('/', ((req, res, next) => {
	const model_params = req.query['model'] ?req.query['model'].toString().trim():"";
	const model = model_params.replace(/['"]+/g, '');

	const start_time_params = req.query['start_time'] ?req.query['start_time'].toString().trim():"";
	const end_time_params = req.query['end_time'] ?req.query['end_time'].toString().trim():"";
	const current_time_params = req.query['current_time'] ?req.query['current_time'].toString().trim():"";

	const st_time = start_time_params.replace(/['"]+/g, '');
	const end_time = end_time_params.replace(/['"]+/g, '');
	const current_time = current_time_params.replace(/['"]+/g, '');

	// if(!isNaN((model))){
	// 	res.status(400);
	// 	res.send(JSON.stringify({"status": 400, "error": 'Bad Request - Model must contain a valid string', "response": null}));
	// 	next();
	// 	return;	
	// }
    let query;
    if(!model){
        

		query = `SELECT ms.model, FROM_UNIXTIME(TIMESTAMP) as timestamp, health, SUM(needs_retraining) as needs_retraining, SUM(drift) as drift, num_instances, SUM(confidence) as confidence, SUM(mts.data_drift) as data_drift, infer_time
		FROM model_summary ms JOIN model_timeseries_summary mts ON mts.model = ms.model
		JOIN model_uptime_summary mus ON mus.model = ms.model WHERE DATE(FROM_UNIXTIME(TIMESTAMP)) >= "2022-01-09" AND DATE(FROM_UNIXTIME(TIMESTAMP)) <= "2022-01-15" GROUP BY DATE(FROM_UNIXTIME(TIMESTAMP))`;

    }else{
        query = `SELECT DISTINCT * FROM main WHERE model="${model}"`;
		if(st_time && end_time ){
			query = `SELECT DISTINCT * FROM main WHERE model="${model}" && start_time = "${st_time}" and end_time = "${end_time}"`;
		}
		
    }

	console.log(query);

	pool.promise().query(query).then(([rows,fields])=>{
		// rows.map( (item) => {
		// 	item.capture_date = new Date(item.capture_date).getDate();
		// })
       
	let values = {
		model: "",
		timestamp:[],
		health: "",
		needs_training: "",
		drift:"",
		num_instances: "",
		confidence:[],
		data_drift:[],
		infer_time:"",
		day:"",
		uptime:""
	  } 
	
	let count = 0;
	let a = 190;
	  rows.forEach((item,index) => {
		let d = new Date(item.timestamp)
		count++;
		// item.timestamp = d.getFullYear() +'-'+(d.getMonth()+1)+'-'+(d.getDate());
		item.timestamp = d.getDate();
		values.model = item.model;
		values.health = item.health;
		values.needs_training = item.needs_training;
		values.drift = item.drift;
		values.num_instances = item.num_instances;
		values.timestamp = [...values.timestamp, item.timestamp];

		if(index==6){
			a = 168.95;
			values.confidence = [ ...values.confidence, (item.confidence/a)];
			values.data_drift = [...values.data_drift, (item.data_drift)/a];
			values.infer_time = [...values.infer_time, (item.infer_time)/a];		
		} else {
			values.confidence = [ ...values.confidence, (item.confidence/190)];
			values.data_drift = [...values.data_drift, (item.data_drift/190)];
			values.infer_time = [...values.infer_time, (item.infer_time/190)];		
			
		}
		if(index==6){
			values.uptime = [...values.uptime, 168.95];	
		} else {
		 values.uptime = [...values.uptime, 190];
		}

		 values.day = [...values.day, count]
		
	 	})


		res.send(JSON.stringify({"status": 200, "error": null, "response": values}));
    })
	.catch((err)=>{
		
	  console.log(err);
	});
}));
module.exports = router;
