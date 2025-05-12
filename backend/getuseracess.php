<?php
session_start();

include ('config.php');

// Handle only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["access" => false, "message" => "Invalid request method"]);
    exit();
}

// Read and decode JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true); // use associative array for easier access

if (!$data || !isset($data['route'])) {
    echo json_encode(["access" => false, "message" => "No route specified"]);
    exit();
}

$route = $data['route'];
$allowedRoutes = [
    'admin' => ['/admin','/admin/users','/admin/pending', '/admin/notifications', '/home'],
    'client' => ['/client', '/client-dashboard'],
    'chef' => ['/doctor', '/appointments'],
];

// Check session
if (!isset($_SESSION['user'])) {
    echo json_encode(["access" => false, "message" => "Not logged in"]);
    exit();
}

$role = $_SESSION['user']['role'] ?? null;

if ($role && isset($allowedRoutes[$role]) && in_array($route, $allowedRoutes[$role])) {
    echo json_encode([
        "access" => true,
        "message" => "Access granted",
        "user" => $_SESSION['user'] // Optionally send user info back
    ]);
} else {
    echo json_encode(["access" => false, "message" => "Access denied"]);
}
