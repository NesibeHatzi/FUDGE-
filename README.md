# PRIMA
Abgabe für die Veranstaltung Prototyping interactive media-applications and games, für die Hochschule Furtwangen.

[Link zur Abgabe](https://nesibehatzi.github.io/PRIMA-Endabgabe/FudgeSpaceShooter/Main.html)

## Checkliste für Leistungsnachweis
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU

| Nr | Bezeichnung           | Inhalt                                                                                                                                                                                                                                                                         |
|---:|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    | Titel                 | SSD- Space Shooter Destroyer
|    | Name                  | Nesibe Hazirbulan  
|    | Matrikelnummer        | 253551
|  1 | Nutzerinteraktion     | Der Nutzer kann über Tastatur das Spiel steuern. Er bewegt die Spielfigur mit den WASD Tasten und feuert mit der Leertaste.                                                                                                                                                |
|  2 | Objektinteraktion     | Der Spieler kann sowohl mit Genern kollidieren, als auch auf sie schießen. Der Spieler und der Gegner erhalten bei der Kollision Schaden. Wenn der Spieler mit einer Kugel vom Gegner kollidiert, fügt die Kugel dem Spieler Schaden zu, welbes gilt wenn der Gegner auf den Spieler schießt.                                                                                                                                                                                |
|  3 | Objektanzahl variabel | Das Spiel generiert (bis zu einer obergrenze, die vom Schwierigskeitgrad abhängt) Gegner. Gegner werden aus der Szene entfernt wenn sie besiegt wurden. Kugeln die verschossen werden werden ebenfalls dynamisch generiert und besitzen jeweils eine Lebenszeit. Wenn sie mit ihrem Ziel kollidieren, oder ihre Lebenszeit abgelaufen ist, werden sie aus der Szene entfernt.                                                                                                                                                      |
|  4 | Szenenhierarchie      | Die Szene wird in 3 Knoten aufgeteilt. Der Player-Node dient dazu, schnell auf die Spielfigur referenzieren zu können. Der Enemies-Node dient dazu, alle Gegner zu halten. Der Bullets Node enthält alle Kugeln. Diese Szenenhierarchie erlaubt es, die Szene schnell aufzubauen und zu Bereinigen für einen Neustart.                                                                                                                                                           |
|  5 | Sound                 | Es gibt Backgroundmusic während des Spiels und es wird ein Soundeffect abgespielt, wenn der Spieler schießt.                                                           |
|  6 | GUI                   | Im Hauptmenü kann der Spieler den Schwierigkeitsgrad festlegen.                                                                                  |
|  7 | Externe Daten         | Der Highscore soll in einer Externen Datei gespeichert werden (Nicht implementiert)                                                                                    |
|  8 | Verhaltensklassen     | Spielfigur, Alle Gegnertypen, die in externen Dateien abgelegt sind. Welche Klassen sind dies und welches Verhalten wird dort beschrieben?                                                                                             |
|  9 | Subklassen            | Enemy und Bullet erben jeweils von der Klasse Entity, Entity und die Spielfigur erben von ƒ.Node. Weitere Gegnertypen erben von Enemy und es gibt eine Klasse EnemyBullet, die von Bullet erbt.|
| 10 | Maße & Positionen     | Die Figuren sind relativ klein gehalten, um den Screen besser zu nutzen. Kugeln sind etwa 1/6 einer Figur, damit der Spieler gut ihnen ausweichen kann.|
| 11 | Event-System          | Das Eventsystem wird benutzt, um Spielobjekte zu updaten.                                                    |
