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

$query = "SELECT t.id, t.titre, t.description, t.location, t.date_debut, t.date_fin, t.status, 
                 t.agents_affectes_id, u.fname as agent_name 
          FROM travail t 
          LEFT JOIN users u ON t.agents_affectes_id = u.id";
$result = $conn->query($query);

$travails = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $travails[] = $row;
    }
}

echo json_encode($travails);
$conn->close();