
int pos = 0;    // var

//  VARIABLES
int pulsePin = 0;                 // Pulse Sensor purple wire connected to analog pin 0
int blinkPin = 13;                // pin to blink led at each beat
int fadePin = 5;                  // pin to do fancy classy fading blink at each beat
int fadeRate = 0;                 // used to fade LED on with PWM on fadePin

// these variables are volatile because they are used during the interrupt service routine!
volatile int BPM;                   // used to hold the pulse rate
volatile int Signal;                // holds the incoming raw data
volatile int IBI = 600;             // holds the time between beats, must be seeded! 
volatile boolean Pulse = false;     // true when pulse wave is high, false when it's low
volatile boolean QS = false;        // becomes true when Arduoino finds a beat.


// whether the string received form nodejs is complete
// a string is considered complete by the carriage return '\r'
boolean stringComplete = false;

/**
 *
 * arduino board setup
 *
 */

void setup()
{
  pinMode(blinkPin,OUTPUT);         // pin that will blink to your heartbeat!
  pinMode(fadePin,OUTPUT);          // pin that will fade to your heartbeat!
  Serial.begin(115200);             // we agree to talk fast!
  interruptSetup();                 // sets up to read Pulse Sensor
}

/**
 *
 * Default arduino loop function
 * it runs over and over again
 *
 */

void loop()
{
  // read the button state and send a message to the nodejs server
  //listenButtonChanges(digitalRead(buttonPin));
  // update the status of the led light connected to the arduino board
  
  if (QS == true){                       // Quantified Self flag is true when arduino finds a heartbeat
        fadeRate = 255;                  // Set 'fadeRate' Variable to 255 to fade LED with pulse
        sendDataToNode(BPM);   // send heart rate with a 'B' prefix
        QS = false;                      // reset the Quantified Self flag for next time    
     }
  
  ledFadeToBeat();
}

void ledFadeToBeat(){
    fadeRate -= 12;                         //  set LED fade value
    fadeRate = constrain(fadeRate,0,255);   //  keep LED fade value from going into negative numbers!
    analogWrite(fadePin,fadeRate);          //  fade LED
  }


void sendDataToNode(int data ){
    Serial.println(data);                // the data to send culminating in a carriage return
}


