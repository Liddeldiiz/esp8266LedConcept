#define ledpin 5
#define buttonpin 16

int temp = 0;

int switchLedState(int temp) {
  if(temp == 0) {
    digitalWrite(ledpin, HIGH);
    temp = 1;
    delay(1000);
  } else {
    digitalWrite(ledpin, LOW);
    temp = 0;
    delay(1000);
  }
  return temp;
}

void setup() {
  pinMode(ledpin, OUTPUT);
  pinMode(buttonpin, INPUT);
}

void loop() {
  if(digitalRead(buttonpin) == HIGH) {
    temp = switchLedState(temp);
  }
}
