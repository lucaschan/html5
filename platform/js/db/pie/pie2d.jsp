<%@page contentType="text/html;charset=gb2312"%>
<%@page import="java.sql.*"%>
<%@page import="java.io.*"%>

<%
		
		String strUserName = "html5show";
		String strUserPWD = "html5show";
		String strUserDB = "pie0";
		String json = "[";
		
		
		
		try{
			Class.forName("oracle.jdbc.driver.OracleDriver");
			String url="jdbc:oracle:thin:@202.122.39.38:1521:XE";	
			Connection conn=DriverManager.getConnection(url,strUserName,strUserPWD);
			Statement stmt=conn.createStatement();	
			ResultSet rs=stmt.executeQuery("select value,name from pie0");	
			
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
					if(i == 1){
						int hang = Integer.parseInt(value);
						temp += "\"" + ParName + "\":" + hang;
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