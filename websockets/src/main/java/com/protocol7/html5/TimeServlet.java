package com.protocol7.html5;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;

public class TimeServlet extends WebSocketServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// should be application/json, but using text/plain to show in browser during demo
		resp.setContentType("text/plain");
		resp.getWriter().write("{\n\t\"time\": \"" + time() + "\"\n}");
	}

	@Override
	protected WebSocket doWebSocketConnect(HttpServletRequest req, String resp) {
		return new TimeWebSocket();
	}

	class TimeWebSocket implements WebSocket, Runnable {
		
		public void onMessage(byte frame, String data) {
			// ...
		}
		
		public void onConnect(Outbound outbound) {
			this.outbound = outbound;
			
			// ugly demo-only code, do not create your own threads in app servers
			poller = new Thread(this);
			poller.start();
		}

		private Outbound outbound;
		private Thread poller;
		
		public void run() {
			boolean interrupted = false;
			while(!interrupted) {
				try {
					outbound.sendMessage((byte) 0, time());
					
					Thread.sleep(1000);
				} catch (Exception e) {
					break;
				}
			}
		}

		public void onMessage(byte frame, byte[] data, int offset, int length) {
			// not used
		}

		public void onDisconnect() {
			poller.interrupt();
		}
	}

	private String time() {
		// ugly demo-only code
		return new SimpleDateFormat("yyyyMMdd HH:mm:ss").format(new Date());
	}
}
