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

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$travail_id = isset($_GET['travail_id']) ? intval($_GET['travail_id']) : null;
$user_id = $_SESSION['user']['id'];
$role = $_SESSION['user']['role'];

// Different queries based on role
if ($role === 'agent') {
    // Agents can only see their own reports
    if (!$travail_id) {
        // Get all reports for this agent
        $query = $conn->prepare("SELECT bf.*, t.titre as travail_titre 
                               FROM brh_forms bf 
                               JOIN travail t ON bf.travail_id = t.id 
                               WHERE bf.agent_id = ? 
                               ORDER BY bf.year DESC, bf.week_number DESC");
        $query->bind_param("i", $user_id);
    } else {
        // Get reports for a specific travail
        $query = $conn->prepare("SELECT bf.*, t.titre as travail_titre 
                               FROM brh_forms bf 
                               JOIN travail t ON bf.travail_id = t.id 
                               WHERE bf.agent_id = ? AND bf.travail_id = ? 
                               ORDER BY bf.year DESC, bf.week_number DESC");
        $query->bind_param("ii", $user_id, $travail_id);
    }
} elseif ($role === 'responsable') {
    // Responsables can see reports for travails they created
    if (!$travail_id) {
        // Get all reports for travails created by this responsable
        $query = $conn->prepare("SELECT bf.*, t.titre as travail_titre, u.fname as agent_name 
                               FROM brh_forms bf 
                               JOIN travail t ON bf.travail_id = t.id 
                               JOIN users u ON bf.agent_id = u.id 
                               WHERE t.responsable_id = ? 
                               ORDER BY bf.year DESC, bf.week_number DESC");
        $query->bind_param("i", $user_id);
    } else {
        // Get reports for a specific travail
        $query = $conn->prepare("SELECT bf.*, t.titre as travail_titre, u.fname as agent_name 
                               FROM brh_forms bf 
                               JOIN travail t ON bf.travail_id = t.id 
                               JOIN users u ON bf.agent_id = u.id 
                               WHERE t.responsable_id = ? AND bf.travail_id = ? 
                               ORDER BY bf.year DESC, bf.week_number DESC");
        $query->bind_param("ii", $user_id, $travail_id);
    }
} elseif ($role === 'admin') {
    // Admins can see all reports
    if (!$travail_id) {
        // Get all reports
        $query = $conn->prepare("SELECT bf.*, t.titre as travail_titre, u.fname as agent_name 
                               FROM brh_forms bf 
                               JOIN travail t ON bf.travail_id = t.id 
                               JOIN users u ON bf.agent_id = u.id 
                               ORDER BY bf.year DESC, bf.week_number DESC");
    } else {
        // Get reports for a specific travail
        $query = $conn->prepare("SELECT bf.*, t.titre as travail_titre, u.fname as agent_name 
                               FROM brh_forms bf 
                               JOIN travail t ON bf.travail_id = t.id 
                               JOIN users u ON bf.agent_id = u.id 
                               WHERE bf.travail_id = ? 
                               ORDER BY bf.year DESC, bf.week_number DESC");
        $query->bind_param("i", $travail_id);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid role"]);
    exit();
}

$query->execute();
$result = $query->get_result();

$reports = [];
while ($row = $result->fetch_assoc()) {
    $reports[] = $row;
}

$query->close();
$conn->close();

echo json_encode(["success" => true, "data" => $reports]);
?>