<%@page contentType="text/html;charset=gb2312"%>
<%@page import="java.sql.*"%>
<%@page import="java.io.*"%>

<%
		request.setCharacterEncoding("GBK");
		String strUserName = "";
		String strUserPWD = "";
		String strUserDB = "";
		String strTable = "";
		String strServer = "";
		String strPort = "";
		String chartName = "";
		String chartValue = "";
	
		strUserName = request.getParameter("userName");
		strUserPWD = request.getParameter("userPwd");
		strUserDB = request.getParameter("DB");
		strTable = request.getParameter("table");
		strServer = request.getParameter("server");
		strPort = request.getParameter("port");
		chartName = request.getParameter("pieName");
		chartValue = request.getParameter("pieValue");
		
		/*String strUserName = "html5show";
		String strUserPWD = "html5show";
		String strUserDB = "pie0";*/
		
		
		String json = "[";
		
		
		
		try{
			Class.forName("oracle.jdbc.driver.OracleDriver");
			//String url="jdbc:oracle:thin:@202.122.39.38:1521:XE";	
			String url="jdbc:oracle:thin:@"+strServer+":"+strPort+":"+strUserDB;
			Connection conn=DriverManager.getConnection(url,strUserName,strUserPWD);
			Statement stmt=conn.createStatement();	
			ResultSet rs=stmt.executeQuery("select "+chartName+", "+chartValue + " from " +strTable);
			
			ResultSetMetaData resultMetaData = rs.getMetaData();
			int cols = resultMetaData.getColumnCount();

			String resultRow = "";
			for(int i = 1;i<=cols;i++){
				resultRow += resultMetaData.getColumnName(i)+";";
			}
			resultRow = resultRow.toLowerCase();
			
			String temp = "";
			while(rs.next()){
				temp+= "{";
				for (int i = 1; i <= cols; i++)
				{
					String ParName = resultMetaData.getColumnName(i).toLowerCase();
					String value = rs.getString(i);
					if(i == 2){
						int val = Integer.parseInt(value);
						temp += "\"" + ParName + "\":" + val;
					}
					else
						temp += "\"" + ParName + "\":\"" + value + "\"";
					if (i != cols)
					{
						temp = temp + ",";
					}
				}
				temp += "},";
			}
			temp = temp.substring(0, temp.length() - 1);
			json = json + temp + "]";
			
			out.println(json);
			rs.close();
			stmt.close();
			conn.close();
		}catch(Exception e){
			out.print(e);
		}
		%>