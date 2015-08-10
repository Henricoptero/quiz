// Construir base de datos con el modelo Quiz.js importado

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar mapeador (sequelize)
var Sequelize = require('sequelize');

// Usar manejador de base de datos(DB) SQLite o postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  {dialect:  protocol,
   protocol: protocol,
   port:     port,
   host:     host,
   storage:  storage,  // Solo SQLite (.env)
   omitNull: true      // Solo Postgres
  }
);

// Importar la definición de la tabla Quiz
var quiz_path= path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

// Construir relación entre tablas
Comment.belongsTo(Quiz);  //Varios comentarios para un solo Quiz
Quiz.hasMany(Comment);  //Un solo Quiz para varios comentarios

// Exportar definición de tablas Quiz y Comment
exports.Quiz = Quiz;
exports.Comment = Comment;

// Crear e inicializar tabla en DB con sequelize.sync()
sequelize.sync().then(function(){
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    if(count===0){  // La tabla se inicializa solo si está vacia
      Quiz.create({tema: 'humanidades', pregunta: 'Capital de Italia', respuesta: 'Roma'});
      Quiz.create({tema: 'humanidades', pregunta: 'Capital de Portugal', respuesta: 'Lisboa'})
      Quiz.create({tema: 'humanidades', pregunta: 'Capital de Suecia', respuesta: 'Estocolmo'})
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});
