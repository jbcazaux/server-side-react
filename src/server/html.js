const Html = ({ body, title }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
      <div id="root">${body}</div>
      <script src="/public/client.js"></script>
    </body>
  </html>
`;

export default Html;