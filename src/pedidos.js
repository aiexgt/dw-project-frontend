"use strict";

var pedidoId;

const mostrar = (token, word) => {
  if (word != "" && word != null && word != undefined) {
    word = "http://localhost:5500/pedido?word=" + word;
  } else {
    word = "http://localhost:5500/pedido";
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
      let template = `
            <table class="table table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>No.</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Dirección</th>
                        <th>Tipo Pago</th>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
        `;
      for (let i in info.data) {
        if (info.data[i].estadoPedidoId == 1) {
          template += `
                <tr class="table-warning">
                `;
        } else if (info.data[i].estadoPedidoId == 6) {
          template += `
                <tr class="table-danger">
                `;
        } else {
          template += `
            <tr>
            `;
        }
        template += `
                    <td>${parseInt(i) + 1}</td>
                    <td>${info.data[i].clienteNombre}</td>
                    <td>${new Date(info.data[i].fecha).toLocaleString()}</td>
                    <td>${info.data[i].direccionEntrega}</td>
                    <td>${info.data[i].tipoPagoNombre}</td>
                    <td>${info.data[i].usuarioNombre}</td>
                    <td>${info.data[i].estadoPedidoNombre}</td>
                    <td>
                        <button class="btn btn-success" onclick="editar(${
                          info.data[i].id
                        }, ${info.data[i].estadoPedidoId})">Editar</button>
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

const buscar = () => {
  const word = $("#inputBuscar").val() || "undefined";
  if (word != "undefined") {
    mostrar(token, word);
  } else {
    mostrar(token);
  }
  $("#inputBuscar").val("");
};

const selectCliente = () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:5500/cliente", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const info = JSON.parse(result);
      let template = '<option value="0">Seleccione un cliente</option>';
      for (let i in info.data) {
        template += `
                <option value="${info.data[i].id}">${info.data[i].nit} - ${info.data[i].nombre} ${info.data[i].primerApellido}</option>
            `;
      }
      $("#slCliente").html(template);
    })
    .catch((error) => console.log("error", error));
};

const addCliente = () => {
  const nombre = $("#inputNombre").val();
  const primerApellido = $("#inputPrimerApellido").val();
  const segundoApellido = $("#inputSegundoApellido").val();
  const nit = $("#inputNit").val();
  const numeroPrincipal = $("inputNumeroPrincipal").val();
  const correo = $("#inputCorreo").val();
  const direccion = $("#inputDireccion").val();
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("nombre", nombre);
  urlencoded.append("primerApellido", primerApellido);
  urlencoded.append("segundoApellido", segundoApellido);
  urlencoded.append("nit", nit);
  urlencoded.append("numeroPrincipal", numeroPrincipal);
  urlencoded.append("correo", correo);
  urlencoded.append("direccion", direccion);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  fetch("http://localhost:5500/cliente", requestOptions)
    .then((response) => response.text())
    .then(async (result) => {
      const info = JSON.parse(result);
      if (result.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ha ocurrido un error, verifique sus datos!",
        });
      } else {
        Swal.fire("Bien Hecho!", "Cliente Añadido!", "success");
        $("#addCliente").modal("hide");
        selectCliente();
        $("#slCliente").val(info.id);
        $("#exampleModal").modal("show");
      }
    })
    .catch((error) => console.log("error", error));
};

const editar = (id, estado) => {
  pedidoId = id;
  $("#editarPedidoModal").modal("show");
  $("#slEstadoPedido").val(estado);
};

const addPedido = () => {
  const cliente = $("#slCliente").val();
  const direccion = $("#inputDireccionEntrega").val();
  const tipoPago = $("#slTipoPago").val();
  const observacion = $("#taObservacion").val();

  if (cliente != 0 && direccion != "" && tipoPago != 0) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("clienteId", cliente);
    urlencoded.append("direccion", direccion);
    urlencoded.append("tipoPagoId", tipoPago);
    urlencoded.append("observacion", observacion);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("http://localhost:5500/pedido", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const info = JSON.parse(result);
        if (info.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ha ocurrido un problema!",
          });
        } else {
          $("#exampleModal").modal("hide");
          Swal.fire("Bien Hecho!", "Se ha añadido el pedido!", "success");
          mostrar(token);
        }
      })
      .catch((error) => console.log("error", error));
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ha ocurrido un problema, revisa los datos!",
    });
  }
};

const cambiarEstado = () => {
  const estado = $("#slEstadoPedido").val();
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("estado", estado);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  fetch("http://localhost:5500/pedido/" + pedidoId, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const info = JSON.parse(result);
      if (info.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ha ocurrido un problema!",
        });
      } else {
        $("#editarPedidoModal").modal("hide");
        Swal.fire("Bien Hecho!", "Se ha eliminado el pedido!", "success");
        mostrar(token);
      }
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
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("http://localhost:5500/pedido/" + id, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const info = JSON.parse(result);
          if (info.error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ha ocurrido un problema!",
            });
          } else {
            Swal.fire("Bien Hecho!", "Se ha eliminado el pedido!", "success");
            mostrar(token);
          }
        })
        .catch((error) => console.log("error", error));
    }
  });
};

const token = localStorage.getItem("tokenDWproject") || "undefined";
if (token == "undefined") {
  window.location = "index.html";
}

$("#btnBuscar").click(() => {
  buscar();
});

$("#inputBuscar").keypress(function (event) {
  if (event.keyCode === 13) {
    buscar();
  }
});

$("#btnGuardarCliente").click(() => {
  addCliente();
});

$("#btnEditar").click(() => {
  cambiarEstado();
});

$("#btnGenerarPedido").click(() => {
    addPedido();
})

$(document).ready(() => {
  mostrar(token);
  selectCliente(token);
});
