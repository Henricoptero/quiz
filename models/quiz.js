// Definiendo el modelo Quiz

module.exports = function(sequelize, DataTypes){
  return sequelize.define('Quiz',

           {tema: {
              type: DataTypes.STRING
                   },

            pregunta: {
           	   type: DataTypes.STRING,
           	   validate: {notEmpty: {msg: "-> Falta Pregunta"},  //Campo vacio
                          notIn: {args: [["Pregunta"]],  //Campo con value por defecto
                                  msg: "-> Falta Pregunta"
                                 }
                          }
           	          },

            respuesta: {
            	type: DataTypes.STRING,
            	validate: {notEmpty: {msg: "-> Falta Respuesta"},
                         notIn: {args: [["Respuesta"]],
                                 msg: " -> Falta Respuesta"
                                }
                        }
            }
            });
}
