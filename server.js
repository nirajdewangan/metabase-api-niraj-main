const express = require('express');
var bodyParser = require('body-parser');
const app = express();
var subpath = express();
var cors = require('cors');

// CONTROLLERS
var accuraryCtrl = require('./controllers/accuracy');
var averagePrecisionCtrl = require('./controllers/average-precision');
var classifierPerformanceCtrl = require('./controllers/classifier-performance-overall');
var confusionMatrixCtrl = require('./controllers/confusion-matrix');
var detectionTypesCtrl = require('./controllers/count-detection-types');
var detectionCountNoCtrl = require('./controllers/count-no-of-detections');
var classesCountCtrl = require('./controllers/count-number-of-classes');
var framesCountCtrl = require('./controllers/count-number-of-frames');
var instancesCountCtrl = require('./controllers/count-number-of-instances');
var f1ScoreCtrl = require('./controllers/f1-score');
var precisionCtrl = require('./controllers/precision');
var precisionBucketsCtrl = require('./controllers/precision-buckets');
var recallCtrl = require('./controllers/recall');
var recallBucketsCtrl = require('./controllers/recall-buckets');
var specificityCtrl = require('./controllers/sepecificty');
var youdenIndexCtrl = require('./controllers/youden-index');
var modelCtrl = require('./controllers/getModelData');
var plotFrameCountGraphCtrl = require('./controllers/plotFrameCountGraph');
var plotLabelCountGraphCtrl = require('./controllers/plotLabelCountGraph');
var plotAnamolyCountGraphCtrl = require('./controllers/plotAnamolyCountGraph');
var plotSummaryGraphCtrl = require('./controllers/plotSummaryGraph');
var getAllImageSliderCtrl = require('./controllers/getAllImageSlider');
var getVideoForImageSliderCtrl = require('./controllers/getVideoForImageSlider');




//CORS
app.use(
	cors({
		credentials: true,
		origin: true
	})
);
app.options('*', cors());

// SWAGGER
var subpath = express();
app.use(
	bodyParser.json({
		limit: '50mb'
	})
);
app.use(
	bodyParser.urlencoded({
		limit: '50mb',
		extended: true
	})
);
app.use("/v1", subpath);
var swagger = require('swagger-node-express').createNew(subpath);
app.use(express.static('swagger'));
swagger.setApiInfo({
	title: 'Metabase Query API',
	description: '',
	termsOfServiceUrl: '',
	contact: '',
	license: '',
	licenseUrl: ''
});
// Set api-doc path
swagger.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = 'localhost';
// if (argv.domain !== undefined) domain = argv.domain;
// else
// 	console.log(
// 		'No --domain=xxx specified, taking default hostname "localhost".'
// 	);

// Configure the API port
var port = 3000;
// if (argv.port !== undefined) port = argv.port;
// else console.log('No --port=xxx specified, taking default port ' + port + '.');

// Set and display the application URL
var applicationUrl = 'http://' +  + ':' + port;
swagger.configure(applicationUrl, '1.0.0');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/swagger/index.html');
});
app.use('/api/getAccuracy', accuraryCtrl);
app.use('/api/getAveragePrecision', averagePrecisionCtrl);
app.use('/api/getOverallClassifierPerformance', classifierPerformanceCtrl);
app.use('/api/getConfusionMatrix', confusionMatrixCtrl);
app.use('/api/getDetectionTypes', detectionTypesCtrl);
app.use('/api/getDetectionsCount', detectionCountNoCtrl);
app.use('/api/getClassesCount', classesCountCtrl);
app.use('/api/getFramesCount', framesCountCtrl);
app.use('/api/getInstancesCount', instancesCountCtrl);
app.use('/api/getF1Score', f1ScoreCtrl);
app.use('/api/getPrecision', precisionCtrl);
app.use('/api/getPrecisionBuckets', precisionBucketsCtrl);
app.use('/api/getRecall', recallCtrl);
app.use('/api/getRecallBuckets', recallBucketsCtrl);
app.use('/api/getSpecificity', specificityCtrl);
app.use('/api/getYoudenIndex', youdenIndexCtrl);
app.use('/api/getModelData', modelCtrl);
app.use('/api/plotFrameCountGraph', plotFrameCountGraphCtrl);
app.use('/api/plotLabelCountGraph', plotLabelCountGraphCtrl);
app.use('/api/plotAnamolyCountGraph', plotAnamolyCountGraphCtrl);
app.use('/api/plotSummaryGraph', plotSummaryGraphCtrl);
app.use('/api/getAllImageSlider', getAllImageSliderCtrl);
app.use('/api/getVideoForImageSlider', getVideoForImageSliderCtrl);







app.listen(port, function() {
	console.log(`server running on port ${port}`, '');
});

app.set('view engine', 'ejs');
