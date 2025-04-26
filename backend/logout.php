<?php
include ('config.php');
session_start();

$_SESSION = [];

session_destroy();

exit;
?>
