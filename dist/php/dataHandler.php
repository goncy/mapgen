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

		$consulta = "SELECT * FROM markers WHERE solucionado = 0";
		$result = mysqli_query($con, $consulta);

		$row_container = array();

		//Validamos si el nombre del administrador existe en la base de datos o es correcto
		while($row = mysqli_fetch_array($result)){
			array_push($row_container, $row);
		}

		$row_container = json_encode($row_container);
		echo $row_container;
	}else if ($action === "push_markers") {

		$arrayMarkers = $_POST['markers'];
		if (count($arrayMarkers)>=6){
			print "false";
			return;
		}

		$stmt = $con->prepare("INSERT INTO markers (lat, lng, tipo, texto, ip) VALUES (?, ?, ?, ?, ?)");

		foreach($arrayMarkers as $key){
			$lat = $key['lat'];
			$lng = $key['lng'];
			$tipo = $key['tipo'];
			$texto = $key['texto'];
			$ip = $_POST['ip'];

			$stmt->bind_param("ddsss", $lat,$lng,$tipo,$texto,$ip);
			$stmt->execute();
		}

		print "true";
		$stmt->close();
		
	}else if ($action === "solucionar_markers") {

		$arraySolucionados = $_POST['solucionados'];
		if (count($arraySolucionados)>=3){
			print "false";
			return;
		}

		$stmt2 = $con->prepare("UPDATE markers SET solucionado = 1, ip = ? WHERE id = ?");

		foreach($arraySolucionados as $key){
			$id = $key['id'];
			$ip = $_POST['ip'];

			$stmt2->bind_param("si",$ip,$id);
			$stmt2->execute();
		}

		print "true";

		$stmt2->close();
	}

	$con->close();
?>