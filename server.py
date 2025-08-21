#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    # カレントディレクトリを設定
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # サーバーを起動
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"サーバーを起動しました: http://localhost:{PORT}")
        print("Ctrl+C で停止します")
        
        # ブラウザを自動で開く
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nサーバーを停止しました")
            sys.exit(0)

if __name__ == "__main__":
    main()
