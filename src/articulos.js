"use strict";
var articuloId;

const mostrar = (token, word) => {
  if (word != "" && word != null && word != undefined) {
    word = "http://localhost:5500/articulo?word=" + word;
  } else {
    word = "http://localhost:5500/articulo";
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
                          <th>Tipo</th>
                          <th>Código</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Stock</th>
                          <th>Categoria</th>
                          <th>Estado</th>
                          <th></th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
          `;
      for (let i in info.data) {
        template += `<tr>
                      <td>${parseInt(i) + 1}</td>
                      <td>${info.data[i].tipoArticulo}</td>
                      <td>${info.data[i].codigo}</td>
                      <td>${info.data[i].nombre}</td>
                      <td>${info.data[i].descripcion}</td>
                      <td>${info.data[i].stock}</td>
                      <td>${info.data[i].categoria}</td>
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
  const tipo = $("#slTipo").val() || 0;
  const codigo = $("#inputCodigo").val() || "undefined";
  const nombre = $("#inputNombre").val() || "undefined";
  const descripcion = $("#taDescripcion").val() || "undefined";
  const precio = $("#inputPrecio").val() || "undefined";
  const categoria = $("#slCategoria").val() || 0;
  const stock = $("#inputStock").val() || 0

  if (
    tipo != 0 &&
    codigo != "undefined" &&
    nombre != "undefined" &&
    descripcion != "undefined" &&
    precio != "undefined" &&
    categoria != 0 &&
    stock != 0
  ) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("tipoArticuloId", tipo);
    urlencoded.append("codigo", codigo);
    urlencoded.append("nombre", nombre);
    urlencoded.append("descripcion", descripcion);
    urlencoded.append("precio", precio);
    urlencoded.append("categoriaId", categoria);
    urlencoded.append("stock", stock);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch("http://localhost:5500/articulo", requestOptions)
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
          Swal.fire("Bien Hecho!", "Articulo añadido!", "success");
          mostrar(token);
          $("#exampleModal").modal("hide");
        }
      })
      .catch((error) => console.log("error", error));
  }
  else{
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ha ocurrido un error, verifique sus datos!",
    });
  }
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

      fetch("http://localhost:5500/articulo/" + id, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          if (result != "") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ha ocurrido un problema!",
            });
          } else {
            Swal.fire("Bien Hecho!", "Se ha eliminado el articulo!", "success");
            mostrar(token);
          }
        })
        .catch((error) => console.log("error", error));
    }
  });
};

const editar = (id) => {
  articuloId = id;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:5500/articulo/"+id, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const info = JSON.parse(result);
      console.log(info);
      $("#slTipoU").val(info.data[0].tipoArticulo);
      $("#inputCodigoU").val(info.data[0].codigo);
      $("#inputNombreU").val(info.data[0].nombre);
      $("#taDescripcionU").val(info.data[0].descripcion);
      $("#inputPrecioU").val(info.data[0].precio);
      $("#slCategoriaU").val(info.data[0].categoria);
      $("#inputStockU").val(info.data[0].stock);
      $("#exampleModal2").modal("show");
    })
    .catch((error) => console.log("error", error));
};

const selectCategoria = (token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:5500/articulo/categoria", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const info = JSON.parse(result);
      let template = '<option value="0">Seleccione una categoría</option>';
      for (let i in info.data) {
        template += `
                <option value="${info.data[i].id}">${info.data[i].nombre}</option>
            `;
      }
      $("#slCategoria").html(template);
      $("#slCategoriaU").html(template);
    })
    .catch((error) => console.log("error", error));
};

const editarUsuario = () => {
  const tipo = $("#slTipoU").val() || 0;
  const codigo = $("#inputCodigoU").val() || "undefined";
  const nombre = $("#inputNombreU").val() || "undefined";
  const descripcion = $("#taDescripcionU").val() || "undefined";
  const precio = $("#inputPrecioU").val() || "undefined";
  const categoria = $("#slCategoriaU").val() || 0;
  const stock = $("#inputStockU").val() || 0;
  if (
    tipo != 0 &&
    codigo != "undefined" &&
    nombre != "undefined" &&
    descripcion != "undefined" &&
    precio != "undefined" &&
    categoria != 0 &&
    stock != 0
  ) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("tipoArticuloId", tipo);
    urlencoded.append("codigo", codigo);
    urlencoded.append("nombre", nombre);
    urlencoded.append("descripcion", descripcion);
    urlencoded.append("precio", precio);
    urlencoded.append("categoriaId", categoria);
    urlencoded.append("stock", stock);
    
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

    fetch("http://localhost:5500/articulo/"+articuloId, requestOptions)
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
          Swal.fire("Bien Hecho!", "Artículo actualizado!", "success");
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
  selectCategoria(token);
});
