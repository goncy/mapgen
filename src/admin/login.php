<?php
  session_start();

  if(isset($_SESSION['admin'])) {
    header('Location: index.php');
    exit();
  }
?>

<?php
	include "php/_db.php";

	$con = crearConexion();
  $login = 0;
  $error = "";
  $usuario;
  $password;

	if ($con->connect_error) {
	    die("Connection failed: " . $con->connect_error);
	}

  if(empty ($_POST['usuario'])){
    $usuario = "";
    $error = "Ingrese un usuario";
  } else {
    $usuario = $_POST['usuario'];
  }

  if(empty ($_POST['password'])){
    $password = "";
    $error = "Ingrese una contraseña";
  } else {
    $password = $_POST['password'];
  }

	if (!empty ($usuario) && !empty ($password)) {
		$stmt = $con->prepare("SELECT count(*) as correcto FROM usuarios WHERE usuario = ? AND password = ?");
		$stmt->bind_param("ss", $usuario, $password);
		$stmt->execute();

		$stmt->bind_result($correcto);

		while ($stmt->fetch()){
			if ($correcto > 0) {
				$login = 1;
			}else{
				$error = "Usuario o contraseña incorrectos";
			}
		}
	}

	if ($login == 1) {
		session_start();
		$_SESSION['admin'] = $usuario;
		header("Location: index.php");
	}
?>

<!DOCTYPE html>
<html class="no-js">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{texto.nombre}} - Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/gpozzo.css">
</head>

<body style="background-color:gainsboro">
    <div class="container">
        <div class="col-md-3 col-md-offset-4">
            <div class="row">
                <h1 style="text-align:center">{{texto.nombre}}</h1>
            </div>
            <div class="row">
                <div class="well">
                    <div class="row">
                    	<form method="POST" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>">
	                        <div class="form-group">
	                            <div class="col-lg-12">
	                                <input type="text" class="form-control" name="usuario" id="usuario" placeholder="Usuario">
	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <div class="col-lg-12">
	                                <input type="password" class="form-control" name="password" id="password" placeholder="Password">
	                            </div>
	                        </div>
	                        <div class="form-group">
	                            <div class="col-lg-12" style="margin-top:25px">
	                            	<button type="submit" class="btn btn-primary btn-block">Iniciar sesion</button>
	                            </div>
	                        </div>
	                    </form>
                    </div>
                </div>
                <div class="row">
                    <p style="text-align:center" id="error"><?php echo $error; ?></p>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
