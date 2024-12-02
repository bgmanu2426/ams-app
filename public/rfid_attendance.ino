#include <HTTPClient.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <Wire.h>
#include <SPI.h>
#include <SSD1306Wire.h>
#include <ArduinoJson.h>

#include "Rancho_Regular.h"
#include "secrets.h"

#define SS_PIN 21
#define RST_PIN 5

String formattedTime;

MFRC522 mfrc522(SS_PIN, RST_PIN);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

const char *ssid = WLAN_USERNAME;
const char *password = WLAN_PASSWORD;

#define OLED_SDA 4
#define OLED_SCL 22
SSD1306Wire display(0x3C, OLED_SDA, OLED_SCL);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
  display.init();
  display.flipScreenVertically();
  connectToWiFi();
  timeClient.begin();
  timeClient.setTimeOffset(19800);
}

void loop() {
  if (!WiFi.isConnected()) {
    connectToWiFi();
  }

  timeClient.update();
  formattedTime = timeClient.getFormattedTime();

  display.clear();
  display.setFont(Rancho_Regular_20);
  display.setTextAlignment(TEXT_ALIGN_LEFT);
  display.drawString(13, 10, "Scan Your Card");
  display.drawString(36, 35, formattedTime);
  display.display();

  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  String CardID = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    CardID += mfrc522.uid.uidByte[i];
  }
  CardID.replace(" ", "");
  Serial.print(CardID);
  SendCardID(CardID);
}


void SendCardID(String Card_uid) {
  display.clear();
  display.setFont(ArialMT_Plain_10);
  display.setTextAlignment(TEXT_ALIGN_CENTER_BOTH);
  display.drawString(64, 25, "Verifying the ID");
  display.display();

  if (WiFi.isConnected()) {
    HTTPClient http;
    String getData = String("?uid=") + Card_uid;
    String Link = REQ_URL + getData;
    http.begin(Link);

    int httpCode = http.GET();
    String payload_string = http.getString();
    Serial.println(httpCode);

    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload_string);
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }
    const char* payload = doc["message"];

    if (httpCode == -1) {
      display.clear();
      display.setFont(ArialMT_Plain_10);
      display.setTextAlignment(TEXT_ALIGN_CENTER_BOTH);
      display.drawString(64, 30, "Internal Server ERROR");
      display.display();
      delay(3000);
    } else if (httpCode == 200 || httpCode == 201) {
      display.clear();
      display.setFont(ArialMT_Plain_10);
      display.setTextAlignment(TEXT_ALIGN_LEFT);
      display.drawStringMaxWidth(10, 10, 128, payload);
      display.display();
      delay(3000);
    } else if (httpCode == 404) {
      display.clear();
      display.setFont(ArialMT_Plain_10);
      display.setTextAlignment(TEXT_ALIGN_LEFT);
      display.drawStringMaxWidth(10, 10, 128, payload);
      display.display();
      delay(3000);
    } else {
      display.clear();
      display.setFont(ArialMT_Plain_10);
      display.setTextAlignment(TEXT_ALIGN_CENTER_BOTH);
      display.drawString(64, 30, "HTTP ERROR :" + String(httpCode));
      display.display();
      delay(3000);
    }
    http.end();
  }
}

void connectToWiFi() {
  display.clear();
  display.setFont(ArialMT_Plain_10);
  display.setTextAlignment(TEXT_ALIGN_CENTER_BOTH);
  display.drawString(64, 34, "Initializing");
  display.display();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startTime < 10000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("Connected to");
    Serial.println(ssid);

    display.clear();
    display.setFont(ArialMT_Plain_10);
    display.setTextAlignment(TEXT_ALIGN_CENTER_BOTH);
    display.drawString(64, 30, "Connected to :" + String(ssid));
    display.display();
  } else {
    display.clear();
    display.setFont(ArialMT_Plain_10);
    display.setTextAlignment(TEXT_ALIGN_CENTER_BOTH);
    display.drawString(64, 28, "Failed to connect");
    display.drawString(64, 38, "to Wi-Fi");
  }
  display.display();
  delay(2000);
}