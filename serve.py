#!/usr/bin/env python3
"""Static file server for local preview — avoids os.getcwd() (broken in this sandbox)."""
import functools
import http.server

PORT = 8643
DIRECTORY = "/Users/antoinelemieux/Desktop/Assets/vision-services"

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIRECTORY)

if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler) as httpd:
        print("Serving %s on port %d" % (DIRECTORY, PORT))
        httpd.serve_forever()
