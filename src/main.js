"use strict";

//* Componentes
const btnInicioSesion = $("#btnInicioSesion");

//* Funciones
const login = async (user, pass) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("usuario", user);
  urlencoded.append("password", pass);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  const peticion = await fetch(
    "http://34.125.111.145:5500/usuario/login",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      return JSON.parse(result);
    })
    .catch((error) => {
      return error;
    });
  return peticion;
};

//* Eventos
btnInicioSesion.click(async (e) => {
  e.preventDefault();
  const user = $("#user").val() || "undefined";
  const pass = $("#pass").val() || "undefined";

  if (user == "undefined" && pass == "undefined") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debe ingresar usuario y contraseña!",
    });
  } else if (user == "undefined") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debe ingresar usuario!",
    });
  } else if (pass == "undefined") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debe ingresar contraseña!",
    });
  } else {
    const respuesta = await login(user, pass);
    if (respuesta.error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Credenciales incorrectas!",
      });
    }else if (respuesta.token){
        localStorage.setItem('tokenDWproject', respuesta.token);
        window.location = 'dashboard.html';
    }
  }
});

$(".input100").each(function () {
  $(this).on("blur", function () {
    if ($(this).val().trim() != "") {
      $(this).addClass("has-val");
    } else {
      $(this).removeClass("has-val");
    }
  });
});
