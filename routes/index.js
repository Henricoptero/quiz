var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

// Página inicial
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// GET Página autor
router.get('/author', function(req, res){
  res.render('author');
});

// Definicion de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
