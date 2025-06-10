<?php
session_start();
include('config.php');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if user is logged in and has agent role
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'agent') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

// Get the agent ID from the session
$agent_id = $_SESSION['user']['id'];

// Query to get tasks assigned to this agent
$query = "SELECT t.id, t.titre, t.description, t.date_debut, t.date_fin, t.status, 
                 t.agents_affectes_id, u.fname as agent_name 
          FROM travail t 
          LEFT JOIN users u ON t.agents_affectes_id = u.id
          WHERE t.agents_affectes_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $agent_id);
$stmt->execute();
$result = $stmt->get_result();

$travails = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $travails[] = $row;
    }
}

echo json_encode($travails);
$stmt->close();
$conn->close();
?>