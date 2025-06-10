<?php
session_start();
include('config.php');

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Check if user is logged in and has appropriate role
if (!isset($_SESSION['user']) || ($_SESSION['user']['role'] !== 'agent' && $_SESSION['user']['role'] !== 'responsable')) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$travail_id = isset($_GET['travail_id']) ? intval($_GET['travail_id']) : null;

if (!$travail_id) {
    echo json_encode(["success" => false, "message" => "Missing travail ID"]);
    exit();
}

// Get the task's start date
$travailQuery = $conn->prepare("SELECT date_debut FROM travail WHERE id = ?");
$travailQuery->bind_param("i", $travail_id);
$travailQuery->execute();
$travailResult = $travailQuery->get_result();
$travail = $travailResult->fetch_assoc();
$travailQuery->close();

if (!$travail) {
    echo json_encode(["success" => false, "message" => "Task not found"]);
    exit();
}

// For agents, only show their own BRH forms
$query = "SELECT bf.*, t.titre as travail_titre, t.date_debut 
          FROM brh_forms bf 
          JOIN travail t ON bf.travail_id = t.id 
          WHERE bf.travail_id = ?";

if ($_SESSION['user']['role'] === 'agent') {
    $query .= " AND bf.agent_id = ?";
}

$query .= " ORDER BY bf.year DESC, bf.week_number DESC";

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

if ($_SESSION['user']['role'] === 'agent') {
    $stmt->bind_param("ii", $travail_id, $_SESSION['user']['id']);
} else {
    $stmt->bind_param("i", $travail_id);
}

$stmt->execute();
$result = $stmt->get_result();
$forms = [];

while ($row = $result->fetch_assoc()) {
    $forms[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    "success" => true,
    "forms" => $forms,
    "start_date" => $travail['date_debut']
]);
?>