const Html = ({ body, title, reduxState }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
      <div id="root">${body}</div>
      <script>window.__REDUX_STATE__ = ${JSON.stringify(reduxState).replace(/</g, '\\u003c')}</script>
      <script src="/public/client.js"></script>
    </body>
  </html>
`;

export default Html;