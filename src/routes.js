import Vehiculos from "views/examples/VehiculosLista";
import VehiculosCrear from "views/examples/VehiculosCrear";
import VehiculosEditar from "views/examples/VehiculosEditar";
import Login from "views/examples/Login.js";

var routes = [
  {
    path: "/vehiculos",
    name: "Vehículos",
    icon: "ni ni-bullet-list-67 text-orange",
    component: Vehiculos,
    layout: "/admin",
  },
  {
    path: "/vehiculos-crear",
    name: "Vehículos Crear",
    icon: "ni ni-bullet-list-67 text-orange",
    component: VehiculosCrear,
    layout: "/admin",
  },
  {
    path: "/vehiculos-editar/:id",
    name: "Vehículos Editar",
    icon: "ni ni-bullet-list-67 text-orange",
    component: VehiculosEditar,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
];
export default routes;
