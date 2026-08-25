<#
.SYNOPSIS
    headroom.ps1 — Локальная утилита для сжатия длинного вывода терминала
.DESCRIPTION
    Сжимает огромные логи и выводы тестов для защиты контекста от выгорания.
    Работает с PowerShell 5.1+ (Windows PowerShell).
.EXAMPLE
    npm run build | powershell -File scripts/headroom.ps1
.EXAMPLE
    npx eslint src/ | powershell -File scripts/headroom.ps1 -MaxLines 100
#>

param(
    [Parameter(Mandatory=$false)]
    [int]$MaxLines = 200,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxChars = 10000,
    
    [Parameter(Mandatory=$false)]
    [int]$Head = 100,
    
    [Parameter(Mandatory=$false)]
    [int]$Tail = 50
)

# Читаем весь stdin через Console.In (работает с pipeline в PowerShell 5.1)
$lines = [System.Collections.Generic.List[string]]::new()
while ($null -ne ($line = [Console]::In.ReadLine())) {
    $lines.Add($line)
}

$totalLines = $lines.Count
$totalChars = ($lines | Measure-Object -Character).Characters

# Если вывод короткий — возвращаем как есть
if ($totalLines -le $MaxLines -and $totalChars -le $MaxChars) {
    $lines | ForEach-Object { Write-Output $_ }
    exit 0
}

# Сжимаем: берём первые Head и последние Tail строки
$output = [System.Collections.Generic.List[string]]::new()
$output.Add("════════════════════════════════════════════════════════════════")
$output.Add("HEADROOM: Сжатие вывода ($totalLines строк → $($Head + $Tail) строк)")
$output.Add("════════════════════════════════════════════════════════════════")

if ($totalLines -le ($Head + $Tail)) {
    # Если строк мало — просто обрезаем
    $lines | ForEach-Object { $output.Add($_) }
} else {
    # Берём первые Head строк
    for ($i = 0; $i -lt $Head; $i++) {
        $output.Add($lines[$i])
    }
    $output.Add("")
    $output.Add("... [пропущено $($totalLines - $Head - $Tail) строк] ...")
    $output.Add("")
    # Берём последние Tail строки
    for ($i = $totalLines - $Tail; $i -lt $totalLines; $i++) {
        $output.Add($lines[$i])
    }
}

$output.Add("════════════════════════════════════════════════════════════════")
$output.Add("Исходный размер: $totalLines строк, $totalChars символов")
$output.Add("Сжатый размер: $($output.Count) строк")
$output.Add("════════════════════════════════════════════════════════════════")

$output | ForEach-Object { Write-Output $_ }