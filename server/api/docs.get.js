export default defineEventHandler((event) => {
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>API Documentation - Modul Tunjangan Transport</title>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css" />
    </head>
    <body style="margin: 0; background: #fafafa;">
      <div id="swagger-ui"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: "/swagger.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ]
          });
        };
      </script>
    </body>
    </html>
  `;

  setHeader(event, 'content-type', 'text/html; charset=utf-8');
  return html;
});
