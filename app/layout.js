export const metadata = { title: "Kaizen VPS Server" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{margin:0,fontFamily:"Inter,sans-serif",background:"#0a0e1a",color:"#fff",minHeight:"100vh"}}>
        {children}
      </body>
    </html>
  );
}
