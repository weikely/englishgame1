import http.server
import os
import urllib.parse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        
        if path.startswith('/assets/') or path.startswith('/favicon.svg'):
            return super().do_GET()
        
        self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    os.chdir(os.path.join(os.path.dirname(__file__), 'dist'))
    server_address = ('0.0.0.0', 5174)
    httpd = http.server.HTTPServer(server_address, SPAHandler)
    print(f"Serving at http://{server_address[0]}:{server_address[1]}")
    httpd.serve_forever()