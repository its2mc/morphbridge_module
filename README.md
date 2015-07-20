Morphbridge is a platform that allows scripts (currently nodejs) to pass messages to each other in a mesh network structure.
Although the main idea was to help developers of IOT applications quickly set up the communication infrastructure, it has other applications such as connecting multiple scripts connecting with multiple platforms and with multiple protocols.

The github repository contains examples of how the module is used. Standalone nodejs scripts can send messages to each other and recieve messages from one another in a mesh network structure. Therefore, if you run the http_node.js(http server) script messages recieved by that script can be seen by the tcp_node.js script(tcp server). This makes it dead easy to integrate different platforms with different protocols. So if you want to send messages from a webpage to your arduino. If you are comfortable with websockets and tcp servers then you can instantiate those two nodes and communicate. If you are more comfortable having your arduino make http requests, then fire up the http server and get thing quickly going.

The plan is to add all kinds of protocols available on nodejs including zigby, tcp, mqtt, rabbitmq, bluetooth, serial, e.t.c. As long as there is a nodejs module for it, it can work with morphbridge. The mother of all bridges. 

The coolest thing about morphbride is that you can start and have any node running without destroying the mesh network. Start in any order and even have some running while you are working on a new one which can join into the messages streams. Shut it down but you will still have the rest of your nodes working.

**Looking for collaborators. If interested hit me up on its2uraps@gmail.com with the subject 'Morphbridge collaboration'.**