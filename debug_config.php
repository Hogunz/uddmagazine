<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Default Disk: " . config('filesystems.default') . "\n";
echo "Public Disk URL Config: " . config('filesystems.disks.public.url') . "\n";
echo "Storage URL for test.jpg on public disk: " . \Illuminate\Support\Facades\Storage::disk('public')->url('test.jpg') . "\n";
