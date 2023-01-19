/*
https://muralimahadeva.medium.com/sending-sensor-values-from-esp8266-to-nodejs-server-using-arduino-ide-4b7d3d3e1045
Check out these libraries:
  -> ESP8266WiFi.h
  -> WiFiClient.h
*/

#include <ESP8266WiFi.h>

//////////////////////
// WiFi Definitions //
//////////////////////
const char WiFiAPPSK[] = "test12345";

// "MW70VK_6EA9_2.4G", "s35uq5uq"

//////////////////////
// Pin  Definitions //
//////////////////////
#define awaitLed 4 // not needed anymore, at least not for the purpose of connecting to the wifi
#define connectLed 5 // not needed anymore, at least not for the purpose of indicating connection to the wifi
#define buttonpin 16 // can still be useful
const int analogPin = A0;
const int ledpin  = D1;

WiFiServer server(80);

//========Variables========//
int temp = 0;
String input;
String start;

//========Functions========//
int switchLedState(int temp) {
  if(temp == 0) {
    digitalWrite(ledpin, HIGH);
    temp = 1;
    delay(1000);
  } else if(temp == 1) {
    digitalWrite(ledpin, LOW);
    temp = 0;
    delay(1000);
  }
  return temp;
}

void turnLedOn() {
  digitalWrite(ledpin, HIGH);
  temp = 1;
}

void turnLedOff() {
  digitalWrite(ledpin, LOW);
  temp = 0;
}

//========Setup========//
void setup() {
  initHardware();
  setupWiFi();
  server.begin();
}

//========Main=Loop========//
void loop() {
    // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // Read the first line of the request
  String req = client.readStringUntil('\r');
  client.flush();

  // Match the request
  int val = -1;

  if (req.indexOf("/led/0") != -1) {
    val = 0; // Will write LED low
  } else if (req.indexOf("/led/1") != -1) {
    val = 1; // Will write LED high
  } else if (req.indexOf("/read") != -1) {
    val = -2; // Will print pin reads
  // otherwise request will be invalid.
  }

  // Set GPIOS according to the request
  if (val == 0) {
    turnLedOff();
  } else if (val == 1) {
    turnLedOn();
  }
    

  client.flush();

  // Prepare the response. Start with the common header
  String s = "HTTP/1.1 200 OK\r\n";
  s += "Content-Type: text/html\r\n\r\n";
  s += "<!DOCTYPE HTML>\r\n<html>\r\n";

  // Of we are setting the LED, print out a message saying we did
  if (val >= 0) {
    s += "LED is now ";
    s += (val)?"on":"off";
  } else if (val == -2) { 
    // if we are reading pins, print out those values:
    s += "Analog Pin = ";
    s += String(analogRead(analogPin));
    s += "<br>"; // go to the next line
    s += "Led Pin = ";
    s += String(digitalRead(ledpin));
  } else {
    s += "Invalid Request.<br> Try /led/1, /led/0, or /read.";
  }
  s += "</html>\n";

  client.print(s);
  delay(1);
  Serial.println("Client disconnected");

  // The client will actually be disconnected 
  // when the function returns and 'client' object is detroyed
}

void setupWiFi() {
  WiFi.mode(WIFI_AP);

  // Do a little work to get a unique-ish name. Append the
  // last two bytes of the MAX (HEX'd) to "Thing-":
  uint8_t mac[WL_MAC_ADDR_LENGTH];
  WiFi.softAPmacAddress(mac);
  String macId = String(mac[WL_MAC_ADDR_LENGTH - 2], HEX) +
                 String(mac[WL_MAC_ADDR_LENGTH -1], HEX);
  macId.toUpperCase();
  String AP_NameString = "ESP8266 LED" + macId;

  char AP_NameChar[AP_NameString.length() + 1];
  memset(AP_NameChar, 0, AP_NameString.length() + 1);

  for (int i=0; i<AP_NameString.length(); i++)
    AP_NameChar[i] = AP_NameString.charAt(i);
  
  WiFi.softAP(AP_NameChar, WiFiAPPSK);
}

void initHardware() {
  Serial.begin(115200);
  pinMode(ledpin, OUTPUT);  
  pinMode(awaitLed, OUTPUT);
  pinMode(connectLed, OUTPUT);
  pinMode(buttonpin, INPUT);
  // dont need to set analog_pin as input
  // that is all it can be
}
  
