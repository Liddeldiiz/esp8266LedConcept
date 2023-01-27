// https://arduino-esp8266.readthedocs.io/en/latest/esp8266wifi/readme.html

#include <ESP8266WiFi.h>

#define connectLed 5
#define awaitLed 4

void setup() {
  Serial.begin(115200);
  Serial.println();

  pinMode(connectLed, OUTPUT);
  pinMode(awaitLed, OUTPUT);

  digitalWrite(connectLed, LOW);

  WiFi.begin("your-network-name", "your password"); // I will need to find an alternate way to pass the credentials, so they are not hardcoded here
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(awaitLed, HIGH);
    delay(500);
    Serial.print(".");
    digitalWrite(awaitLed, LOW);
    delay(500);
  }
  digitalWrite(awaitLed, LOW);
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
  digitalWrite(connectLed, HIGH);
}

void loop() {

}
