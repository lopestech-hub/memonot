export const exportAsMarkdown = (titulo: string, conteudo: string) => {
  const blob = new Blob([`# ${titulo}\n\n${conteudo}`], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportAsHTML = (titulo: string, conteudo: string) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #1e293b;
    }
    h1 { color: #8b5cf6; margin-bottom: 20px; }
    pre { background: #f1f5f9; padding: 12px; border-radius: 8px; overflow-x: auto; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    blockquote { border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 16px 0; color: #64748b; }
  </style>
</head>
<body>
  <h1>${titulo}</h1>
  <div>${conteudo.replace(/\n/g, '<br>')}</div>
</body>
</html>
  `.trim()

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportAsText = (titulo: string, conteudo: string) => {
  const blob = new Blob([`${titulo}\n${'='.repeat(titulo.length)}\n\n${conteudo}`], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
