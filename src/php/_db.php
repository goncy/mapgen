<?php
    function crearConexion(){
        //Datos para la conexión con el servidor
        $servidor   = "{{configuracion.base_de_datos.server}}";
        $nombreBD   = "{{configuracion.base_de_datos.database}}";
        $usuario    = "{{configuracion.base_de_datos.user}}";
        $contrasena = "{{configuracion.base_de_datos.password}}";
        //Creando la conexión, nuevo objeto mysqli
        $conexion = new mysqli($servidor,$usuario,$contrasena,$nombreBD);
        $conexion -> set_charset("utf8mb4");
        //Si sucede algún error la función muere e imprimir el error
        if($conexion->connect_error){
            header('HTTP/1.1 500 Internal Server');
            header('Content-Type: application/json; charset=UTF-8');
            die(json_encode(array('message' => 'Error conectando a la base de datos', 'code' => 500)));
        }
        //Si nada sucede retornamos la conexión
        return $conexion;
    }
?>
