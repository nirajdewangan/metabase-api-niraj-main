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
	const query = `select precision_buckets, count(precision_buckets) as count from 

    (select *,
          case 
              when 'precision' >= 0 and 'precision' < 0.10    then  1 
              when 'precision' >= 0.10 and 'precision' < 0.2 then 2
              when 'precision' >= 0.20 and 'precision' < 0.3 then  3 
              when 'precision' >= 0.30 and 'precision' < 0.4 then  4 
              when 'precision' >= 0.40 and 'precision' < 0.5 then 5
              when 'precision' >= 0.50 and 'precision' < 0.6 then  6 
              when 'precision' >= 0.60 and 'precision' < 0.7 then  7 
              when 'precision' >= 0.70 and 'precision' < 0.8 then 8
              when 'precision' >= 0.80 and 'precision' < 0.9 then  9 
              when 'precision' >= 0.90 and 'precision' < 2   then  10
          end precision_buckets
       from
          main 
          where  "${model}"
          ) vehiclesbyclass group by precision_buckets`;

	pool.promise().query(query).then(([rows,fields])=>{
		res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    })
	.catch((err)=>{
	  console.log();
	});
}));
module.exports = router;
