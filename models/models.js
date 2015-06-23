var path = require('path');

//Postgres DATABASE_URL = postgres://user:password@host:port/database
//SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite
/*var sequelize = new Sequelize(null,null,null,
  {dialect:"sqlite",storage:"quiz.sqlite"}
  );*/
var sequelize = new Sequelize(DB_name, user,pwd,{
  dialect:  protocol, 
  protocol: protocol,
  port:     port,
  host:     host,
  storage:  storage, //Solo para SQlite (.env)
  omitNull: true    //Solo postgres
});


//Importar la definicion de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);
// relacion entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Exportar la definicion de tabla Quiz
exports.Quiz = Quiz;
//Exportar la definicion de tabla comment
exports.Comment = Comment;

//sequelize.sync() crea e inicializa una tabla de preguntas en BD
sequelize.sync().then(function(){
  //success (..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    if(count ===0){
      //la tabla se inicializa si esta vacia
      Quiz.create({   pregunta: 'Capital de Italia',
                      respuesta: 'Roma',
                      tematica: 'Geografia'
            });
      Quiz.create({   pregunta: 'Capital de Portugal',
                      respuesta: 'Lisboa',
                      tematica: 'Geografia'
            })
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});      