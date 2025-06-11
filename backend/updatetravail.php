<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
include('config.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Method not allowed']));
}

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Travail ID is required']));
}

try {
    $conn->begin_transaction();

    // Get current agent assignment
    $stmt = $conn->prepare("SELECT agents_affectes_id FROM travail WHERE id = ?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $current_travail = $result->fetch_assoc();
    $current_agent_id = $current_travail['agents_affectes_id'];
    $stmt->close();

    // Update travail details
    $sql = "UPDATE travail SET titre = ?, description = ?, date_debut = ?, date_fin = ?, status = ?, location = ?";
    $params = [$data['title'], $data['description'], $data['start_date'], $data['end_date'], $data['status'], $data['location']];
    $types = "ssssss";

    // Handle agent assignment
    if (isset($data['agents_affectes_id'])) {
        $sql .= ", agents_affectes_id = ?";
        $params[] = $data['agents_affectes_id'];
        $types .= "i";

        // If there was a previous agent and it's different from the new one
        if ($current_agent_id && $current_agent_id != $data['agents_affectes_id']) {
            // Set previous agent status to active
            $stmt = $conn->prepare("UPDATE users SET user_status = 'active' WHERE id = ?");
            $stmt->bind_param("i", $current_agent_id);
            $stmt->execute();
            $stmt->close();
        }

        // If new agent is assigned, set their status to busy
        if ($data['agents_affectes_id']) {
            $stmt = $conn->prepare("UPDATE agents SET status = 'busy' WHERE agent_id = ?");
            $stmt->bind_param("i", $data['agents_affectes_id']);
            $stmt->execute();
            $stmt->close();
        }
    }

    $sql .= " WHERE id = ? AND responsable_id = ?";
    $params[] = $data['id'];
    $params[] = $_SESSION['user']['id'];
    $types .= "ii";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        include('log_activity.php');
        logUserActivity($_SESSION['user']['id'], 'travail_updated', "Updated travail: " . $data['title']);

        $conn->commit();
        echo json_encode([
            'success' => true,
            'message' => 'Travail updated successfully'
        ]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error updating travail: ' . $e->getMessage()
    ]);
}

$conn->close();
?>