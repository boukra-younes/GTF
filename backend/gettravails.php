<?php
session_start();
include('config.php');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$query = "SELECT id, titre, description, date_debut, date_fin, status, agents_affectes_id FROM travail";
$result = $conn->query($query);

$travails = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $travails[] = $row;
    }
}

echo json_encode($travails);
$conn->close(); 