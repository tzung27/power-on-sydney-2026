param([string]$Pptx, [string]$OutDir, [int]$Width = 1600, [int]$Height = 900)
# Export every slide of a deck to PNG through PowerPoint.
New-Item -ItemType Directory -Force $OutDir | Out-Null
$app = New-Object -ComObject PowerPoint.Application
try {
  $pres = $app.Presentations.Open($Pptx, $true, $false, $false)
  foreach ($s in $pres.Slides) {
    $s.Export((Join-Path $OutDir ("slide-{0:D2}.png" -f $s.SlideIndex)), "PNG", $Width, $Height)
  }
  $pres.Close()
} finally {
  $app.Quit()
  [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($app)
}
