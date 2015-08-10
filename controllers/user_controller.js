var users = { admin: {id: 1, username: "admin", password:"7890"},
              enrique: {id: 2, username: "enrique", password: "0987"}
            };

// Comprueba si el usuario está regristado en users
// Si autenticación falla o hay errores se ejecuta callback(error).
exports.autenticar = function(login, password, callback){
  if(users[login]){
    if(password === users[login].password){
      callback(null, users[login]);
    }
    else { callback(new Error('password erróneo.'));}
  } else { callback(new Error('No existe el usuario.'));}
};
