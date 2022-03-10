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
	const query = `    select recall_buckets, count(recall_buckets) as count from 

    (select *,
          case 
              when 'recall' >= 0 and 'recall' < 0.10    then  0.1 
              when 'recall' >= 0.10 and 'recall' < 0.2 then 0.2
              when 'recall' >= 0.20 and 'recall' < 0.3 then  0.3 
              when 'recall' >= 0.30 and 'recall' < 0.4 then  0.4 
              when 'recall' >= 0.40 and 'recall' < 0.5 then 0.5
              when 'recall' >= 0.50 and 'recall' < 0.6 then  0.6 
              when 'recall' >= 0.60 and 'recall' < 0.7 then  0.7 
              when 'recall' >= 0.70 and 'recall' < 0.8 then 0.8
              when 'recall' >= 0.80 and 'recall' < 0.9 then  0.9 
              when 'recall' >= 0.90 and 'recall' < 2   then  1
          end recall_buckets
       from
          main 
          where "${model}"
          ) vehiclesbyclass group by recall_buckets`;

	pool.promise().query(query).then(([rows,fields])=>{
		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
	  console.log();
	});
}));
module.exports = router;
