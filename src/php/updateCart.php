<?php
// Start session if not already started
session_start();

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to log messages
function log_message($message) {
    $log_file = '/var/www/html/php/logs/updateCart.log';
    $log_dir = dirname($log_file);
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0777, true);
    }
    if (!file_exists($log_file)) {
        file_put_contents($log_file, '');
        chmod($log_file, 0666);
    }
    error_log($message, 3, $log_file);
}

// Function to establish database connection
function connectToDatabase() {
    $servername = "db"; 
    $username = "shopuser"; 
    $password = "shoppassword"; 
    $database = "shop"; 

    $conn = new mysqli($servername, $username, $password, $database);

    if ($conn->connect_error) {
        log_message("Connection failed: " . $conn->connect_error . "\n");
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    log_message("Posted data: " . print_r($postData, true) . "\n");

    if (isset($postData['id']) && isset($postData['quantity'])) {
        $productId = intval($postData['id']);
        $quantity = intval($postData['quantity']);
        $conn = connectToDatabase();

        $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE product_id = ?");
        $stmt->bind_param("ii", $quantity, $productId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('error' => 'Failed to update quantity'));
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(array('error' => 'Missing product ID or quantity'));
    }
} else {
    echo json_encode(array('error' => 'Method not allowed'));
}
?>
