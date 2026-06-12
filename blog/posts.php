<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

$posts = [];

foreach (glob(__DIR__ . '/*.html') as $path) {
    if (basename($path) === 'index.html') continue;

    $html = file_get_contents($path);

    preg_match('/class="article-title">([^<]+)</', $html, $t);
    preg_match('/<meta name="description" content="([^"]+)"/', $html, $e);
    preg_match('/class="article-tag">([^<]+)</', $html, $c);

    if (empty($t[1])) continue;

    $posts[] = [
        'slug'     => str_replace('.html', '', basename($path)),
        'title'    => trim($t[1]),
        'excerpt'  => trim($e[1] ?? ''),
        'category' => trim($c[1] ?? ''),
        'mtime'    => filemtime($path),
    ];
}

usort($posts, fn($a, $b) => $b['mtime'] - $a['mtime']);

echo json_encode(
    array_map(fn($p) => array_diff_key($p, ['mtime' => 0]), $posts),
    JSON_UNESCAPED_UNICODE
);
