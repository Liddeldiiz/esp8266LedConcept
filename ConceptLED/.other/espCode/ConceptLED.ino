#define ledpin 5
#define buttonpin 16

int temp = 0;

int switchLedState(int temp) {
  if(temp == 0) {
    digitalWrite(ledpin, HIGH);
    temp = 1;
  } else {
    digitalWrite(ledpin, LOW);
    temp = 0;
  }
  return temp;
}

int turnOn(int temp) {
  digitalWrite(ledpin, HIGH);
  temp = 1;
  return temp;
}

int turnOff(int temp) {
  digitalWrite(ledpin, LOW);
  temp = 0;
  return temp;
}

void setup() {
  pinMode(ledpin, OUTPUT);
  pinMode(buttonpin, INPUT);

  digitalWrite(ledpin, LOW);
}

void loop() {
  if(buttonpin==HIGH) {
    temp = switchLedState(temp);
  }
}