param([string]$Docx, [string]$Pdf)
# Open in Word, refresh the table of contents and fields, save, and export a PDF for review.
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
  $doc = $word.Documents.Open($Docx)
  foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
  $doc.Fields.Update() | Out-Null
  $doc.Save()
  $doc.ExportAsFixedFormat($Pdf, 17)
  "pages: " + $doc.ComputeStatistics(2)
  $doc.Close()
} finally {
  $word.Quit()
  [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word)
}
