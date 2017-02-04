<?php
  session_start();

  if(!isset($_SESSION['{{ texto.nombre }}'])) {
    header('Location: login.php');
  }
?>