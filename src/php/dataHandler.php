<?php
	{% if adminPass %}
	  if(!isset($_SESSION)){
			session_start();
		}
		if(!isset($_SESSION['admin'])){
			echo "No esta permitida la ejecucion sin autorizacion";
			exit();
		}
	{% endif %}

	include "_db.php";
	$con = crearConexion();

	if ($con->connect_error) {
	    die("Connection failed: " . $con->connect_error);
	}

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$action = $_POST['action'];

	{% if opciones.mostrar_registros %}
		if ($action === "get_markers") {

			$consulta = "SELECT * FROM markers WHERE solucionado = 0";
			$result = mysqli_query($con, $consulta);

			$row_container = array();

			while($row = mysqli_fetch_array($result)){
				array_push($row_container, $row);
			}

			$row_container = json_encode($row_container);
			echo $row_container;
		}
	{% endif %}
	{% if caracteristicas.usuario.registros.agregar.permitir %}
		if ($action === "push_markers") {

			$arrayMarkers = $_POST['markers'];
			if (count($arrayMarkers)>{{caracteristicas.usuario.registros.agregar.maximo}}){
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

		}
		{% if caracteristicas.usuario.registros.borrar.permitir %}
			else if ($action === "solucionar_markers") {

				$arraySolucionados = $_POST['solucionados'];
				if (count($arraySolucionados)>={{caracteristicas.usuario.registros.agregar.maximo}}){
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
		{% endif %}
	{% endif %}

	$con->close();
?>
