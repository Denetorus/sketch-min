<?php
/** @var array $SK_props */
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Home Sketch</title>

    <link rel="stylesheet" href="/css/normalize.css">
    <link rel="stylesheet" href="/css/sc-window.css">
</head>
<body>
    <h1>Welcome to SKETCH framework!!!</h1>
    <h2>SK Config:</h2>
    <?php
    foreach ($SK_props as $key=> $value) {
            echo "<h4>".$key.":";
            var_dump($value);
            echo "</h4>";
        }
    ?>
</body>
</html>
