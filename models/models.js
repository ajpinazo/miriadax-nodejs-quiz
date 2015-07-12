var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);
/*
Quiz.hasMany(Comment, {
'constraints': true,
'onUpdate': 'cascade',
'onDelete': 'cascade',
'hooks': true
}); 
*/

exports.Quiz = Quiz; // exportar tabla Quiz
exports.Comment = Comment;

exports.sequelize =sequelize;

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.bulkCreate( 
        [ 
          {pregunta: 'El antonimo de diurno es ...',   respuesta: 'nocturno', tema: 'otro'},
          {pregunta: '¿Que vehiculo se desplaza sobre railes?',   respuesta: 'tren', tema: 'otro'},
          {pregunta: '¿Que dia va despues del sabado?',   respuesta: 'domingo', tema: 'otro'},
          {pregunta: '¿Cual es el oceano mas pequeño',   respuesta: 'El Glaciar Artico', tema: 'humanidades'},
          {pregunta: '¿Que moneda se utiliza en los Estados Unidos de America?',   respuesta: 'dolar', tema: 'humanidades'},
          {pregunta: '¿Cual es el invento mas importante de la Edad de los Metales? La ... ',   respuesta: 'rueda', tema: 'humanidades'},
          {pregunta: '¿De que color es el traje de Batman?',   respuesta: 'negro', tema: 'ocio'},
          {pregunta: '¿Que deporte practica Rafa Nadal?',   respuesta: 'tenis', tema: 'ocio'},
          {pregunta: '¿Donde se practica el waterpolo? En la ... ',   respuesta: 'piscina', tema: 'ocio'},
          {pregunta: '¿Cual es el planeta rojo?',   respuesta: 'Marte', tema: 'ciencia'},
          {pregunta: '¿En que estado se encuentra el agua en las nubes? Estado ... ',   respuesta: 'gaseoso', tema: 'ciencia'},
          {pregunta: 'Las estrellas, planetas y satelites son ...',   respuesta: 'astros', tema: 'ciencia'},
          {pregunta: '¿Quien construyo el primer telescopio?',   respuesta: 'Galileo', tema: 'tecnologia'},
          {pregunta: '¿Quien invento la radio?',   respuesta: 'Marconi', tema: 'tecnologia'},
          {pregunta: '¿Quien invento la bombilla?',   respuesta: 'Edison', tema: 'tecnologia'}
        ]
      ).then(function(){console.log('Base de datos inicializada')});
    };
  });
});