<?php

$font       = 4;

$img_width  = 48; // <- 960
$img_height = 27; // <- 540

$img_new_width = $img_width * 1;
$img_new_height= $img_height * 1;

// echo $img_new_width . "<br>\n" . $img_new_height;

$filename = "./image.json";


srand((int)date("YmdH"));
$text       = rand(1000, 9999);

$tw = strlen($text) * imagefontwidth($font);
$th = imagefontheight($font);

$im = imagecreate($img_width, $img_height);
$result_im = imagecreatetruecolor($img_new_width, $img_new_height);

$bg = imagecolorallocate($im, 0, 0, 0);
$text_color = imagecolorallocate($im, 255, 0, 0);

imagestring($im, $font, ($img_width-$tw)/2, ($img_height-$th)/2, $text, $text_color);

// imagefilter($im, IMG_FILTER_PIXELATE, 2);

imagecopyresized($result_im, $im, 0, 0, 0, 0, $img_new_width, $img_new_height, $img_width, $img_height);

header('Content-Type: image/png');
imagepng($result_im);

$json = array();
$json["text"] = $text;
$json["pixels"] = array();

for ($y=0, $max_y = $img_new_height; $y < $max_y; $y++) {
    $json["pixels"][$y] = array();
    for ($x=0, $max_x = $img_new_width; $x < $max_x; $x++) {
        $rgb = imagecolorat($result_im, $x, $y);
        // $r = ($rgb >> 16) & 0xFF;
        // $g = ($rgb >> 8) & 0xFF;
        // $b = $rgb & 0xFF;
        $json["pixels"][$y][] = $rgb;//array($r, $g, $b);
    }
}

file_put_contents($filename, json_encode($json));

imagedestroy($result_im);
imagedestroy($im);
