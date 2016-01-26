<?php
    function crearConexion(){
        //Datos para la conexión con el servidor
        $servidor   = "107.180.2.73";
        $nombreBD   = "gpozzo-mapa";
        $usuario    = "gpozzo-admin";
        $contrasena = "Gonzalo1";
        //Creando la conexión, nuevo objeto mysqli
        $conexion = new mysqli($servidor,$usuario,$contrasena,$nombreBD);
        //Si sucede algún error la función muere e imprimir el error
        if($conexion->connect_error){
            die("Error en la conexion : ".$conexion->connect_errno.
                                      "-".$conexion->connect_error);
        }
        //Si nada sucede retornamos la conexión
        return $conexion;
    }
?>

<?php
	include "_db.php";
	$con = crearConexion();

	if ($con->connect_error) {
	    die("Connection failed: " . $con->connect_error);
	}

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$action = $_POST['action'];

	if ($action === "get_markers") {

		$consulta = "SELECT * FROM markers WHERE solucionado = 0 AND id > 1";
		$result = mysqli_query($con, $consulta);

		$row_container = array();

		//Validamos si el nombre del administrador existe en la base de datos o es correcto
		while($row = mysqli_fetch_array($result)){
			array_push($row_container, $row);
		}

		$row_container = json_encode($row_container);
		echo $row_container;
	} else if ($action === "push_markers") {

		$arrayMarkers = $_POST['markers'];
		if (count($arrayMarkers)>=10){
			print "false";
			return;
		}

		$stmt = $con->prepare("INSERT INTO markers (lat, lng, tipo, texto) VALUES (?, ?, ?, ?)");

		foreach($arrayMarkers as $key){
			$lat = $key['lat'];
			$lng = $key['lng'];
			$tipo = $key['tipo'];
			$texto = $key['texto'];

			$stmt->bind_param("ddss", $lat,$lng,$tipo,$texto);
			$stmt->execute();
		}

		print "true";
		$stmt->close();

	} else if ($action === "solucionar_markers") {

		$arraySolucionados = $_POST['solucionados'];
		if (count($arraySolucionados)>=10){
			print "false";
			return;
		}

		$stmt = $con->prepare("UPDATE markers SET solucionado = 1 WHERE id = ?");

		foreach($arraySolucionados as $key){
			$id = $key['id'];

			$stmt->bind_param("i",$id);
			$stmt->execute();
		}

		$stmt->close();

		print "true";
	}

	$con->close();
?>
