<?php
include ('config.php');
include ('log_activity.php');
session_start();

// Log the logout activity if user is logged in
if (isset($_SESSION['user']) && isset($_SESSION['user']['id'])) {
    logUserActivity($_SESSION['user']['id'], 'logout', 'User logged out');
}

$_SESSION = [];

session_destroy();

exit;
?>
