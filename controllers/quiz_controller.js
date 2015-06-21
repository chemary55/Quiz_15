var models = require('../models/models.js');

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req,res,next,quizId){
	models.Quiz.findById(req.params.quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else {next(new Error('No existe quizId='+quizIdz));}
		}
		).catch(function(error){next(error);});
};

//GET /quizes/ :search
exports.index = function(req,res){
	if(req.query.search){
		var search = req.query.search.replace(/\s/g,"%");
		models.Quiz.findAll({where:["pregunta like ?",'\%'+search+'\%']}).then(function(quizes){
			res.render('quizes/index',{quizes:quizes, errors: []});
		}).catch(function(error){next(error);})
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index',{quizes:quizes, errors: []});
		}).catch(function(error){next(error);})
	}
};


//GET /quizes/:id
exports.show = function(req,res){
	res.render('quizes/show', {quiz:req.quiz, errors: []});
};


//GET /quizes/:id/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(  //crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req,res){
	var quiz = models.Quiz.build( req.body.quiz);
	// guarda en DB los campos pregunta y respuesta de quiz
		quiz
		.validate()
		.then(
			function(err){
				res.render('quizes/new', {quiz:quiz, errors: err.errors});
			} else {
			    quiz // save: guarda en DB campos pregunta y respuesta
			    .save({fields:["pregunta","respuesta" ]})
			    .then( function(){ res.redirect('/quizes')})	
			}
		}
	);
};




//GET /author
exports.author = function(req,res){
	res.render('author');
};