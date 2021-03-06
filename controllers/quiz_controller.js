// Importar el modelo (models.js) para poder acceder a la DB
var models = require('../models/models.js');

// Autoload :id. Factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find({
    where: {id: Number(quizId)},
    include: [{ model: models.Comment}]
  }).then(function(quiz){
    if (quiz){
      req.quiz = quiz;
      next();}
      else{
        next(new Error('No existe quizId=' + quizId)); }
      }
  ).catch(function(error) {next(error);});
};

// GET /quizes && GET /quizes?search=texto_a_buscar
exports.index = function(req, res){
  search = "%"+req.query.search+"%";
  // Si se envia alguna busqueda...
  if(req.query.search){
    // La variable dlm delimita el string contenido en search con % para evitar
    //problemas con los espacios en blanco
    var dlm = (req.query.search || '').replace(" ", "%");

    models.Quiz.findAll({where:["pregunta like ?", search],
                               order:'pregunta ASC'}
    ).then(function(quizes){
            res.render('quizes/index', {quizes: quizes, errors: []});
    }).catch(function(error) {next(error);});
  } else{  // Si no se envia busqueda se renderiza la lista de preguntas normal
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index', {quizes: quizes, errors: []});
   }
  ).catch(function(error) {next(error);});
}
};

// GET /quizes/:id
exports.show = function(req, res){
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto'
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado,
    errors: []});
};

// GET quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build(// crea objeto quiz
    {tema: "Tema", pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  
  if(req.session.user){
    res.render('quizes/new', {quiz: quiz, errors: []});
  } else{
    res.render('sessions/new.ejs', {quiz: quiz, errors: []});
  };
};

// POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build(req.body.quiz);

  quiz.validate().then(function(err) {
    if (err){
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    } else{
      quiz  // guarda en DB los campos pregunta y respuesta de quiz
      .save({fields:["tema", "pregunta", "respuesta"]}).then(function(){
        res.redirect('/quizes')})  // Redirección HTTP /URL relativo
    }                               //a lista de preguntas
   }
  );
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz;  // autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.tema = req.body.quiz.tema;
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz.validate()
  .then(function(err){
    if(err){
      res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
    }
    else{
      req.quiz.save( {fields: ["tema", "pregunta", "respuesta"]})
      .then(function(){res.redirect('/quizes');}); // Redirección HTTP a la lista
    }                                              //de preguntas (URL relativo)
   }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
