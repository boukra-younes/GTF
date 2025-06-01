<?php
// CORS headers
include('config.php');
include('log_activity.php');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include('config.php');

// Join users with agents to get agent-specific status
$query = "
  SELECT 
    u.id,
    u.fname,
    u.email,
    u.status AS user_status,
    a.status AS agent_status
FROM 
    users u
INNER JOIN 
    agents a ON u.id = a.agent_id 
WHERE 
    u.role = 'agent'
    AND a.status = 'free';
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare SELECT statement"]);
    exit();
}

$stmt->execute();
$result = $stmt->get_result();

$agents = [];
while ($row = $result->fetch_assoc()) {
    $agents[] = $row;
}

echo json_encode($agents);

$conn->close();
?>
