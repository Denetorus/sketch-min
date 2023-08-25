<?php
/** @var string $page_name */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Catalogs: <?=$page_name?></title>
<!--    <script src="/js/components/appPage.js" type="module"></script>-->
</head>
<body>

<script type="module">
    import {AppPage} from "/js/components/appPage.js";
    const app = new AppPage('<?=$page_name?>');
    document.body.appendChild(app);
</script>


</body>
</html>
