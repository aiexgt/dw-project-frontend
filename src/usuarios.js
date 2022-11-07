"use strict";
var usuarioId;

const mostrar = (token, word) => {
  if (word != "" && word != null && word != undefined) {
    word = "http://localhost:3400/usuario?word=" + word;
  } else {
    word = "http://localhost:3400/usuario";
  }
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(word, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const info = JSON.parse(result);
      let estado = "";
      let template = `
              <table class="table table-striped">
                  <thead class="table-dark">
                      <tr>
                          <th>No.</th>
                          <th>Nombre</th>
                          <th>Apellidos</th>
                          <th>Usuario</th>
                          <th>Correo</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th></th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
          `;
      for (let i in info.data) {
        if (info.data[i].estado == 1) {
          template += `
                  <tr>
                  `;
          estado = "Activo";
        } else {
          template += `
              <tr class="table-danger">
              `;
          estado = "Inactivo";
        }
        template += `
                      <td>${parseInt(i) + 1}</td>
                      <td>${info.data[i].nombre}</td>
                      <td>${info.data[i].primerApellido} ${
          info.data[i].segundoApellido
        }</td>
                      <td>${info.data[i].usuario}</td>
                      <td>${info.data[i].correo}</td>
                      <td>${info.data[i].rol}</td>
                      <td>${estado}</td>
                      <td>
                          <button class="btn btn-success" onclick="editar(${
                            info.data[i].id
                          })">Editar</button>
                      </td>
                      <td>
                          <button class="btn btn-danger" onclick="eliminar(${
                            info.data[i].id
                          })">Eliminar</button>
                      </td>
                  </tr>
              `;
      }
      template += `
              </tbody>
          </table>
          `;
      $("#tbContenido").html(template);
    })
    .catch((error) => console.log("error", error));
};

const add = () => {
  const nombre = $("#inputNombre").val() || "undefined";
  const primerApellido = $("#inputPrimerApellido").val() || "undefined";
  const segundoApellido = $("#inputSegundoApellido").val() || null;
  const usuario = $("#inputUsuario").val() || "undefined";
  const password = $("#inputPassword").val() || "undefined";
  const confPassword = $("#inputConfPassword").val() || "undefined";
  const correo = $("#inputCorreo").val() || "undefined";
  const rol = $("#slRol").val() || "undefined";

  if (
    nombre != "undefined" &&
    primerApellido != "undefined" &&
    usuario != "undefined" &&
    password != "undefined" &&
    confPassword != "undefined" &&
    correo != "undefined"
  ) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("nombre", nombre);
    urlencoded.append("primerApellido", primerApellido);
    urlencoded.append("segundoApellido", segundoApellido);
    urlencoded.append("usuario", usuario);
    urlencoded.append("password", password);
    urlencoded.append("confPassword", confPassword);
    urlencoded.append("correo", correo);
    urlencoded.append("rolId", rol);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("http://localhost:3400/usuario", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const info = JSON.parse(result);
        if (result.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ha ocurrido un error, verifique sus datos!",
          });
        } else {
          Swal.fire("Bien Hecho!", "Usuario añadido!", "success");
          mostrar(token);
          $("#exampleModal").modal("hide");
        }
      })
      .catch((error) => console.log("error", error));
  }
};

const selectRol = (token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:3400/usuario/rol", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const info = JSON.parse(result);
      let template = '<option value="0">Seleccione un rol</option>';
      for (let i in info.data) {
        template += `
                  <option value="${info.data[i].id}">${info.data[i].nombre}</option>
              `;
      }
      $("#slRol ").html(template);
      $("#slRolU").html(template);
    })
    .catch((error) => console.log("error", error));
};

const eliminar = (id) => {
  Swal.fire({
    title: "Estas seguro?",
    text: "Este cambio es irreversible!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
  }).then((result) => {
    if (result.isConfirmed) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("http://localhost:3400/usuario/" + id, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          if (result != "") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ha ocurrido un problema!",
            });
          } else {
            Swal.fire("Bien Hecho!", "Se ha eliminado el usuario!", "success");
            mostrar(token);
          }
        })
        .catch((error) => console.log("error", error));
    }
  });
};

const editar = (id) => {
  usuarioId = id;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:3400/usuario/"+id, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const info = JSON.parse(result);
      console.log(info);
      $("#inputNombreU").val(info.data[0].nombre);
      $("#inputPrimerApellidoU").val(info.data[0].primerApellido);
      $("#inputSegundoApellidoU").val(info.data[0].segundoApellido);
      $("#inputUsuarioU").val(info.data[0].usuario);
      $("#inputCorreoU").val(info.data[0].correo);
      $("#slRolU").val(info.data[0].rol);
      $("#slEstadoU").val(info.data[0].estado);
      $("#exampleModal2").modal("show");
    })
    .catch((error) => console.log("error", error));
};

const editarUsuario = () => {
  const nombre = $("#inputNombreU").val() || "undefined";
  const primerApellido = $("#inputPrimerApellidoU").val() || "undefined";
  const segundoApellido = $("#inputSegundoApellidoU").val() || null;
  const usuario = $("#inputUsuarioU").val() || "undefined";
  const password = $("#inputPasswordU").val() || "undefined";
  const confPassword = $("#inputConfPasswordU").val() || "undefined";
  const correo = $("#inputCorreoU").val() || "undefined";
  const rol = $("#slRolU").val() || "undefined";
  const estado = $("#slEstadoU").val() || "undefined";
  if (
    nombre != "undefined" &&
    primerApellido != "undefined" &&
    usuario != "undefined" &&
    correo != "undefined" &&
    estado != "undefined"
  ) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("nombre", nombre);
    urlencoded.append("primerApellido", primerApellido);
    urlencoded.append("segundoApellido", segundoApellido);
    urlencoded.append("usuario", usuario);
    urlencoded.append("password", password);
    urlencoded.append("confPassword", confPassword);
    urlencoded.append("correo", correo);
    urlencoded.append("rolId", rol);
    urlencoded.append("estado", estado);

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

    fetch("http://localhost:3400/usuario/"+usuarioId, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const info = JSON.parse(result);
        if (result.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ha ocurrido un error, verifique sus datos!",
          });
        } else {
          Swal.fire("Bien Hecho!", "Usuario actualizado!", "success");
          mostrar(token);
          $("#exampleModal2").modal("hide");
        }
      })
      .catch((error) => console.log("error", error));
  }
};

const token = localStorage.getItem("tokenDWproject") || "undefined";
if (token == "undefined") {
  window.location = "index.html";
}

$("#btnAddUsuario").click(() => {
  add();
});

$("#btnUpdateUsuario").click(()=> {
    editarUsuario();
})

$(document).ready(() => {
  mostrar(token);
  selectRol(token);
});
