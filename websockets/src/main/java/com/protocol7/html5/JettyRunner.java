package com.protocol7.html5;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class JettyRunner {

	public static void main(String[] args) throws Exception {
        Server server = new Server(8080);
        
        ServletContextHandler servletHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
        servletHandler.setContextPath("/"); 
        servletHandler.addServlet(new ServletHolder(new TimeServlet()),"/time");
 
        server.setHandler(servletHandler);
        
        server.start();
        server.join();

	}
}
